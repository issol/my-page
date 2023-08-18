import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const koreaDomesticDefaultValue = {
  type: '',
  rrn: '',
}

export const koreaDomesticSchema = yup.object().shape({
  type: yup.string().required(FormErrors.required),
  rrn: yup.number().required(FormErrors.required),

  copyOfRrCard: yup.mixed().required(FormErrors.required),
  copyOfBankStatement: yup.mixed().required(FormErrors.required),
})
