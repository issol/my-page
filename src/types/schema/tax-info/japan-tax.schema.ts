import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type JapanTaxFormType = {
  clientName: string
  clientAddress: string
  taxId: number | null
  businessNumber: number | null
}

export const japanTaxSchema = yup.object().shape({
  clientName: yup.string().required(FormErrors.required),
  clientAddress: yup.string().required(FormErrors.required),
  taxId: yup.number().typeError(FormErrors.invalidNumber).nullable(),
  businessNumber: yup.number().typeError(FormErrors.invalidNumber).nullable(),
})
