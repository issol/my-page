import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Divider, Grid } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import CompanyInfoForm from '@src/pages/client/components/forms/company-info-form'
import {
  CompanyInfoFormType,
  companyInfoDefaultValue,
  companyInfoSchema,
} from '@src/types/schema/company-info.schema'

export default {
  title: 'Forms/Forms/Information or Profile/CompanyInfoForm',
  component: CompanyInfoForm,
  argTypes: {
    name: {
      description: 'Company info form',
    },
    type: {
      defaultValue: 'create',
      control: { type: 'select' },
      options: ['create', 'update'],
    },
  },

  decorators: [
    Story => (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <p
            style={{
              padding: '20px',
              borderRadius: '10px',
              background: '#eeeeee',
            }}
          >
            <code>
              {`import CompanyInfoForm from '@src/pages/client/components/forms/company-info-form'`}
            </code>
            <br />
            <code>
              {`import {
                      CompanyInfoFormType,
                      companyInfoDefaultValue,
                      companyInfoSchema,
                    } from '@src/types/schema/company-info.schema'`}
            </code>
          </p>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={12}>
          <Story />
        </Grid>
      </Grid>
    ),
  ],
} as ComponentMeta<typeof CompanyInfoForm>

export const Default = ({ type }: { type: 'create' | 'update' }) => {
  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CompanyInfoFormType>({
    defaultValues: companyInfoDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(companyInfoSchema),
  })

  return (
    <Grid container spacing={6}>
      <CompanyInfoForm
        mode={type}
        control={control}
        setValue={setValue}
        errors={errors}
        watch={watch}
        getValue={getValues}
      />
    </Grid>
  )
}
