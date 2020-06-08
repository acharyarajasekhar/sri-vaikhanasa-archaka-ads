import { Component, OnInit, ViewChild } from '@angular/core';
import { ControlBase, ControlsService } from '@acharyarajasekhar/dynamic-forms';
import { FormGroup } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-archaka-post-editor',
  templateUrl: './archaka-post-editor.component.html',
  styleUrls: ['./archaka-post-editor.component.css']
})
export class ArchakaPostEditorComponent implements OnInit {

  @ViewChild('dynamicForm', { static: true }) dynamicForm: any;

  controls: ControlBase<any>[];
  form: FormGroup;
  submitted: any;
  formConfig: any;

  pageTitle: string = "New Ad...";
  post: any;

  constructor(
    private controlSvc: ControlsService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.initDynamicFormControls();
    this.initFormGroup();
    if (!!this.post && !!this.post.id) {
      this.setInitialFormValues();
    }

  }

  private initDynamicFormControls() {
    this.formConfig = environment.formConfigs.archakaPostForm;
    if (!!this.formConfig) {
      this.controls = this.controlSvc.getControls(this.formConfig.controls);
    }
  }

  private initFormGroup() {
    this.form = new FormGroup({});
    this.form.valueChanges.subscribe(val => { this.submitted = val; });
  }

  private setInitialFormValues() {
    this.controls.forEach(c => c.value = this.post[c.name]);
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
    console.log(this.submitted);
    if (this.form.invalid) {
      this.dynamicForm.showErrors();
    }
    else {
      let data = {
        ...this.post,
        ...this.submitted
      }
      this.handleUndefined(data);
      this.modalController.dismiss(data, 'ok');
    }
  }

}
