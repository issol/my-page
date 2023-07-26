import React from 'react'
import { ComponentMeta } from '@storybook/react'
import ClientBillingAddressesForm from '@src/pages/client/components/forms/client-billing-address'
import { useForm } from 'react-hook-form'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { yupResolver } from '@hookform/resolvers/yup'
import { clientBillingAddressSchema } from '@src/types/schema/client-billing-address.schema'
import { Grid } from '@mui/material'

export default {
  title: 'Forms/BillingAddressForm',

  argTypes: {
    name: {
      description: 'list view와 calendar view를 선택하는 버튼 컴포넌트',
    },
  },
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
