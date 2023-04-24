import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type ProjectTeamType = {
  teams: Array<{
    type: 'supervisorId' | 'projectManagerId' | 'member'
    id: number | null
  }>
}

export const projectTeamSchema = yup.object().shape({
  teams: yup.array().of(
    yup.object().shape({
      type: yup
        .string()
        .oneOf(['supervisorId', 'projectManagerId', 'member'])
        .nullable(),
      id: yup
        .number()
        .nullable()
        .when('type', (type, schema) =>
          type === 'projectManagerId' ? yup.number().required() : schema,
        ),
    }),
  ),
})
