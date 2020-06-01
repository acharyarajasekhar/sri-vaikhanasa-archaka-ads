import { Injectable } from '@angular/core';
import { ImagePickerOptions, OutputType, ImagePicker } from '@ionic-native/image-picker/ngx';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class NativeImagePickerService {

    private options: ImagePickerOptions = {
        maximumImagesCount: 1,
        quality: 60,
        outputType: OutputType.DATA_URL
    }

    constructor(
        private imagePicker: ImagePicker,
        private toast: ToastService,
        private busy: BusyIndicatorService
    ) { }

    public async pick(noOfImages: number = 1): Promise<string[]> {

        let images = [];

        try {

            const hasPermission = await this.imagePicker.hasReadPermission();
            if (!hasPermission) await this.imagePicker.requestReadPermission();

            try {

                const hasPermission = await this.imagePicker.hasReadPermission();

                if (!!hasPermission) {

                    this.options.maximumImagesCount = noOfImages;
                    const imageUrls = await this.imagePicker.getPictures(this.options);

                    if (!!imageUrls && imageUrls.length > 0) {
                        this.busy.show();
                        _.forEach(imageUrls, async (imageUrl) => {
                            let base64 = `data:image/jpeg;base64,${imageUrl}`;
                            images.push(base64);
                        })
                        this.busy.hide();
                    }
                }

            }
            catch (err) {
                let e = { message: "Error while selecting images: " + JSON.stringify(err) }
                this.toast.error(e);
            }
        }
        catch (err) {
            let e = { message: "Error while checking imagepicker permission: " + JSON.stringify(err) }
            this.toast.error(e);
        }

        return images;

    }

}
