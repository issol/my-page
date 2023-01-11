import * as yup from 'yup'
const profileErrorMsg = {
  name_regex: '',
  required: 'This field is required.',
} as const

export const profileSchema = yup.object().shape({
  firstName: yup.string().required(profileErrorMsg.required),
  middleName: yup.string().nullable(),
  lastName: yup.string().required(profileErrorMsg.required),
})
