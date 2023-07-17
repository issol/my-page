import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const koreaDomesticDefaultValue = {
  billingMethod: '',
  rrn: '',
  bankInfo: {
    bankName: '',
    accountNumber: '',
    bankRoutingNumber: '',
    swiftCode: '',
    iban: '',
  },
  correspondentBankInfo: {
    bankRoutingNumber: '',
    swiftCode: '',
    iban: '',
  },
}

// ** Transferwise, US ACH, International wire 용 schema
export const koreaDomesticSchema = yup.object().shape({
  billingMethod: yup.string().required(FormErrors.required),
  rrn: yup.number().required(FormErrors.required),
  bankInfo: yup.object().shape({
    bankName: yup.string().required(FormErrors.required),
    accountNumber: yup.string().required(FormErrors.required),
    bankRoutingNumber: yup.string().nullable(),
    swiftCode: yup.string().nullable(),
    iban: yup.string().nullable(),
  }),
  correspondentBankInfo: yup.object().shape({
    bankRoutingNumber: yup.string().nullable(),
    swiftCode: yup.string().nullable(),
    iban: yup.string().nullable(),
  }),
  copyOfRrCard: yup.mixed().required(FormErrors.required),
  copyOfBankStatement: yup.mixed().required(FormErrors.required),
})
