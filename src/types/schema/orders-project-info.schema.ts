import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

const formattedNow = (now: Date) => {
  const minutes = now.getMinutes()

  const formattedMinutes = minutes % 30 === 0 ? minutes : minutes > 30 ? 0 : 30

  const formattedHours = minutes > 30 ? now.getHours() + 1 : now.getHours()
  const formattedTime = `${formattedHours}:${formattedMinutes
    .toString()
    .padStart(2, '0')}`
  const formattedDate = new Date(now)
  formattedDate.setHours(parseInt(formattedTime.split(':')[0]))
  formattedDate.setMinutes(parseInt(formattedTime.split(':')[1]))

  return formattedDate
}

export const orderProjectInfoDefaultValue = {
  projectName: '',
  showDescription: false,
  orderedAt: formattedNow(new Date()),
}
export const orderProjectInfoSchema = yup.object().shape({
  // status: yup.string().required(FormErrors.required),
  status: yup.number().required(FormErrors.required),
  workName: yup.string().nullable(),
  projectName: yup.string().required(FormErrors.required),
  projectDescription: yup.string().nullable(),
  category: yup.string().nullable(),

  serviceType: yup.array().of(yup.string()).nullable(),
  expertise: yup.array().of(yup.string()).nullable(),
  revenueFrom: yup
    .string()
    .oneOf(['United States', 'Korea', 'Singapore', 'Japan'])
    .nullable()
    .required(FormErrors.required),
  orderedAt: yup.date().required(FormErrors.required),
  orderTimezone: yup.object().shape({
    code: yup.string().required(FormErrors.required),
    label: yup.string().required(FormErrors.required),
    phone: yup.string().required(FormErrors.required),
  }),
  projectDueAt: yup.date().nullable(),
  projectDueTimezone: yup.object().shape({
    code: yup.string().required(FormErrors.required),
    label: yup.string().required(FormErrors.required),
    phone: yup.string().required(FormErrors.required),
  }),
  showDescription: yup.boolean().required(),

  taxable: yup.boolean().nullable(),
})
