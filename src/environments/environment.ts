import { firebaseConfig } from './secretes/firebaseconfig';
import { defaults } from './defaults';
import { profileEditForm } from './forms/profile.form';
import { archakaPostAdForm } from './forms/archaka-post-ad.form';
import { reportAbuseForm } from './forms/report-abuse-form';
import { feedbackForm } from './forms/feedback.form';

export const environment = {
  production: false,
  firebaseConfig: firebaseConfig,
  defaults: defaults,
  formConfigs: {
    profileEditForm: profileEditForm,
    archakaPostForm: archakaPostAdForm,
    reportAbuseForm: reportAbuseForm,
    feedbackForm: feedbackForm
  }
};