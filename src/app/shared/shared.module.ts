import { NgModule } from '@angular/core';
import { SecureImagePipe } from './secure-image.pipe';
import { DxrDatePipe } from './dxr-date.pipe';
import { OhifOwnerNamePipe } from './ohif-owner-name.pipe';

@NgModule({
    declarations: [
        SecureImagePipe,
        DxrDatePipe,
        OhifOwnerNamePipe
    ],
    exports: [
        SecureImagePipe,
        DxrDatePipe,
        OhifOwnerNamePipe
    ]
})
export class SharedModule {}