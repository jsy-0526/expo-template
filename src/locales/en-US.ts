import type { Translation } from './types';

export const enUS: Translation = {
  hello: 'Hello',

  // Toast messages
  'toast.success.title': 'Success',
  'toast.success.message': 'Operation completed successfully 👋',
  'toast.error.title': 'Error',
  'toast.error.message': 'An error occurred ❌',
  'toast.info.title': 'Info',
  'toast.info.message': 'This is an info message 💬',

  // Form demo fields
  username: 'Username',
  age: 'Age',
  gender: 'Gender',
  male: 'Male',
  female: 'Female',
  other: 'Other',
  newsletter: 'Subscribe to Newsletter',
  remark: 'Remark',

  // Form placeholders
  'form.username.placeholder': 'Enter your username',
  'form.age.placeholder': 'Enter your age',
  'form.gender.placeholder': 'Select gender',
  'form.remark.placeholder': 'Tell us about yourself',

  // Form helpers
  'form.username.helper': 'Must be at least 3 characters',
  'form.age.helper': '',
  'form.newsletter.helper': 'Receive updates and news',
  'form.remark.helper': 'Max 500 characters',

  // Form validation errors
  'form.username.error.min': 'Username must be at least 3 characters',
  'form.age.error.typeError': 'Age must be a number',
  'form.age.error.positive': 'Age must be positive',
  'form.age.error.integer': 'Age must be an integer',
  'form.age.error.required': 'Age is required',
  'form.gender.error.required': 'Gender is required',
  'form.remark.error.max': 'Bio must be less than 500 characters',
};

