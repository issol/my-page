import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Alert, Divider, Grid } from '@mui/material'
import BankTransferForm from 'src/pages/[companyName]/client/components/forms/payment-method/bank-transfer-form'
import { BankTransferFormType } from '@src/types/payment-info/client/index.type'
import {
  clientPaymentInitialData,
  getPaymentMethodSchema,
} from '@src/types/schema/payment-method/client'

export default {
  title: 'Forms/Forms/PaymentInfo/Payment Method/BankTransferForm',
  component: BankTransferForm,
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
            payment method가 'bankTransfer', 'directDeposit' 일 때 사용하는
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
              {`import BankTransferForm from 'src/pages/client/components/forms/payment-method/bank-transfer-form'`}
            </code>
            <br />
            <code>
              {`import { BankTransferFormType } from '@src/types/payment-info/client/index.type'`}
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
} as ComponentMeta<typeof BankTransferForm>

export const Default = () => {
  const {
    control,
    formState: { errors, isValid },
  } = useForm<BankTransferFormType>({
    mode: 'onChange',
    defaultValues: clientPaymentInitialData('bankTransfer'),
    resolver: yupResolver(getPaymentMethodSchema('bankTransfer')),
  })

  return <BankTransferForm control={control} errors={errors} />
}
