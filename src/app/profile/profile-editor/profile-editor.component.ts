import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlBase, ControlsService } from '@acharyarajasekhar/dynamic-forms';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { FormDataTranslationService } from 'src/app/services/form.data.translation.service';

@Component({
  templateUrl: './profile-editor.component.html',
  styleUrls: ['./profile-editor.component.css']
})
export class ProfileEditorComponent implements OnInit {

  @ViewChild('dynamicForm', { static: true }) dynamicForm: any;

  controls: ControlBase<any>[];
  form: FormGroup;
  submitted: any;
  formConfig: any;

  profile: any;

  isReadyToRender: boolean = false;

  constructor(
    private controlSvc: ControlsService,
    private modalController: ModalController,
    private formDataTranslationService: FormDataTranslationService,
    private zone: NgZone
  ) { }

  ngOnInit() {

    this.initDynamicFormControls().then(() => {
      this.isReadyToRender = true;
      this.initFormGroup();
      if (!!this.profile && !!this.profile.id) {
        this.setInitialFormValues();
      }
    })

  }

  private initDynamicFormControls() {
    return new Promise((res) => {
      this.formConfig = environment.formConfigs.profileEditForm;
      this.formDataTranslationService.setFormConfigWithTranslatedText(this.formConfig)
        .then((translatedFormConfig: any) => {          
          if (!!translatedFormConfig) {
            this.zone.run(() => {
              this.controls = this.controlSvc.getControls(translatedFormConfig.controls);
            })
          }
          res();
        })
    })
  }

  private initFormGroup() {
    this.form = new FormGroup({});
    this.form.valueChanges.subscribe(val => { this.submitted = val; });
  }

  private setInitialFormValues() {
    this.zone.run(() => {
      this.controls.forEach(c => c.value = this.profile[c.name]);
    })
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  private handleUndefined = (obj) => {
    Object.keys(obj).forEach(key => {
      if (obj[key] && typeof obj[key] === 'object') this.handleUndefined(obj[key]);
      else if (obj[key] === undefined) obj[key] = null;
    });
    return obj;
  };

  onSave() {
    if (this.form.invalid) {
      this.dynamicForm.showErrors();
    }
    else {
      this.handleUndefined(this.submitted);
      this.modalController.dismiss(this.submitted, 'ok');
    }
  }

}
