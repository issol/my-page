import * as yup from 'yup'

const profileErrorMsg = {
  name_regex: '',
  required: 'This field is required.',
} as const

enum PronounceEnum {
  SHE = 'SHE',
  HE = 'HE',
  THEY = 'THEY',
  NONE = 'NONE',
}

export const profileSchema = yup.object().shape({
  firstName: yup.string().required(profileErrorMsg.required),
  middleName: yup.string().nullable(),
  lastName: yup.string().required(profileErrorMsg.required),
  legalNamePronunciation: yup.string().nullable(),
  pronounce: yup.string().oneOf(Object.values(PronounceEnum)).nullable(),
  havePreferred: yup.boolean().required(),
  preferredName: yup.string().nullable(),
  preferredNamePronunciation: yup.string().nullable(),
  timezone: yup.object().shape({
    code: yup.string().required('This field is required'),
    label: yup.string().required('This field is required'),
    phone: yup.string().required('This field is required'),
  }),
  mobile: yup.string().nullable(),
  phone: yup.string().nullable(),
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
  experience: yup.string().required('This field is required'),
  resume: yup.array().min(1, 'This field is required').required(),

  specialties: yup
    .array()
    .of(
      yup
        .object()
        .nullable()
        .shape({
          label: yup.string().nullable(),
          value: yup.string().nullable(),
        })
        .nullable(),
    )
    .nullable(),
})

export const managerProfileSchema = yup.object().shape({
  firstName: yup.string().required(profileErrorMsg.required),
  middleName: yup.string().nullable(),
  lastName: yup.string().required(profileErrorMsg.required),
  jobTitle: yup.string().nullable(),
  timezone: yup.object().shape({
    code: yup.string().required('This field is required'),
    label: yup.string().required('This field is required'),
    phone: yup.string().required('This field is required'),
  }),
  mobile: yup.string().nullable(),
  phone: yup.string().nullable(),
  fax: yup.string().nullable(),
})
