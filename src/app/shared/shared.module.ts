import { NgModule } from '@angular/core';
import { SecureImagePipe } from './secure-image.pipe';
import { DxrDatePipe } from './dxr-date.pipe';

@NgModule({
    declarations: [SecureImagePipe, DxrDatePipe],
    exports: [
        SecureImagePipe,
        DxrDatePipe
    ]
})
export class SharedModule {}