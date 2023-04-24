// ** mui
import { Button, Grid } from '@mui/material'

// ** types
import { ProjectTeamType } from '@src/types/schema/project-team.schema'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** react hook form
import {
  Control,
  Controller,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** components
import ProjectTeamForm from '@src/pages/components/forms/project-team-form'
import { useGetMemberList } from '@src/queries/quotes.query'

type Props = {
  control: Control<ProjectTeamType, any>
  field: FieldArrayWithId<ProjectTeamType, 'teams', 'id'>[]
  append: UseFieldArrayAppend<ProjectTeamType, 'teams'>
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<ProjectTeamType, 'teams'>
  getValues: UseFormGetValues<ProjectTeamType>
  setValue: UseFormSetValue<ProjectTeamType>
  errors: FieldErrors<ProjectTeamType>
  isValid: boolean
  watch: UseFormWatch<ProjectTeamType>
  onNextStep: () => void
}

export default function ProjectTeamFormContainer({
  control,
  field,
  append,
  remove,
  update,
  getValues,
  setValue,
  errors,
  isValid,
  watch,
  onNextStep,
}: Props) {
  const { data } = useGetMemberList()

  return (
    <Grid container spacing={6}>
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
          memberList={data || []}
        />
      </Grid>

      <Grid item xs={12} display='flex' justifyContent='flex-end'>
        <Button variant='contained' disabled={!isValid} onClick={onNextStep}>
          Next <Icon icon='material-symbols:arrow-forward-rounded' />
        </Button>
      </Grid>
    </Grid>
  )
}
