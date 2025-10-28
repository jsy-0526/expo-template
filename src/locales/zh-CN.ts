import type { II18nTranslation } from '@/infrastructure';

export const zhCN: II18nTranslation = {
  hello: '你好',

  // Form demo fields
  username: '用户名',
  age: '年龄',
  gender: '性别',
  male: '男',
  female: '女',
  other: '其他',
  newsletter: '订阅新闻通讯',
  remark: '备注',

  // Form placeholders
  'form.username.placeholder': '请输入用户名',
  'form.age.placeholder': '请输入年龄',
  'form.gender.placeholder': '请选择性别',
  'form.remark.placeholder': '请介绍一下自己',

  // Form helpers
  'form.username.helper': '至少需要3个字符',
  'form.age.helper': '',
  'form.newsletter.helper': '接收最新动态和资讯',
  'form.remark.helper': '最多500个字符',

  // Form validation errors
  'form.username.error.min': '用户名至少需要3个字符',
  'form.age.error.typeError': '年龄必须是数字',
  'form.age.error.positive': '年龄必须是正数',
  'form.age.error.integer': '年龄必须是整数',
  'form.age.error.required': '年龄不能为空',
  'form.gender.error.required': '性别不能为空',
  'form.remark.error.max': '备注不能超过500个字符',
};
