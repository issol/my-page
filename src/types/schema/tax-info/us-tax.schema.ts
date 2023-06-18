import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type USTaxFormType = {
  clientName: string
  clientAddress: string
}

export const usTaxSchema = yup.object().shape({
  clientName: yup.string().required(FormErrors.required),
  clientAddress: yup.string().required(FormErrors.required),
})
