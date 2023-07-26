import React from 'react'
import { ComponentMeta } from '@storybook/react'
import BillingAddress from '@src/pages/client/components/payment-info/billing-address'

export default {
  title: 'Forms/Details/BillingAddress',

  argTypes: {
    name: {
      description: 'Address detail',
    },
  },
  decorators: [
    Story => (
      <div>
        <p style={{ marginBottom: '30px' }}>
          <code>
            {`import BillingAddress from '@src/pages/client/components/payment-info/billing-address'`}
          </code>
        </p>

        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof BillingAddress>

export const Default = () => {
  return (
    <BillingAddress
      billingAddress={{
        addressType: 'billing',
        baseAddress: '서울 특별시 마포구',
        detailAddress: '동교동 123',
        state: '',
        city: '서울',
        country: '대한민국',
        zipCode: '123456',
      }}
    />
  )
}
