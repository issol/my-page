import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Divider, Grid } from '@mui/material'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import JapanTaxForm from '@src/pages/client/components/forms/tax-info/japan-tax-form'
import { JapanTaxFormType } from '@src/types/payment-info/client/index.type'
import { japanTaxSchema } from '@src/types/schema/tax-info/japan-tax.schema'

import { clientTaxInitialData } from '@src/types/schema/tax-info'

export default {
  title: 'Forms/Forms/PaymentInfo/Tax/JapanTaxForm',
  component: JapanTaxForm,
  argTypes: {
    name: {
      description: 'Japan Tax form',
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
              {`import JapanTaxForm from '@src/pages/client/components/forms/tax-info/japan-tax-form'`}
            </code>
            <br />
            <code>
              {`import { JapanTaxFormType } from '@src/types/payment-info/client/index.type'`}
            </code>
            <br />
            <code>
              {`import { japanTaxSchema } from '@src/types/schema/tax-info/japan-tax.schema'`}
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
} as ComponentMeta<typeof JapanTaxForm>

export const Default = () => {
  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<JapanTaxFormType>({
    //@ts-ignore
    defaultValues: clientTaxInitialData('Japan'),
    mode: 'onChange',
    resolver: yupResolver(japanTaxSchema),
  })

  return <JapanTaxForm control={control} errors={errors} />
}
