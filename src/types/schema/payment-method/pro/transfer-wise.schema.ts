import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const transferWiseDefaultValue = {
  billingMethod: '',
  personalId: '',
  bankInfo: {
    bankName: '',
    accountNumber: '',
    bankRoutingNumber: '',
    swiftCode: '',
    iban: '',
  },
  haveCorrespondentBank: false,
  correspondentBankInfo: {
    bankRoutingNumber: '',
    swiftCode: '',
    iban: '',
  },
}

// ** Transferwise, US ACH, International wire 용 schema
export const transferWiseSchema = yup.object().shape({
  billingMethod: yup.string().required(FormErrors.required),
  personalId: yup.string().required(FormErrors.required),
  bankInfo: yup.object().shape({
    bankName: yup.string().required(FormErrors.required),
    accountNumber: yup.string().required(FormErrors.required),
    bankRoutingNumber: yup.string().nullable(),
    swiftCode: yup.string().nullable(),
    iban: yup.string().nullable(),
  }),
  haveCorrespondentBank: yup.boolean().required(FormErrors.required),
  correspondentBankInfo: yup.object().shape({
    bankRoutingNumber: yup.string().nullable(),
    swiftCode: yup.string().nullable(),
    iban: yup.string().nullable(),
  }),
  copyOfId: yup.mixed().required(FormErrors.required),
})
