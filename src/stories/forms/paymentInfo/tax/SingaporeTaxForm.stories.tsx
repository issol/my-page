import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Divider, Grid } from '@mui/material'
import SingaporeTaxForm from 'src/pages/[companyName]/client/components/forms/tax-info/singapore-tax-form'
import { SingaporeTaxFormType } from '@src/types/payment-info/client/index.type'
import { singaporeTaxSchema } from '@src/types/schema/tax-info/singapore-tax.schema'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { clientTaxInitialData } from '@src/types/schema/tax-info'

export default {
  title: 'Forms/Forms/PaymentInfo/Tax/SingaporeTaxForm',
  component: SingaporeTaxForm,
  argTypes: {
    name: {
      description: 'Singapore tax form',
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
              {`import SingaporeTaxForm from 'src/pages/client/components/forms/tax-info/singapore-tax-form'`}
            </code>
            <br />
            <code>
              {`import { SingaporeTaxFormType } from '@src/types/payment-info/client/index.type'`}
            </code>
            <br />
            <code>
              {`import { singaporeTaxSchema } from '@src/types/schema/tax-info/singapore-tax.schema'`}
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
} as ComponentMeta<typeof SingaporeTaxForm>

export const Default = () => {
  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<SingaporeTaxFormType>({
    defaultValues: clientTaxInitialData('Singapore'),
    mode: 'onChange',
    resolver: yupResolver(singaporeTaxSchema) as Resolver<SingaporeTaxFormType>,
  })

  return <SingaporeTaxForm control={control} errors={errors} />
}
