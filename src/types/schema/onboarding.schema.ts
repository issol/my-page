import * as yup from 'yup'

export const assignTestSchema = yup.object().shape({
  jobInfo: yup.array().of(
    yup.object().shape({
      jobType: yup.string().required('This field is required'),
      role: yup.string().required('This field is required'),
      source: yup
        .string()
        .required('This field is required')
        .when('jobType', (jobType, schema) =>
          jobType === 'dtp' ? yup.string().nullable() : schema,
        ),
      target: yup
        .string()
        .required('This field is required')
        .when('jobType', (jobType, schema) =>
          jobType === 'dtp' ? yup.string().nullable() : schema,
        ),
    }),
  ),
})
