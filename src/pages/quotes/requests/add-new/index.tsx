import { useContext, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** mui
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  TableCell,
  TextField,
  Typography,
} from '@mui/material'
import PageHeader from '@src/@core/components/page-header'
import styled from 'styled-components'

// ** react hook form
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** third parties
import { toast } from 'react-hot-toast'

// ** context
import { AuthContext } from '@src/context/AuthContext'

// ** helpers
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import languageHelper from '@src/shared/helpers/language.helper'
import { RequestFormType } from '@src/types/requests/common.type'
import {
  clientRequestDefaultValue,
  clientRequestSchema,
} from '@src/types/schema/client-request.schema'
import { useGetClientList } from '@src/queries/client.query'
import AddRequestForm from '@src/pages/components/forms/add-request-item-form'

export default function AddNewRequest() {
  const router = useRouter()
  const { user } = useContext(AuthContext)

  const { openModal, closeModal } = useModal()

  /* TODO:
  api요청 3가지 항목
  1. contact person => api변경해야 함
  2. lsp => api변경 필요함
  */

  const {
    control,
    getValues,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<RequestFormType>({
    mode: 'onChange',
    defaultValues: clientRequestDefaultValue,
    resolver: yupResolver(clientRequestSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const { data: clientList } = useGetClientList({
    skip: 0,
    take: 1000,
  })

  const clients = useMemo(() => {
    return (
      clientList?.data?.map(item => ({
        value: item.clientId,
        label: item.name,
      })) || []
    )
  }, [clientList])

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <PageHeader
          title={
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Box display='flex' alignItems='center' gap='8px'>
                <IconButton onClick={() => router.back()}>
                  <Icon icon='material-symbols:arrow-back-ios-new-rounded' />
                </IconButton>
                <Typography variant='h5'>Create new request</Typography>
              </Box>
            </Box>
          }
        />
      </Grid>
      {/* left */}
      <Grid item xs={9}>
        <Card sx={{ padding: '24px' }}>
          <Grid container spacing={6}>
            <Grid item xs={6}>
              <Controller
                name='contactPersonId'
                control={control}
                render={({ field: { value, onChange } }) => {
                  const personList = clients.map(item => ({
                    value: item.value,
                    label: item.label,
                  }))
                  const selectedPerson = personList.find(
                    item => item.value === value,
                  )
                  return (
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      options={personList}
                      onChange={(e, v) => {
                        onChange(v.value)
                        const res = clients.filter(
                          item => item.value === Number(v.value),
                        )
                      }}
                      disableClearable
                      value={selectedPerson || { value: -0, label: '' }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Contact person*'
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Controller
                name='lspId'
                control={control}
                render={({ field: { value, onChange } }) => {
                  const personList = clients.map(item => ({
                    value: item.value,
                    label: item.label,
                  }))
                  const selectedPerson = personList.find(
                    item => item.value === value,
                  )
                  return (
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      options={personList}
                      onChange={(e, v) => {
                        onChange(v.value)
                        const res = clients.filter(
                          item => item.value === Number(v.value),
                        )
                      }}
                      disableClearable
                      value={selectedPerson || { value: -0, label: '' }}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='LSP*'
                          inputProps={{
                            ...params.inputProps,
                          }}
                        />
                      )}
                    />
                  )
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12}>
              <AddRequestForm
                control={control}
                watch={watch}
                setValue={setValue}
                errors={errors}
                fields={fields}
                remove={remove}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                startIcon={<Icon icon='material-symbols:add' />}
                disabled={!isValid}
                onClick={() => {
                  append({
                    name: '',
                    sourceLanguage: '',
                    targetLanguage: '',
                    category: '',
                    serviceType: [],
                    desiredDueDate: '',
                    desiredDueTimezone: {
                      phone: '',
                      label: '',
                      code: '',
                    },
                  })
                }}
              >
                <Typography
                  color={!isValid ? 'secondary' : 'primary'}
                  sx={{ textDecoration: 'underline' }}
                >
                  Add new item
                </Typography>
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <Typography fontWeight={600} mb='24px'>
                Notes
              </Typography>
              <Controller
                name='description'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <>
                    <TextField
                      rows={4}
                      multiline
                      fullWidth
                      error={Boolean(errors.description)}
                      label='Write down a note'
                      value={value ?? ''}
                      onChange={onChange}
                      inputProps={{ maxLength: 500 }}
                    />
                    <Typography variant='body2' mt='12px' textAlign='right'>
                      {value?.length ?? 0}/500
                    </Typography>
                  </>
                )}
              />
            </Grid>
          </Grid>
        </Card>
      </Grid>

      {/* right */}
      <Grid item xs={3}>
        <Card
          sx={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Button fullWidth variant='outlined' color='secondary'>
            Cancel
          </Button>
          <Button fullWidth variant='contained' disabled={!isValid}>
            Request
          </Button>
        </Card>
      </Grid>
    </Grid>
  )
}

AddNewRequest.acl = {
  subject: 'client_request',
  action: 'read',
}
