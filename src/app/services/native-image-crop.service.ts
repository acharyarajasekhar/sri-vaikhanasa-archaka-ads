import { Injectable } from '@angular/core';
import { Crop } from '@ionic-native/crop/ngx';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';

@Injectable({
    providedIn: 'root'
})
export class NativeImageCropService {

    constructor(
        private crop: Crop,
        private toast: ToastService
    ) { }

    public cropImage(imageSrc): Promise<string> {
        return new Promise((resolve) => {
            this.crop.crop(imageSrc, { quality: 50 }).then(newImage => resolve(newImage)).catch(error => {
                let e = { message: "Error while cropping: " + JSON.stringify(error) };
                this.toast.error(e);
                resolve(imageSrc);
            })
        })
    }
}