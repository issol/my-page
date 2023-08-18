import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Divider, Grid } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import CorporateCompanyInfoForm from '@src/pages/client/components/forms/client-info/corporate-company-info-form'
import { CorporateClientInfoType } from '@src/context/types'
import {
  corporateClientDefaultValue,
  corporateClientInfoSchema,
} from '@src/types/schema/client-info/corporate-company-info.schema'

export default {
  title: 'Forms/Forms/Information or Profile/CorporateCompanyInfoForm',
  component: CorporateCompanyInfoForm,
  argTypes: {
    name: {
      description: 'Corporate Company info form',
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
              {`import CorporateCompanyInfoForm from '@src/pages/client/components/forms/client-info/corporate-company-info-form'`}
            </code>
            <br />
            <code>
              {`import { CorporateClientInfoType } from '@src/context/types'`}
            </code>
            <br />
            <code>
              {`import {
                        corporateClientDefaultValue,
                        corporateClientInfoSchema,
                        } from '@src/types/schema/client-info/corporate-company-info.schema'
                        `}
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
} as ComponentMeta<typeof CorporateCompanyInfoForm>

export const Default = () => {
  const {
    control,
    getValues,
    formState: { errors, isValid, dirtyFields },
  } = useForm<CorporateClientInfoType>({
    defaultValues: corporateClientDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(corporateClientInfoSchema),
  })

  return (
    <Grid container spacing={6}>
      <CorporateCompanyInfoForm control={control} errors={errors} />
    </Grid>
  )
}
