import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Divider, Grid } from '@mui/material'
import AccountMethodForm from '@src/pages/client/components/forms/payment-method/account-method-form'
import { AccountMethodFormType } from '@src/types/payment-info/client/index.type'
import {
  clientPaymentInitialData,
  getPaymentMethodSchema,
} from '@src/types/schema/payment-method/client'

export default {
  title: 'Forms/Forms/PaymentInfo/Payment Method/AccountMethod',
  component: AccountMethodForm,
  argTypes: {
    name: {
      description: 'Address form',
    },
  },

  decorators: [
    Story => (
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Alert severity='info'>
            payment method가 'wise', 'stripe', 'airwallex'일 때 사용하는
            form입니다.
            <h3>사용법</h3>
            1. clientPaymentInitialData() 함수에 payment method의 타입을
            넣어주면 알맞는 initial data를 리턴합니다.
            <br /> 이것을 useForm의 defaultValues에 넣어주세요.
            <br />
            2. getPaymentMethodSchema() 함수에 payment method의 타입을 넣어주면
            알맞는 schema를 리턴합니다.
            <br /> 이것을 yupResolver에 등록해서 사용해주세요.
          </Alert>
          <p
            style={{
              padding: '20px',
              borderRadius: '10px',
              background: '#eeeeee',
            }}
          >
            <code>
              {`import AccountMethodForm from '@src/pages/client/components/forms/payment-method/account-method-form'`}
            </code>
            <br />
            <code>
              {`import { AccountMethodFormType } from '@src/types/payment-info/client/index.type'`}
            </code>
            <br />
            <code>
              {`import {
                        clientPaymentInitialData,
                        getPaymentMethodSchema,
                      } from '@src/types/schema/payment-method/client'`}
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
} as ComponentMeta<typeof AccountMethodForm>

export const Default = () => {
  const {
    control,
    getValues: getPayMethodValues,
    reset: resetPayMethod,
    formState: { errors, isValid },
  } = useForm<AccountMethodFormType>({
    mode: 'onChange',
    defaultValues: clientPaymentInitialData('wise'),
    resolver: yupResolver(getPaymentMethodSchema('wise')),
  })

  return <AccountMethodForm control={control} errors={errors} />
}
