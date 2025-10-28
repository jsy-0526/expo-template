import type { FieldOrFields } from "@/components/form";
import type { TFunction } from "i18next";
import * as yup from "yup";

export interface FormModel {
  username: string;
  age: string;
  gender: string;
  newsletter: boolean;
  remark: string;
}

export const exampleFormFields = (t: TFunction): FieldOrFields<FormModel>[] => [
  {
    type: "text",
    name: "username",
    label: t("username"),
    keyboardType : 'numeric',
    placeholder: t("form.username.placeholder"),
    yup: yup.string().min(3, t("form.username.error.min")),
    helper: t("form.username.helper"),
  },
  // 一行两列布局示例
  [
    {
      type: "text",
      name: "age",
      label: t("age"),
      placeholder: t("form.age.placeholder"),
      keyboardType: "numeric",
      required: true,
      yup: yup
        .number()
        .typeError(t("form.age.error.typeError"))
        .positive(t("form.age.error.positive"))
        .integer(t("form.age.error.integer"))
        .required(t("form.age.error.required")),
    },
    {
      type: "select",
      name: "gender",
      label: t("gender"),
      placeholder: t("form.gender.placeholder"),
      required: true,
      yup: yup.string().required(t("form.gender.error.required")),
      options: [
        { label: t("male"), value: "male" },
        { label: t("female"), value: "female" },
        { label: t("other"), value: "other" },
      ],
    },
  ],
  {
    type: "switch",
    name: "newsletter",
    label: t("newsletter"),
    helper: t("form.newsletter.helper"),
    yup: yup.boolean(),
  },
  {
    type: "text",
    name: "remark",
    label: t("remark"),
    placeholder: t("form.remark.placeholder"),
    multiline: true,
    numberOfLines: 4,
    helper: t("form.remark.helper"),
    yup: yup.string().max(500, t("form.remark.error.max")),
  },
];
