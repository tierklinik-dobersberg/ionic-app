import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxrService } from '../dxr.service';
import { Subscription, of } from 'rxjs';
import { flatMap, combineLatest, map, take } from 'rxjs/operators';

import * as dwv from 'dwv';
import * as AuthN from 'keratin-authn';
import { environment } from 'src/environments/environment';
import { ActionSheetController } from '@ionic/angular';
import { ActionSheetButton } from '@ionic/core';

dwv.utils.decodeQuery = dwv.utils.base.decodeQuery;

dwv.gui.displayProgress = () => { };

/**
 * renderes is used to track active DcwPage components that are not yet disposed
 * because angular/ionic keep their views cached for navigating back in history.
 * The ID for the DWV render element is always `dwv` but passed as `dwv/${DwvPageID}`
 * so we can return the correct version
 */
const renderers : {
    [key: string]: DwvPage
} = {};
dwv.gui.base.getElement = function(containerDivId, name) {
    const id = containerDivId.split('/')[1];
    containerDivId = 'dwv';
    
    if (!renderers[id]) {
        throw new Error(`failed to get DWV renderer element`);
    }
    
    const parent: HTMLElement = renderers[id].element.nativeElement;
    const elements = parent.getElementsByClassName(name);
    // getting the last element since some libraries (ie jquery-mobile) create
    // span in front of regular tags (such as select)...
    return elements[elements.length-1];
}

dwv.gui.getElement = dwv.gui.base.getElement;

// refresh element
dwv.gui.refreshElement = dwv.gui.base.refreshElement;

dwv.i18nInitialise("auto", "assets/");

// Image decoders (for web workers)
dwv.image.decoderScripts = {
    jpeg2000: 'assets/dwv/decoders/pdfjs/decode-jpeg2000.js',
    'jpeg-lossless': 'assets/dwv/decoders/rii-mango/decode-jpegloss.js',
    'jpeg-baseline': 'assets/dwv/decoders/pdfjs/decode-jpegbaseline.js',
    rle: 'assets/dwv/decoders/dwv/decode-rle.js'
};

const style = dwv.html.Style;
dwv.html.Style = function() {
    let s = new style();
    s.setScale(0.2);

    return s;
}

// actual component

interface Tool {
    label: string;
    id: string;
    icon: string;
}

var uniqueDwvId = 0;

@Component({
    selector: 'app-dwv',
    templateUrl: './dwv.page.html',
    styleUrls: ['./dwv.page.scss'],
})
export class DwvPage implements OnInit, OnDestroy {
    private routeSubscription: Subscription = Subscription.EMPTY;

    readonly getUrl = this.dxr.getThumbnailUrl;

    dwvApp: any | null = null;
    study: any | null = null;
    series: any | null = null;
    loadProgress: number = 0;
    selectedTool: string = '';
    id: string;

    toolButtons: Tool[] = [
        {
            label: 'Zeichnen / Messen',
            icon: 'create',
            id: 'Draw',
        },
        {
            label: 'Zoom/Move',
            icon: 'move',
            id: 'ZoomAndPan'
        },
        {
            label: 'Window Level',
            icon: 'switch',
            id: 'WindowLevel'
        }
    ]

    readonly shapes: ActionSheetButton[] = [
        {
            text: 'Pfeil',
            role: 'Arrow'
        },
        {
            text: 'Lineal',
            role: 'Ruler'
        },
        {
            text: 'Winkelmesser',
            role: 'Protractor',
        },
        {
            text: 'Rechteck',
            role: 'Rectangle'
        },
        {
            text: 'Roi',
            role: 'Roi'
        },
        {
            text: 'Ellipse',
            role: 'Ellipse'
        },
        {
            text: 'Frei',
            role: 'FreeHand'
        }
    ]

    constructor(private activeRoute: ActivatedRoute,
        private dxr: DxrService,
        private actionController: ActionSheetController,
        public element: ElementRef<any>,
        private changeDetector: ChangeDetectorRef) {

        dwv.gui.displayProgress = (percent: number) => {
            if (this.loadProgress < 100) {
                this.loadProgress = percent;
                this.changeDetector.markForCheck();
            }
        }

        this.id = `${++uniqueDwvId}`;
        renderers[this.id] = this;
    }

    async selectTool(tool: Tool) {
        if (tool.id == 'Draw') {
            const sheet = await this.actionController.create({
                header: 'Form / Messung',
                buttons: this.shapes,
            });

            sheet.present()
            const result = await sheet.onDidDismiss();

            if (result.role === 'backdrop') {
                return;
            }

            this.selectedTool = tool.id;
            this.dwvApp.onChangeTool({ currentTarget: { value: tool.id } })
            this.dwvApp.onChangeShape({ currentTarget: { value: result.role } })
        }

        this.dwvApp.onChangeTool({ currentTarget: { value: tool.id } })
        this.selectedTool = tool.id;
    }

    getImageUrl(wadoURI: string): string {
        const scheme = environment.dxrUrl.startsWith('http://') ? 'http://' : 'https://';
        return wadoURI.replace('dicomweb://', scheme) + '&contentType=application/dicom';
    }

    ngOnInit() {
        this.dwvApp = new dwv.App();
        this.dwvApp.init({
            containerDivId: `dwv/${this.id}`,
            tools: this.toolButtons.map(b => b.id),
            shapes: this.shapes.map(s => s.role),
            isMobile: false,
            useWebWorkers: true,
        });

        this.dwvApp.addEventListener('load-end', event => {
            this.loadProgress = 101;
        })

        this.routeSubscription = this.activeRoute.paramMap
            .pipe(
                flatMap(params => {
                    return this.dxr.loadStudy(params.get('studyID'))
                        .pipe(
                            map(study => [params.get('seriesID'), params.get('instanceID'), study])
                        )
                }),
                take(1)
            )
            .subscribe({
                next: ([seriesID, instanceID, response]) => {
                    const study = response.studies[0];

                    this.study = study;
                    this.series = study.seriesList.find(s => s.seriesInstanceUid === seriesID);


                    const imageUrl = this.getImageUrl(this.series.instances.find(i => i.sopInstanceUid == instanceID).url);

                    this.dwvApp.loadURLs([imageUrl], {
                        Authorization: `Bearer ${AuthN.session()}`
                    });
                },
                error: err => console.error(err),
            });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();

        // abort loading if there's anything in progress
        if (!!this.dwvApp) {
            this.dwvApp.abortLoad();
            this.dwvApp.resetLayout();
            this.dwvApp.reset();
            this.dwvApp = null;
        }

        delete(renderers[this.id]);
    }

}
