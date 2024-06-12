import React from 'react'
import { ComponentMeta } from '@storybook/react'
import { Divider, Grid } from '@mui/material'
import { Resolver, useFieldArray, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import ClientAddressesForm from 'src/pages/[companyName]/client/components/forms/addresses-info-form'
import {
  clientAddressDefaultValue,
  ClientAddressFormType,
  clientAddressSchema,
} from '@src/types/schema/client-address.schema'

export default {
  title: 'Forms/Forms/Address/ClientAddressesForm',
  component: ClientAddressesForm,
  argTypes: {
    name: {
      description: 'Client address info form',
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
              {`import ClientAddressesForm from 'src/pages/client/components/forms/addresses-info-form'`}
            </code>
            <br />
            <code>
              {`import {
                  ClientAddressFormType,
                  clientAddressDefaultValue,
                  clientAddressSchema,
                } from '@src/types/schema/client-address.schema'`}
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
} as ComponentMeta<typeof ClientAddressesForm>

export const Default = () => {
  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ClientAddressFormType>({
    defaultValues: clientAddressDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(
      clientAddressSchema,
    ) as Resolver<ClientAddressFormType>,
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'clientAddresses',
  })
  return (
    <Grid container spacing={6}>
      <ClientAddressesForm
        control={control}
        fields={fields}
        append={append}
        remove={remove}
        update={update}
        errors={errors}
        isValid={isValid}
        getValues={getValues}
      />
    </Grid>
  )
}
