import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Divider, Grid } from '@mui/material'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import KoreaTaxForm from 'src/pages/[companyName]/client/components/forms/tax-info/korea-tax-form'
import { KoreaTaxFormType } from '@src/types/payment-info/client/index.type'
import { koreaTaxSchema } from '@src/types/schema/tax-info/korea-tax.schema'
import { clientTaxInitialData } from '@src/types/schema/tax-info'

export default {
  title: 'Forms/Forms/PaymentInfo/Tax/KoreaTaxForm',
  component: KoreaTaxForm,
  argTypes: {
    name: {
      description: 'Korea tax form',
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
              {`import KoreaTaxForm from 'src/pages/client/components/forms/tax-info/korea-tax-form'`}
            </code>
            <br />
            <code>
              {`import { KoreaTaxFormType } from '@src/types/payment-info/client/index.type'`}
            </code>
            <br />
            <code>
              {`import { koreaTaxSchema } from '@src/types/schema/tax-info/korea-tax.schema'`}
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
} as ComponentMeta<typeof KoreaTaxForm>

export const Default = () => {
  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<KoreaTaxFormType>({
    //@ts-ignore
    defaultValues: clientTaxInitialData('Korea'),
    mode: 'onChange',
    resolver: yupResolver(koreaTaxSchema),
  })

  return <KoreaTaxForm control={control} errors={errors} />
}
