import { useEffect, useState } from 'react'

// ** design components
import { Icon } from '@iconify/react'
import {
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
  Typography,
} from '@mui/material'
import CustomChip from 'src/@core/components/mui/chip'

import styled from 'styled-components'

// ** types & schema
import { ClientDetailType } from '@src/types/client/client'
import { TitleTypography } from '@src/@core/styles/typography'
import {
  ClientAddressFormType,
  ClientAddressType,
  clientAddressAllRequiredSchema,
  clientAddressDefaultValue,
  clientAddressSchema,
} from '@src/types/schema/client-address.schema'
import { yupResolver } from '@hookform/resolvers/yup'

// ** fetch & mutation
import { useMutation, useQueryClient } from 'react-query'
import { updateClientAddress } from '@src/apis/client.api'

// ** hooks
import useModal from '@src/hooks/useModal'

// ** react hook form
import { useFieldArray, useForm } from 'react-hook-form'

// ** components
import ClientAddressesForm from '../../components/forms/addresses-info-form'
import DiscardChangesModal from '@src/pages/components/modals/discard-modals/discard-changes'
import ConfirmSaveAllChanges from '@src/pages/components/modals/confirm-save-modals/confirm-save-all-chages'

// ** toast
import { toast } from 'react-hot-toast'

type Props = {
  clientId: number
  clientInfo: ClientDetailType
  isUpdatable: boolean
  isDeletable: boolean
  isCreatable: boolean
}

export default function ClientAddresses({
  clientId,
  clientInfo,
  isUpdatable,
  isDeletable,
  isCreatable,
}: Props) {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const { openModal, closeModal } = useModal()

  const { clientAddresses: address } = clientInfo

  const filteredAddress = () => {
    return address?.filter(item => item.addressType !== 'billing')
  }

  function resetAddress() {
    reset({
      clientAddresses: !filteredAddress()?.length ? [] : filteredAddress(),
    })
  }
  const {
    control,
    getValues,
    setValue,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ClientAddressFormType>({
    defaultValues: clientAddressDefaultValue,
    mode: 'onChange',
    resolver: yupResolver(clientAddressAllRequiredSchema),
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'clientAddresses',
  })

  useEffect(() => {
    resetAddress()
  }, [])

  const updateClientAddressMutation = useMutation(
    (body: { data: Array<ClientAddressType> }) => updateClientAddress(body),
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
          onClose={() => {
            closeModal('discard')
            resetAddress()
          }}
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
    const data = getValues().clientAddresses
    if (data?.length) {
      const finalForm = data.map(item => {
        delete item.updatedAt
        delete item.createdAt
        return item
      })
      updateClientAddressMutation.mutate({ data: finalForm })
      // console.log(finalForm)
    }
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
            <Typography variant='h6'>Address</Typography>
            {isUpdatable ? (
              <IconButton onClick={() => setOpen(true)}>
                <Icon icon='mdi:pencil-outline' />
              </IconButton>
            ) : null}
          </Box>
        }
      />
      <CardContent>
        {filteredAddress()?.length
          ? filteredAddress()?.map((item, idx) => {
              const chipName =
                item.addressType === 'shipping' ? 'Shipping address' : item.name
              return (
                <Box key={idx}>
                  <Divider style={{ marginBottom: '24px' }} />

                  <Box display='flex' flexDirection='column' gap='16px'>
                    <CustomChip
                      sx={{ alignSelf: 'self-start' }}
                      rounded
                      label={chipName}
                      skin='light'
                      color={
                        item.addressType === 'shipping' ? 'info' : 'secondary'
                      }
                      size='small'
                    />
                    <InfoBox>
                      <Label variant='body2'>Street:</Label>
                      <TitleTypography variant='body2'>
                        {item?.baseAddress ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox>
                      <Label variant='body2'>Street2:</Label>
                      <TitleTypography variant='body2'>
                        {item?.detailAddress ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox>
                      <Label variant='body2'>City:</Label>
                      <TitleTypography variant='body2'>
                        {item?.city ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox>
                      <Label variant='body2'>State:</Label>
                      <TitleTypography variant='body2'>
                        {item?.state ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox>
                      <Label variant='body2'>Country:</Label>
                      <TitleTypography variant='body2'>
                        {item?.country ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                    <InfoBox mb='8px'>
                      <Label variant='body2'>ZIP code:</Label>
                      <TitleTypography variant='body2'>
                        {item?.zipCode ?? '-'}
                      </TitleTypography>
                    </InfoBox>
                  </Box>
                </Box>
              )
            })
          : null}
      </CardContent>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth='lg'>
        <DialogContent style={{ padding: '50px 60px' }}>
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
              type={'all-required'}
            />
            <Grid item xs={12}>
              <Divider />
            </Grid>
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

const Label = styled(Typography)`
  font-weight: bold;
  font-size: 1rem;
`
