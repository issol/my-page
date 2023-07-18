import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const bankInfoDefaultValue = {
  bankName: '',
  accountNumber: '',
  routingNumber: '',
  swiftCode: '',
  ibnNumber: '',
}

export const corrBankInfoDefaultValue = {
  routingNumber: '',
  swiftCode: '',
  ibnNumber: '',
}

export const bankInfoSchema = yup.object().shape({
  bankName: yup.string().required(FormErrors.required),
  accountNumber: yup.string().required(FormErrors.required),
  routingNumber: yup.string().nullable(),
  swiftCode: yup.string().nullable(),
  ibnNumber: yup.string().nullable(),
})

export const corrBankInfoSchema = yup.object().shape({
  routingNumber: yup.string().nullable(),
  swiftCode: yup.string().nullable(),
  ibnNumber: yup.string().nullable(),
})
