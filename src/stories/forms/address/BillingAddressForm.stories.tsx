import React from 'react'
import { ComponentMeta } from '@storybook/react'
import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Grid } from '@mui/material'

export default {
  title: 'Forms/Forms/Address/BillingAddress',
  component: ClientBillingAddressesForm,
  argTypes: {
    name: {
      description: 'Address form',
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
              {`import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'`}
            </code>
            <br />
            <code>
              {`import { ClientAddressType } from '@src/types/schema/client-address.schema'`}
            </code>
            <br />
            <code>
              {`import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'`}
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
} as ComponentMeta<typeof ClientBillingAddressesForm>

export const Default = () => {
  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<ClientAddressType>({
    defaultValues: {
      addressType: 'billing',
      baseAddress: '',
      detailAddress: '',
      city: '',
      state: '',
      country: '',
      zipCode: '',
    },
    mode: 'onChange',
    resolver: yupResolver(
      clientBillingAddressSchema,
    ) as Resolver<ClientAddressType>,
  })

  return (
    <Grid container spacing={6}>
      <ClientBillingAddressesForm control={control} errors={errors} />
    </Grid>
  )
}
