import { useEffect, useState } from 'react'

// ** design component
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'

import styled from 'styled-components'

// ** types & schema
import { ClientDetailType } from '@src/types/client/client'
import { TitleTypography } from '@src/@core/styles/typography'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'
import { ClientStatus } from '@src/shared/const/status/statuses'
import {
  CompanyInfoFormType,
  companyInfoDefaultValue,
  companyInfoSchema,
} from '@src/types/schema/company-info.schema'
import { yupResolver } from '@hookform/resolvers/yup'

// ** fetch & mutation
import { useMutation, useQueryClient } from 'react-query'
import {
  updateClientInfo,
  updateClientInfoType,
  updateClientStatus,
} from '@src/apis/client.api'

// ** toast
import { toast } from 'react-hot-toast'

// ** react hook form
import { Controller, useForm } from 'react-hook-form'

// ** components
import CompanyInfoForm from '../../components/forms/company-info-form'
import DiscardChangesModal from '@src/pages/components/modals/discard-modals/discard-changes'
import ConfirmSaveAllChanges from '@src/pages/components/modals/confirm-save-modals/confirm-save-all-chages'

// ** hooks
import useModal from '@src/hooks/useModal'

type Props = {
  clientId: number
  clientInfo: ClientDetailType
  isUpdatable: boolean
  isDeletable: boolean
  isCreatable: boolean
}

export default function ClientInfo({
  clientId,
  clientInfo,
  isUpdatable,
  isDeletable,
  isCreatable,
}: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { openModal, closeModal } = useModal()

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
  } = useForm<CompanyInfoFormType>({
    mode: 'onChange',
    defaultValues: companyInfoDefaultValue,
    resolver: yupResolver(companyInfoSchema),
  })

  useEffect(() => {
    reset({
      clientType: clientInfo.clientType,
      status: clientInfo.status,
      name: clientInfo.name,
      email: clientInfo.email,
      timezone: clientInfo.timezone,
      phone: clientInfo.phone ?? '',
      mobile: clientInfo.mobile ?? '',
      fax: clientInfo.fax ?? '',
      websiteLink: clientInfo.websiteLink ?? '',
      isTaxable: clientInfo.isTaxable,
      tax: clientInfo.tax,
    })
  }, [clientInfo])

  const updateCompanyInfoMutation = useMutation(
    (body: updateClientInfoType) => updateClientInfo(clientId, body),
    {
      onSuccess: () => onMutationSuccess(),
      onError: () => onMutationError(),
    },
  )

  const updateClientStatusMutation = useMutation(
    (body: { status: string }) => updateClientStatus(clientId, body),
    {
      onSuccess: () => onMutationSuccess(),
      onError: () => onMutationError(),
    },
  )

  function onMutationSuccess() {
    return queryClient.invalidateQueries(`client-detail-${clientId}`)
  }
  function onMutationError() {
    toast.error('Something went wrong. Please try again.', {
      position: 'bottom-left',
    })
  }

  function onCancel() {
    openModal({
      type: 'discard',
      children: (
        <DiscardChangesModal
          onDiscard={() => setOpen(false)}
          onClose={() => closeModal('discard')}
        />
      ),
    })
  }

  function onSave() {
    openModal({
      type: 'save',
      children: (
        <ConfirmSaveAllChanges
          onSave={() => {
            setOpen(false)
            onSubmit()
          }}
          onClose={() => closeModal('save')}
        />
      ),
    })
  }

  function onSubmit() {
    updateCompanyInfoMutation.mutate(getValues())
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Typography variant='h6'>Company info</Typography>
            {isUpdatable ? (
              <IconButton onClick={() => setOpen(true)}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            ) : null}
          </Box>
        }
      />
      <CardContent>
        <Box display='flex' flexDirection='column' gap='16px'>
          <InfoBox>
            <Icon icon='ic:outline-email' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Email:
            </Typography>
            <TitleTypography variant='body2'>
              {clientInfo.email}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='mdi:earth' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Time zone:
            </Typography>
            <TitleTypography variant='body2'>
              {getGmtTime(clientInfo.timezone.code)}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='mdi:telephone' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Telephone:
            </Typography>
            <TitleTypography variant='body2'>
              {clientInfo?.phone
                ? `+${clientInfo.timezone.phone})  ${clientInfo.phone}`
                : '-'}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='material-symbols:smartphone' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Mobile phone:
            </Typography>
            <TitleTypography variant='body2'>
              {clientInfo?.mobile
                ? `+${clientInfo.timezone.phone})  ${clientInfo.mobile}`
                : '-'}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='material-symbols:fax-outline-rounded' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Fax:
            </Typography>
            <TitleTypography variant='body2'>
              {clientInfo?.fax
                ? `+${clientInfo.timezone.phone})  ${clientInfo.fax}`
                : '-'}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='material-symbols:link' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Website:
            </Typography>
            <Box
              width='100%'
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <TitleTypography variant='body2'>
                {clientInfo.websiteLink ?? '-'}
              </TitleTypography>
              <IconButton
                edge='end'
                disabled={!clientInfo.websiteLink}
                onClick={() =>
                  window.open(`${clientInfo.websiteLink}`, '_blank')
                }
              >
                <Icon icon='material-symbols:open-in-new' opacity={0.7} />
              </IconButton>
            </Box>
          </InfoBox>
          <Divider />
          <InfoBox>
            <Icon icon='mdi:dollar' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Tax type:
            </Typography>
            <TitleTypography variant='body2'>
              {clientInfo.isTaxable ? 'Taxable' : 'Non-taxable'}
            </TitleTypography>
          </InfoBox>
          <InfoBox>
            <Icon icon='heroicons-outline:receipt-tax' fontSize='20px' />
            <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
              Tax rate:
            </Typography>
            <TitleTypography variant='body2'>
              {clientInfo?.tax ? `${clientInfo?.tax} %` : '-'}
            </TitleTypography>
          </InfoBox>
        </Box>
        <Divider style={{ margin: '24px 0' }} />
        <Controller
          name='status'
          control={control}
          render={({ field: { value, onChange } }) => (
            <Autocomplete
              autoHighlight
              fullWidth
              options={ClientStatus}
              onChange={(e, v) => {
                if (!v) onChange({ value: '', label: '' })
                else {
                  onChange(v.value)
                  updateClientStatusMutation.mutate({ status: v.value })
                }
              }}
              value={
                !value
                  ? { value: '', label: '' }
                  : ClientStatus.filter(item => item.value === value)[0]
              }
              renderInput={params => (
                <TextField
                  {...params}
                  error={Boolean(errors.status)}
                  label='Status*'
                  placeholder='Status*'
                />
              )}
            />
          )}
        />
      </CardContent>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='lg'>
        <DialogContent style={{ padding: '50px 60px' }}>
          <Grid container spacing={6}>
            <CompanyInfoForm
              mode='update'
              control={control}
              setValue={setValue}
              errors={errors}
              watch={watch}
            />
            <Grid
              item
              xs={12}
              display='flex'
              justifyContent='center'
              gap='16px'
            >
              <Button variant='outlined' color='secondary' onClick={onCancel}>
                Cancel
              </Button>
              <Button variant='contained' disabled={!isValid} onClick={onSave}>
                Save
              </Button>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

const InfoBox = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: center;
`
