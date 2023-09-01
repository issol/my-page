import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'
import { CorporateClientInfoType } from '@src/context/types'

export const corporateClientDefaultValue: CorporateClientInfoType = {
  registrationNumber: 1112233333,
  representativeName: '',
  commencementDate: '',
}
export const corporateClientInfoSchema = yup.object().shape({
  registrationNumber: yup.string().required(FormErrors.required),
  representativeName: yup.string().required(FormErrors.required),
  commencementDate: yup.string().required(FormErrors.required),
})
