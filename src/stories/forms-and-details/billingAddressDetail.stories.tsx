import React from 'react'
import { ComponentMeta } from '@storybook/react'
import BillingAddress from '@src/pages/client/components/payment-info/billing-address'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { Divider, Grid } from '@mui/material'

export default {
  title: 'Forms/Details/BillingAddress',
  component: BillingAddress,
  argTypes: {
    name: {
      description: 'Address detail',
    },
  },
  args: {
    billingAddress: {
      addressType: 'billing',
      baseAddress: '서울 특별시 마포구',
      detailAddress: '동교동 123',
      state: '',
      city: '서울',
      country: '대한민국',
      zipCode: '123456',
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
              {`import BillingAddress from '@src/pages/client/components/payment-info/billing-address'`}
            </code>
            <br />
            <code>
              {`import { ClientAddressType } from '@src/types/schema/client-address.schema'`}
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
} as ComponentMeta<typeof BillingAddress>

export const Default = ({
  billingAddress,
}: {
  billingAddress: ClientAddressType
}) => {
  return <BillingAddress billingAddress={billingAddress} />
}
