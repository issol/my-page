import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** mui
import { Grid } from '@mui/material'

// ** types
import { ProjectTeamType } from '@src/types/schema/project-team.schema'

// ** Icon Imports

// ** react hook form
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** components
import ProjectTeamForm from '@src/pages/components/forms/project-team-form'

// ** fetch
import { useGetMemberList } from '@src/queries/quotes.query'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'

type Props = {
  control: Control<ProjectTeamType, any>
  field: FieldArrayWithId<ProjectTeamType, 'teams', 'id'>[]
  append: UseFieldArrayAppend<ProjectTeamType, 'teams'>
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<ProjectTeamType, 'teams'>

  setValue: UseFormSetValue<ProjectTeamType>
  errors: FieldErrors<ProjectTeamType>
  isValid: boolean
  watch: UseFormWatch<ProjectTeamType>
  getValue: UseFormGetValues<ProjectTeamType>
}

export default function ProjectTeamFormContainer({
  control,
  field,
  append,
  remove,
  update,

  setValue,
  errors,
  isValid,
  watch,
  getValue,
}: Props) {
  const auth = useRecoilValueLoadable(authState)
  const { data } = useGetMemberList()

  return (
    <Grid item xs={12} display='flex' justifyContent='flex-end'>
      <ProjectTeamForm
        control={control}
        field={field}
        append={append}
        remove={remove}
        update={update}
        setValue={setValue}
        errors={errors}
        isValid={isValid}
        watch={watch}
        getValue={getValue}
        memberList={
          // data?.concat({
          //   value: Number(auth.getValue().user?.id!),
          //   label: getLegalName({
          //     firstName: auth.getValue().user?.firstName!,
          //     middleName: auth.getValue().user?.middleName,
          //     lastName: auth.getValue().user?.lastName!,
          //   }),
          //   jobTitle: auth.getValue().user?.jobTitle ?? '',
          // }) || []
          data || []
        }
      />
    </Grid>
  )
}
