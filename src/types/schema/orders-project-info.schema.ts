import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { OrderStatusType } from '../common/orders.type'

export const orderProjectInfoDefaultValue = {
  status: 'In preparation' as OrderStatusType,
  projectName: '',
  orderDate: Date(),
}
export const orderProjectInfoSchema = yup.object().shape({
  status: yup.string().required(FormErrors.required),
  workName: yup.string().nullable(),
  projectName: yup.string().required(FormErrors.required),
  projectDescription: yup.string().nullable(),
  category: yup.string().nullable(),

  serviceType: yup.array().of(yup.string()).nullable(),
  expertise: yup.array().of(yup.string()).nullable(),
  revenueFrom: yup
    .string()
    .oneOf(['United States', 'Korea', 'Singapore', 'Japan']),
  orderDate: yup.date().required(FormErrors.required),
  projectDueDate: yup.object().shape({
    date: yup.date().nullable(),
    timezone: yup.object().shape({
      code: yup.string().required(FormErrors.required),
      label: yup.string().required(FormErrors.required),
      phone: yup.string().required(FormErrors.required),
    }),
  }),
  taxable: yup.boolean().nullable(),
})
