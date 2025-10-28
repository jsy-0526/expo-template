export interface II18nTranslation {
  hello: string;

  // Form demo fields
  username: string;
  age: string;
  gender: string;
  male: string;
  female: string;
  other: string;
  newsletter: string;
  remark: string;

  // Form placeholders
  'form.username.placeholder': string;
  'form.age.placeholder': string;
  'form.gender.placeholder': string;
  'form.remark.placeholder': string;

  // Form helpers
  'form.username.helper': string;
  'form.age.helper': string;
  'form.newsletter.helper': string;
  'form.remark.helper': string;

  // Form validation errors
  'form.username.error.min': string;
  'form.age.error.typeError': string;
  'form.age.error.positive': string;
  'form.age.error.integer': string;
  'form.age.error.required': string;
  'form.gender.error.required': string;
  'form.remark.error.max': string;
}
