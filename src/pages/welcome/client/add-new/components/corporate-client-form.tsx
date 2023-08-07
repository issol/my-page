import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'
import Stepper from '@src/pages/components/stepper'
import { CorporateClientInfoType } from '@src/context/types'
import CorporateCompanyInfoForm from '@src/pages/client/components/forms/client-info/corporate-company-info-form'
import {
  corporateClientDefaultValue,
  corporateClientInfoSchema,
} from '@src/types/schema/client-info/corporate-company-info.schema'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function CorporateClientForm() {
  const steps = [
    { title: 'Company verification' },
    { title: 'Company information' },
    { title: 'Addresses' },
  ]
  const [activeStep, setActiveStep] = useState(1)
  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, dirtyFields, isValid },
  } = useForm<CorporateClientInfoType>({
    defaultValues: corporateClientDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(corporateClientInfoSchema),
  })

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Stepper activeStep={activeStep} steps={steps} />
      </Grid>
      <CorporateCompanyInfoForm control={control} errors={errors} />
    </Grid>
  )
}
