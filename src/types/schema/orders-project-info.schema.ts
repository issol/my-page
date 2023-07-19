import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { OrderStatusType } from '../common/orders.type'

export const orderProjectInfoDefaultValue = {
  // status: 'In preparation' as OrderStatusType,

  projectName: '',
  showProjectDescription: false,
  orderedAt: Date(),
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
  showProjectDescription: yup.boolean().required(),

  taxable: yup.boolean().nullable(),
})
