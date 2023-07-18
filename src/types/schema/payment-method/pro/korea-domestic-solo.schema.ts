import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export const koreaDomesticSoloDefaultValue = {
  businessName: '',
  businessNumber: '',
}

export const koreaDomesticSoloSchema = yup.object().shape({
  type: yup.string().required(FormErrors.required),
  businessName: yup.string().required(FormErrors.required),
  businessNumber: yup.number().required(FormErrors.required),
  copyOfRrCard: yup.mixed().required(FormErrors.required),
})
