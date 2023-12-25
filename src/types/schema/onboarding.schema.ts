import { FormErrors } from '@src/shared/const/formErrors'
import * as yup from 'yup'

export const assignTestSchema = yup.object().shape({
  jobInfo: yup.array().of(
    yup.object().shape({
      jobType: yup.object().shape({
        label: yup.string().required(FormErrors.required),
        value: yup.string().required(FormErrors.required),
      }),
      role: yup.object().shape({
        label: yup.string().required(FormErrors.required),
        value: yup.string().required(FormErrors.required),
      }),

      source: yup
        .object()
        .shape({
          label: yup.string().required(FormErrors.required),
          value: yup.string().required(FormErrors.required),
        })
        .nullable()
        .when('role', {
          is: (role: { value: string; label: string }) =>
            role?.value === 'DTPer' || role?.value === 'DTP QCer',
          then: yup.object().nullable(),
          otherwise: yup.object().shape({
            label: yup.string().required(FormErrors.required),
            value: yup.string().required(FormErrors.required),
          }),
        }),

      target: yup
        .object()
        .shape({
          label: yup.string().required(FormErrors.required),
          value: yup.string().required(FormErrors.required),
        })
        .nullable()
        .when('role', {
          is: (role: { value: string; label: string }) =>
            role?.value === 'DTPer' || role?.value === 'DTP QCer',
          then: yup.object().nullable(),
          otherwise: yup.object().shape({
            label: yup.string().required(FormErrors.required),
            value: yup.string().required(FormErrors.required),
          }),
        }),

      // source: yup
      //   .string()
      //   .required('This field is required')
      //   .when('role', (role, schema) =>
      //     role?.value === 'DTPer' || role?.value === 'DTP QCer'
      //       ? yup.string().nullable()
      //       : schema,
      //   ),
      // target: yup
      //   .string()
      //   .required('This field is required')
      //   .when('role', (role, schema) =>
      //     role?.value === 'DTPer' || role?.value === 'DTP QCer'
      //       ? yup.string().nullable()
      //       : schema,
      //   ),
    }),
  ),
})
