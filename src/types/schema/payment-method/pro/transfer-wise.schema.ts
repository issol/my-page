import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const transferWiseDefaultValue = {
  personalId: '',
}

// ** Transferwise, US ACH, International wire 용 schema
export const transferWiseSchema = yup.object().shape({
  type: yup.string().required(FormErrors.required),
  personalId: yup.string().required(FormErrors.required),
  copyOfId: yup.mixed().required(FormErrors.required),
})
