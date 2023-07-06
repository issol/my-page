import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

enum PronounceEnum {
  SHE = 'SHE',
  HE = 'HE',
  THEY = 'THEY',
  NONE = 'NONE',
}

export const getProfileSchema = (type: 'join' | 'edit') => {
  return yup.object().shape({
    firstName:
      type === 'join'
        ? yup.string().required(FormErrors.required)
        : yup.string().nullable(),
    middleName: yup.string().nullable(),
    lastName:
      type === 'join'
        ? yup.string().required(FormErrors.required)
        : yup.string().nullable(),
    legalNamePronunciation: yup.string().nullable(),
    pronounce: yup.string().oneOf(Object.values(PronounceEnum)).nullable(),
    havePreferred: yup.boolean().required(),
    preferredName: yup.string().nullable(),
    preferredNamePronunciation: yup.string().nullable(),
    timezone: yup.object().shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
    }),
    mobile: yup.string().nullable(),
    phone: yup.string().nullable(),
    jobInfo: yup.array().of(
      yup.object().shape({
        jobType: yup.string().required(FormErrors.required),
        role: yup.string().required(FormErrors.required),
        source: yup
          .string()
          .required(FormErrors.required)
          .when('jobType', (jobType, schema) =>
            jobType === 'DTP' ? yup.string().nullable() : schema,
          ),
        target: yup
          .string()
          .required(FormErrors.required)
          .when('jobType', (jobType, schema) =>
            jobType === 'DTP' ? yup.string().nullable() : schema,
          ),
      }),
    ),
    experience:
      type === 'join'
        ? yup.string().required(FormErrors.required)
        : yup.string().nullable(),
    resume:
      type === 'join'
        ? yup.array().min(1, FormErrors.required).required()
        : yup.array().nullable(),

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
}

export const managerProfileSchema = yup.object().shape({
  firstName: yup.string().required(FormErrors.required),
  middleName: yup.string().nullable(),
  lastName: yup.string().required(FormErrors.required),
  jobTitle: yup.string().nullable(),
  email: yup.string().nullable(),
  department: yup.string().nullable(),
  timezone: yup.object().shape({
    code: yup.string().required(FormErrors.required),
    label: yup.string().required(FormErrors.required),
    phone: yup.string().required(FormErrors.required),
  }),
  mobile: yup.string().nullable(),
  phone: yup.string().nullable(),
  fax: yup.string().nullable(),
})
