import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type BankTransferFormType = {
  bankName: string
  accountHolder: string
}

export const bankTransferSchema = yup.object().shape({
  bankName: yup.string().required(FormErrors.required),
  accountHolder: yup.string().required(FormErrors.required),
})
