import { firebaseConfig } from './secretes/firebaseconfig';
import { defaults } from './defaults';
import { profileEditForm } from './forms/profile.form';
import { archakaPostAdForm } from './forms/archaka-post-ad.form';
import { reportAbuseForm } from './forms/report-abuse-form';
import { feedbackForm } from './forms/feedback.form';
import { sentryConfig } from './secretes/sentryconfig';

export const environment = {
  production: true,
  firebaseConfig: firebaseConfig,
  sentryConfig: sentryConfig,
  defaults: defaults,
  formConfigs: {
    profileEditForm: profileEditForm,
    archakaPostForm: archakaPostAdForm,
    reportAbuseForm: reportAbuseForm,
    feedbackForm: feedbackForm
  }
};