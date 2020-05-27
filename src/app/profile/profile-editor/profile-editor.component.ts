import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControlBase, ControlsService } from '@acharyarajasekhar/dynamic-forms';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

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

  constructor(
    private controlSvc: ControlsService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.initDynamicFormControls();
    this.initFormGroup();
    if (!!this.profile && !!this.profile.id) {
      this.setInitialFormValues();
    }

  }

  private initDynamicFormControls() {
    this.formConfig = environment.formConfigs.profileEditForm;
    if (!!this.formConfig) {
      this.controls = this.controlSvc.getControls(this.formConfig.controls);
    }
  }

  private initFormGroup() {
    this.form = new FormGroup({});
    this.form.valueChanges.subscribe(val => { this.submitted = val; });
  }

  private setInitialFormValues() {
    this.controls.forEach(c => c.value = this.profile[c.name]);
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

  onSave() {
    if (this.form.invalid) {
      this.dynamicForm.showErrors();
    }
    else {
      this.modalController.dismiss(this.submitted, 'ok');
    }
  }

}
