import React from 'react'
import { ComponentMeta } from '@storybook/react'
import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Grid } from '@mui/material'

export default {
  title: 'Forms/Forms/BillingAddress',

  argTypes: {
    name: {
      description: 'Address form',
    },
  },
  decorators: [
    Story => (
      <div>
        <p style={{ marginBottom: '30px' }}>
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

        <Story />
      </div>
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
    resolver: yupResolver(clientBillingAddressSchema),
  })

  return (
    <Grid container spacing={6}>
      <ClientBillingAddressesForm control={control} errors={errors} />
    </Grid>
  )
}
