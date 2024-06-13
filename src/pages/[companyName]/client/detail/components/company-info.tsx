import { useContext, useEffect, useState } from 'react'

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

import { styled } from '@mui/system'

// ** types & schema
import { ClientDetailType } from '@src/types/client/client'
import { TitleTypography } from '@src/@core/styles/typography'
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
import { Controller, Resolver, useForm } from 'react-hook-form'

// ** components
import CompanyInfoForm from '../../components/forms/company-info-form'
import DiscardChangesModal from 'src/pages/[companyName]/components/modals/discard-modals/discard-changes'
import ConfirmSaveAllChanges from 'src/pages/[companyName]/components/modals/confirm-save-modals/confirm-save-all-chages'

// ** hooks
import useModal from '@src/hooks/useModal'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import FallbackSpinner from '@src/@core/components/spinner'
import {
  contryCodeAndPhoneNumberFormatter,
  splitContryCodeAndPhoneNumber,
} from '@src/shared/helpers/phone-number-helper'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  clientId: number
  clientInfo: ClientDetailType
  isUpdatable: boolean
  isDeletable: boolean
  isCreatable: boolean
  isSigned: boolean
}

export default function ClientInfo({
  clientId,
  clientInfo,
  isUpdatable,
  isDeletable,
  isCreatable,
  isSigned,
}: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { openModal, closeModal } = useModal()

  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors, isValid },
  } = useForm<CompanyInfoFormType>({
    mode: 'onChange',
    defaultValues: companyInfoDefaultValue,
    resolver: yupResolver(companyInfoSchema) as Resolver<CompanyInfoFormType>,
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
      tax: clientInfo.tax ?? null,
      headquarter: clientInfo.headquarter,
      registrationNumber: clientInfo.registrationNumber,
      representativeName: clientInfo.representativeName,
      commencementDate: clientInfo.commencementDate,
    })
    trigger()
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
    <>
      {auth.state === 'loading' ? (
        <FallbackSpinner />
      ) : auth.state === 'hasValue' ? (
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
                  isSigned ? null : (
                    <IconButton onClick={() => setOpen(true)}>
                      <Icon icon='mdi:pencil-outline' />
                    </IconButton>
                  )
                ) : null}
              </Box>
            }
          />
          <CardContent>
            <Box display='flex' flexDirection='column' gap='16px'>
              <InfoBox>
                <Icon
                  icon='pajamas:building'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Headquarter:&nbsp;
                  <Typography variant='body2' component={'span'}>
                    {clientInfo.headquarter ?? '-'}
                  </Typography>
                </Typography>
              </InfoBox>
              <InfoBox>
                <Icon
                  icon='ic:sharp-playlist-add-check'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Business registration number:&nbsp;
                  <Typography variant='body2' component={'span'}>
                    {clientInfo.registrationNumber ?? '-'}
                  </Typography>
                </Typography>
              </InfoBox>
              <InfoBox>
                <Icon
                  icon='mdi:crown-outline'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Name of representative:&nbsp;
                  <Typography variant='body2' component={'span'}>
                    {clientInfo.representativeName ?? '-'}
                  </Typography>
                </Typography>
              </InfoBox>
              <InfoBox>
                <Icon
                  icon='ic:baseline-calendar-today'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Business commencement date:&nbsp;
                  <Typography variant='body2' component={'span'}>
                    {clientInfo.commencementDate
                      ? convertTimeToTimezone(
                          clientInfo.commencementDate,
                          auth.getValue().user?.timezone,
                          timezone.getValue(),
                        )
                      : '-'}
                  </Typography>
                </Typography>
              </InfoBox>
              <Divider />
              <InfoBox>
                <Icon
                  icon='ic:outline-email'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Email:&nbsp;
                  <Typography variant='body2' component={'span'}>
                    {clientInfo.email ?? '-'}
                  </Typography>
                </Typography>
              </InfoBox>
              <InfoBox>
                <Icon
                  icon='mdi:earth'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />

                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Time zone:&nbsp;
                  <Typography variant='body2' component={'span'}>
                    {clientInfo?.timezone?.label}
                  </Typography>
                </Typography>
              </InfoBox>
              <InfoBox>
                <Icon
                  icon='mdi:telephone'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Telephone:
                </Typography>
                <Typography variant='body2' component={'span'}>
                  {!clientInfo?.phone
                    ? '-'
                    : contryCodeAndPhoneNumberFormatter(
                        splitContryCodeAndPhoneNumber(clientInfo.phone),
                      )}
                </Typography>
              </InfoBox>
              <InfoBox>
                <Icon
                  icon='material-symbols:smartphone'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Mobile phone:&nbsp;
                  <Typography variant='body2' component={'span'}>
                    {!clientInfo?.mobile
                      ? '-'
                      : contryCodeAndPhoneNumberFormatter(
                          splitContryCodeAndPhoneNumber(clientInfo.mobile),
                        )}
                  </Typography>
                </Typography>
              </InfoBox>
              <InfoBox>
                <Icon
                  icon='material-symbols:fax-outline-rounded'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Fax:&nbsp;
                  <Typography variant='body2' component={'span'}>
                    {!clientInfo?.fax
                      ? '-'
                      : contryCodeAndPhoneNumberFormatter(
                          splitContryCodeAndPhoneNumber(clientInfo.fax),
                        )}
                  </Typography>
                </Typography>
              </InfoBox>
              <InfoBox>
                <Icon
                  icon='ic:sharp-link'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography
                  fontSize='1rem'
                  variant='body2'
                  fontWeight='bold'
                  component={'div'}
                >
                  Website:&nbsp;
                  <Typography
                    variant='body2'
                    component={'span'}
                    sx={{ alignItems: 'center' }}
                  >
                    {clientInfo.websiteLink && clientInfo.websiteLink !== ''
                      ? clientInfo.websiteLink
                      : '-'}
                    {clientInfo.websiteLink &&
                      clientInfo.websiteLink !== '' && (
                        <IconButton
                          edge='end'
                          disabled={!clientInfo.websiteLink}
                          sx={{ padding: 0 }}
                          onClick={() =>
                            window.open(`${clientInfo.websiteLink}`, '_blank')
                          }
                        >
                          <Icon
                            icon='material-symbols:open-in-new'
                            opacity={0.7}
                            fontSize={18}
                          />
                        </IconButton>
                      )}
                  </Typography>
                </Typography>
              </InfoBox>
              <Divider />
              <InfoBox>
                <Icon
                  icon='mdi:dollar'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
                <Typography fontSize='1rem' variant='body2' fontWeight='bold'>
                  Tax type:
                </Typography>
                <TitleTypography variant='body2'>
                  {clientInfo.isTaxable ? 'Taxable' : 'Non-taxable'}
                </TitleTypography>
              </InfoBox>
              <InfoBox>
                <Icon
                  icon='heroicons-outline:receipt-tax'
                  fontSize='20px'
                  color='rgba(76, 78, 100, 0.54)'
                  style={{ margin: '1px 0 0 1px' }}
                />
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
                      autoComplete='off'
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
                  getValue={getValues}
                  errors={errors}
                  watch={watch}
                  trigger={trigger}
                />
                <Grid
                  item
                  xs={12}
                  display='flex'
                  justifyContent='center'
                  gap='16px'
                >
                  <Button
                    variant='outlined'
                    color='secondary'
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    disabled={!isValid || (watch('isTaxable') && !watch('tax'))}
                    onClick={onSave}
                  >
                    Save
                  </Button>
                </Grid>
              </Grid>
            </DialogContent>
          </Dialog>
        </Card>
      ) : null}
    </>
  )
}

const InfoBox = styled(Box)`
  display: flex;
  gap: 8px;
  align-items: start;
`