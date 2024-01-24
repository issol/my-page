import React, { useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { Divider, Grid } from '@mui/material'
import RegisterClientForm from '@src/pages/components/forms/register-client-form'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'

export default {
  title: 'Forms/Forms/Information or Profile/RegisterClientForm',
  component: RegisterClientForm,
  argTypes: {
    name: {
      description: 'Address form',
    },
    type: {
      defaultValue: 'order',
      control: { type: 'select' },
      options: ['order', 'invoice', 'quotes', 'request'],
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
              {`import RegisterClientForm from '@src/pages/components/forms/register-client-form'`}
            </code>
            <br />
            <code>
              {`import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'`}
            </code>
            <br />
            <code>
              {`Company name의 option값은 fetch를 먼저 받은 뒤 props로 보내줘야 함`}
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
} as ComponentMeta<typeof RegisterClientForm>

export const Default = ({
  type,
}: {
  type: 'order' | 'invoice' | 'quotes' | 'request'
}) => {
  const {
    control,
    getValues,
    setValue,
    watch,
    reset,
    trigger,
    formState: { errors, isValid },
  } = useForm<ClientFormType>({
    defaultValues: {
      clientId: null,
      contactPersonId: null,
      addressType: 'shipping',
    },
    mode: 'onChange',
    resolver: yupResolver(clientSchema) as Resolver<ClientFormType>,
  })

  const [tax, setTax] = useState<number | null>(null)
  const [taxable, setTaxable] = useState(false)
  const [clientList, setClientList] = useState<
    {
      label: string
      value: number
      tax: number | null
    }[]
  >([])
  return (
    <RegisterClientForm
      control={control}
      setValue={setValue}
      watch={watch}
      clientList={clientList}
      setTaxable={setTaxable}
      setTax={setTax}
      type={type}
      formType='create'
      getValue={getValues}
      fromQuote={false}
    />
  )
}
