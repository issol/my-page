import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type SingaporeTaxFormType = {
  clientName: string
  clientAddress: string
  taxId: number | null
  uenId: number | null
}

export const singaporeTaxSchema = yup.object().shape({
  clientName: yup.string().required(FormErrors.required),
  clientAddress: yup.string().required(FormErrors.required),
  taxId: yup.number().typeError(FormErrors.invalidNumber).nullable(),
  uenId: yup.number().typeError(FormErrors.invalidNumber).nullable(),
})
