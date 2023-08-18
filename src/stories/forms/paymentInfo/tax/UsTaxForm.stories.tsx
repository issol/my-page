import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Divider, Grid } from '@mui/material'
import USTaxForm from '@src/pages/client/components/forms/tax-info/us-tax-form'
import { USTaxFormType } from '@src/types/payment-info/client/index.type'
import { usTaxSchema } from '@src/types/schema/tax-info/us-tax.schema'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { clientTaxInitialData } from '@src/types/schema/tax-info'

export default {
  title: 'Forms/Forms/PaymentInfo/Tax/UsTaxForm',
  component: USTaxForm,
  argTypes: {
    name: {
      description: 'US tax form',
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
              {`import USTaxForm from '@src/pages/client/components/forms/tax-info/us-tax-form'`}
            </code>
            <br />
            <code>
              {`import { USTaxFormType } from '@src/types/payment-info/client/index.type'`}
            </code>
            <br />
            <code>
              {`import { usTaxSchema } from '@src/types/schema/tax-info/us-tax.schema'`}
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
} as ComponentMeta<typeof USTaxForm>

export const Default = () => {
  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<USTaxFormType>({
    defaultValues: clientTaxInitialData('US'),
    mode: 'onChange',
    resolver: yupResolver(usTaxSchema),
  })

  return <USTaxForm control={control} errors={errors} />
}
