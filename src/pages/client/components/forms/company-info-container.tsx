// ** mui
import { Button, Grid } from '@mui/material'

// ** types
import { CompanyInfoFormType } from '@src/types/schema/company-info.schema'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** react hook form
import {
  Control,
  Controller,
  FieldErrors,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form'

// ** data
import CompanyInfoForm from './company-info-form'

type Props = {
  control: Control<CompanyInfoFormType, any>
  getValues: UseFormGetValues<CompanyInfoFormType>
  setValue: UseFormSetValue<CompanyInfoFormType>
  handleSubmit: UseFormHandleSubmit<CompanyInfoFormType>
  errors: FieldErrors<CompanyInfoFormType>
  isValid: boolean
  watch: UseFormWatch<CompanyInfoFormType>
  onNextStep: () => void
}
export default function CompanyInfoContainer({
  control,
  getValues,
  setValue,
  handleSubmit,
  errors,
  isValid,
  watch,
  onNextStep,
}: Props) {
  return (
    <Grid container spacing={6}>
      <CompanyInfoForm
        mode='create'
        control={control}
        setValue={setValue}
        getValue={getValues}
        errors={errors}
        watch={watch}
      />

      <Grid item xs={12} display='flex' justifyContent='flex-end'>
        <Button variant='contained' disabled={!isValid} onClick={onNextStep}>
          Next <Icon icon='material-symbols:arrow-forward-rounded' />
        </Button>
      </Grid>
    </Grid>
  )
}
