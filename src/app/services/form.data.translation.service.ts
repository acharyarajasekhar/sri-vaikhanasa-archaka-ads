import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FormDataTranslationService {

    public formConfig: any;

    private translationKeys: Array<string> = [];
    private translations: any;

    constructor(
        private translate: TranslateService
    ) {
        let formConfig = environment.formConfigs;
        this.translationKeys = [];
        for (let fc in formConfig) {
            if (!!formConfig[fc].controls && formConfig[fc].controls.length > 0) {
                for (let c in formConfig[fc].controls) {
                    this.translationKeys.push("FORM_DATA." + formConfig[fc].translationKey + "." + formConfig[fc].controls[c].label);
                    if (!!formConfig[fc].controls[c].validators) {
                        for (let v in formConfig[fc].controls[c].validators) {
                            if (!!formConfig[fc].controls[c].validators[v].message) {
                                this.translationKeys.push("FORM_DATA." + formConfig[fc].translationKey + "." + formConfig[fc].controls[c].validators[v].message);
                            }
                        }
                    }
                    if (!!formConfig[fc].controls[c].options && formConfig[fc].controls[c].options.length > 0) {
                        for (let o in formConfig[fc].controls[c].options) {
                            if (!!formConfig[fc].controls[c].options[o].text) {
                                this.translationKeys.push("FORM_DATA." + formConfig[fc].translationKey + "." + formConfig[fc].controls[c].options[o].text);
                            }
                        }
                    }
                }
            }
        }

        this.fetchLangTexts();
        this.translate.onLangChange.subscribe(() => {
            this.fetchLangTexts();
        });

    }

    private fetchLangTexts() {
        this.translate.get(this.translationKeys).pipe(take(1)).subscribe((translations: string) => {
            this.translations = translations;
            console.log(translations)
        });
    }

    init() { }

    async setFormConfigWithTranslatedText(formConfig: any) {

        let newFormConfig = JSON.parse(JSON.stringify(formConfig));
        let translationKeyPath = "FORM_DATA." + formConfig.translationKey;

        return new Promise((res) => {
            let controlsWithTranslation = {};
            for (let t in this.translations) {
                if (t.startsWith(translationKeyPath)) {
                    controlsWithTranslation[t] = this.translations[t];
                }
            }
            if (!!newFormConfig.controls && newFormConfig.controls.length > 0) {
                for (let c in newFormConfig.controls) {
                    let key = "FORM_DATA." + newFormConfig.translationKey + "." + newFormConfig.controls[c].label;
                    newFormConfig.controls[c].label = controlsWithTranslation[key];

                    if (newFormConfig.controls[c].validators) {
                        for (let v in newFormConfig.controls[c].validators) {
                            let vkey = "FORM_DATA." + newFormConfig.translationKey + "." + newFormConfig.controls[c].validators[v].message;
                            newFormConfig.controls[c].validators[v].message = controlsWithTranslation[vkey];
                        }
                    }

                    if (!!newFormConfig.controls[c].options && newFormConfig.controls[c].options.length > 0) {
                        for (let o in newFormConfig.controls[c].options) {
                            if (!!newFormConfig.controls[c].options[o].text) {
                                let okey = "FORM_DATA." + newFormConfig.translationKey + "." + newFormConfig.controls[c].options[o].text;
                                newFormConfig.controls[c].options[o].text = controlsWithTranslation[okey];
                            }
                        }
                    }
                }
            }
            res(newFormConfig);
        });
    }
}