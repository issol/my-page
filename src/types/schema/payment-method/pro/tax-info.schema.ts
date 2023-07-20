import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { TaxInfoType } from '@src/types/payment-info/pro/tax-info.type'
import { ProPaymentType } from '@src/types/payment-info/pro/billing-method.type'

export const taxInfoDefaultValue: TaxInfoType = {
  taxInfo: '',
  tax: null,
}

export const taxInfoSchema = (billingMethod: ProPaymentType | null) =>
  yup.object().shape({
    taxInfo: yup.string().required(FormErrors.required),
    tax: yup.string().nullable(),
    businessLicense:
      billingMethod === 'koreaDomesticTransfer'
        ? yup.mixed().nullable()
        : yup.mixed().required(FormErrors.required),
  })
