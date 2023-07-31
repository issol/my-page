import React, { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Grid } from '@mui/material'
import ProProfileForm from '@src/pages/components/forms/pro/profile.form'
import { PersonalInfo } from '@src/types/sign/personalInfoTypes'
import { getProfileSchema } from '@src/types/schema/profile.schema'

export default {
  title: 'Forms/Forms/ProProfileForm',
  component: ProProfileForm,
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
              {`import ProProfileForm from '@src/pages/components/forms/pro/profile.form'`}
            </code>
            <br />
            <code>
              {`import { PersonalInfo } from '@src/types/sign/personalInfoTypes'`}
            </code>
            <br />
            <code>
              {`import { getProfileSchema } from '@src/types/schema/profile.schema'`}
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
} as ComponentMeta<typeof ProProfileForm>

export const Default = () => {
  const {
    control,
    getValues,
    watch,
    reset,
    formState: { errors, dirtyFields, isValid },
  } = useForm<PersonalInfo>({
    defaultValues: {
      legalNamePronunciation: '',
      havePreferred: false,
      preferredName: '',
      mobile: '',
      timezone: { code: '', phone: '', label: '' },
    },
    mode: 'onChange',
    resolver: yupResolver(getProfileSchema('edit')),
  })
  return (
    <Grid container spacing={6}>
      <ProProfileForm control={control} errors={errors} watch={watch} />
    </Grid>
  )
}
