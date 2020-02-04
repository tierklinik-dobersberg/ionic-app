import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DxrService } from '../dxr.service';
import { Subscription, of } from 'rxjs';
import { flatMap, combineLatest, map } from 'rxjs/operators';

import * as dwv from 'dwv';
import * as AuthN from 'keratin-authn';
import { environment } from 'src/environments/environment';

// decode query
dwv.utils.decodeQuery = dwv.utils.base.decodeQuery;
// progress
dwv.gui.displayProgress = () => {};
// get element
dwv.gui.getElement = function(containerDivId, name) {
	const ret = dwv.gui.base.getElement(containerDivId, name);
	console.log(containerDivId, name, ret);
	
	return ret;
}
// refresh element
dwv.gui.refreshElement = dwv.gui.base.refreshElement;

// Image decoders (for web workers)
dwv.image.decoderScripts = {
    jpeg2000: 'assets/dwv/decoders/pdfjs/decode-jpeg2000.js',
    'jpeg-lossless': 'assets/dwv/decoders/rii-mango/decode-jpegloss.js',
    'jpeg-baseline': 'assets/dwv/decoders/pdfjs/decode-jpegbaseline.js',
    rle: 'assets/dwv/decoders/dwv/decode-rle.js'
};

// actual component

@Component({
  selector: 'app-dwv',
  templateUrl: './dwv.page.html',
  styleUrls: ['./dwv.page.scss'],
})
export class DwvPage implements OnInit, OnDestroy {
	private routeSubscription: Subscription = Subscription.EMPTY;

	dwvApp: any | null = null;
	study: any | null = null;
	series: any | null = null;

	readonly tools = ['Scroll', 'ZoomAndPan', 'WindowLevel', 'Draw'];
	
	constructor(private activeRoute: ActivatedRoute,
		private dxr: DxrService) {}
		
	getImageUrl(wadoURI: string): string {
		const scheme = environment.dxrUrl.startsWith('http://') ? 'http://' : 'https://';
		return wadoURI.replace('dicomweb://', scheme) + '&contentType=application/dicom';
	}

	ngOnInit() {
		this.dwvApp = new dwv.App();
			this.dwvApp.init({
				containerDivId: 'dwv',
				tools: this.tools,
				shapes: ['Ruler'],
				isMobile: false,
			});
			
			this.dwvApp.addEventListener('load-progress', event => {
				console.log('load-progress', event);
			})
			
			this.dwvApp.addEventListener('load-end', event => {
				console.log('load-end', event);
				console.log(this.dwvApp.getTags());
				
				this.dwvApp.fitToSize(this.dwvApp.getLayerContainerSize());
			})

		this.routeSubscription = this.activeRoute.paramMap
			.pipe(
				flatMap(params => {
					return this.dxr.loadStudy(params.get('studyID'))
						.pipe(
							map(study => [params.get('seriesID'), study])
						)
				}),
			)
			.subscribe({
				next: ([seriesID, response]) => {

					const study = response.studies[0];
					
					this.study = study;
					this.series = study.seriesList.find(s => s.seriesInstanceUid === seriesID);
					
					const imageUrl = this.getImageUrl(this.series.instances[0].url);
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
		this.dwvApp.abortLoad();
		this.dwvApp.reset();
		this.dwvApp = null;
	}

}
