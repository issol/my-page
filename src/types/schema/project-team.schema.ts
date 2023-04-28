import * as yup from 'yup'
import { FormErrors } from 'src/shared/const/formErrors'

export type MemberType = 'supervisorId' | 'projectManagerId' | 'member'
export type ProjectTeamType = {
  teams: Array<{
    type: MemberType
    id: number | null
    name: string
  }>
}

export const projectTeamSchema = yup.object().shape({
  teams: yup.array().of(
    yup.object().shape({
      name: yup.string().nullable(),
      type: yup
        .string()
        .oneOf(['supervisorId', 'projectManagerId', 'member'])
        .nullable(),
      id: yup
        .number()
        .nullable()
        .when('type', (type, schema) =>
          type === 'projectManagerId'
            ? yup.number().required(FormErrors.required)
            : schema,
        ),
    }),
  ),
})
