import { yupResolver } from '@hookform/resolvers/yup'
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import IconifyIcon from '@src/@core/components/icon'
import { patchClientForOrder } from '@src/apis/order-detail.api'

import useModal from '@src/hooks/useModal'
import ClientQuotesFormContainer from '@src/pages/components/form-container/clients/client-container'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { getAddress } from '@src/shared/helpers/address-helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getPhoneNumber } from '@src/shared/helpers/phone-number-helper'
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import { ClientType } from '@src/types/orders/order-detail'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from 'react-query'

type Props = {
  type: string
  client: ClientType
  edit: boolean
  setEdit?: Dispatch<SetStateAction<boolean>>
  orderId: number
  setTax: (n: number | null) => void
  setTaxable: (n: boolean) => void
}

const OrderDetailClient = ({
  type,
  client,
  edit,
  setEdit,
  orderId,
  setTax,
  setTaxable,
}: Props) => {
  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()

  const patchClientMutation = useMutation(
    (data: { id: number; form: ClientFormType }) =>
      patchClientForOrder(data.id, data.form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(`Client-${orderId}`)
        setEdit!(false)
        closeModal('EditSaveModal')
      },
    },
  )

  const {
    control: clientControl,
    getValues: getClientValue,
    setValue: setClientValue,
    watch: clientWatch,
    reset: clientReset,
    formState: { errors: clientErrors, isValid: isClientValid },
  } = useForm<ClientFormType>({
    mode: 'onChange',
    defaultValues: {
      clientId: NOT_APPLICABLE,
      contactPersonId: NOT_APPLICABLE,
      addressType: 'shipping',
    },
    resolver: yupResolver(clientSchema),
  })

  const onClickDiscard = () => {
    setEdit!(false)
    closeModal('DiscardModal')
  }

  const onClickSave = () => {
    const clients: any = {
      ...getClientValue(),
      contactPersonId:
        getClientValue().contactPersonId === NOT_APPLICABLE
          ? null
          : getClientValue().contactPersonId,
    }
    patchClientMutation.mutate({ id: orderId, form: clients })
  }

  useEffect(() => {
    if (client) {
      clientReset({
        clientId: client.client.clientId,
        contactPersonId: client.contactPerson?.id,
        addressType: client.clientAddress.find(value => value.isSelected)
          ?.addressType!,
      })
    }
  }, [client, clientReset])
  console.log(getClientValue())
  return (
    <Card sx={{ padding: '24px' }}>
      {edit ? (
        <Grid container spacing={6}>
          <ClientQuotesFormContainer
            control={clientControl}
            setValue={setClientValue}
            watch={clientWatch}
            setTax={setTax}
            setTaxable={setTaxable}
          />
          <Grid item xs={12}>
            <Box
              sx={{ display: 'flex', justifyContent: 'center', gap: '16px' }}
            >
              <Button
                variant='outlined'
                color='secondary'
                onClick={() =>
                  openModal({
                    type: 'DiscardModal',
                    children: (
                      <DiscardModal
                        onClose={() => closeModal('DiscardModal')}
                        onClick={onClickDiscard}
                      />
                    ),
                  })
                }
              >
                Cancel
              </Button>
              <Button
                variant='contained'
                disabled={!isClientValid}
                onClick={() =>
                  openModal({
                    type: 'EditSaveModal',
                    children: (
                      <EditSaveModal
                        onClose={() => closeModal('EditSaveModal')}
                        onClick={onClickSave}
                      />
                    ),
                  })
                }
              >
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      ) : (
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '30px',
          }}
        >
          {type === 'detail' ? (
            <IconButton
              sx={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => setEdit!(true)}
            >
              <IconifyIcon icon='mdi:pencil-outline' width={24} height={24} />
            </IconButton>
          ) : null}

          <Box sx={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Card sx={{ padding: '4px 5px' }}>
              <img
                src='/images/signup/role-client.png'
                alt='lpm'
                width={110}
                height={110}
              />
            </Card>
            <Typography variant='h6'>{client.client.name}</Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <Divider />
            <Box sx={{ display: 'flex', gap: '10px' }}>
              <Typography
                variant='subtitle1'
                sx={{ fontSize: '14px', fontWeight: 600, width: '131px' }}
              >
                Contact person
              </Typography>
              <Typography>
                {client.contactPerson !== null
                  ? getLegalName({
                      firstName: client.contactPerson?.firstName!,
                      middleName: client.contactPerson?.middleName!,
                      lastName: client.contactPerson?.lastName!,
                    })
                  : '-'}
              </Typography>
            </Box>
            <Divider />
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: '17.5px' }}
            >
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <IconifyIcon
                      icon='mdi:earth'
                      color='rgba(76, 78, 100, 0.54)'
                    />
                    <Typography
                      variant='subtitle1'
                      sx={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      Time zone:
                    </Typography>
                    <Typography variant='body2'>
                      {getGmtTimeEng(
                        client.contactPerson !== null
                          ? client.contactPerson.timezone.code
                          : client.client.timezone.code,
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <IconifyIcon
                      icon='material-symbols:call'
                      color='rgba(76, 78, 100, 0.54)'
                    />
                    <Typography
                      variant='subtitle1'
                      sx={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      Telephone:
                    </Typography>
                    <Typography variant='body2'>
                      {getPhoneNumber(
                        client.contactPerson !== null
                          ? client.contactPerson.phone!
                          : client.client.phone,
                        client.contactPerson !== null
                          ? client.contactPerson.timezone.phone
                          : client.client.timezone.phone,
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <IconifyIcon
                      icon='mdi:cellphone'
                      color='rgba(76, 78, 100, 0.54)'
                    />
                    <Typography
                      variant='subtitle1'
                      sx={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      Mobile phone:
                    </Typography>
                    <Typography variant='body2'>
                      {getPhoneNumber(
                        client.contactPerson !== null
                          ? client.contactPerson.mobile!
                          : client.client.mobile,
                        client.contactPerson !== null
                          ? client.contactPerson.timezone.phone
                          : client.client.timezone.phone,
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <IconifyIcon
                      icon='material-symbols:fax-outline-rounded'
                      color='rgba(76, 78, 100, 0.54)'
                    />
                    <Typography
                      variant='subtitle1'
                      sx={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      Fax:
                    </Typography>
                    <Typography variant='body2'>
                      {getPhoneNumber(
                        client.contactPerson !== null
                          ? client.contactPerson.fax!
                          : client.client.fax,
                        client.contactPerson !== null
                          ? client.contactPerson.timezone.phone
                          : client.client.timezone.phone,
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Box sx={{ display: 'flex' }}>
                <Box sx={{ display: 'flex', flex: 1 }}>
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <IconifyIcon
                      icon='ic:outline-email'
                      color='rgba(76, 78, 100, 0.54)'
                    />
                    <Typography
                      variant='subtitle1'
                      sx={{ fontSize: '14px', fontWeight: 600 }}
                    >
                      Email:
                    </Typography>
                    <Typography variant='body2'>
                      {client.contactPerson !== null
                        ? client.contactPerson.email
                        : client.client.email}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Divider />

              <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Typography
                  variant='subtitle1'
                  sx={{
                    fontSize: '14px',
                    fontWeight: 600,
                    width: '131px',
                    display: 'flex',
                  }}
                >
                  <Box sx={{ textTransform: 'capitalize' }}>
                    {client.addressType}
                  </Box>
                  &nbsp;address
                </Typography>
                <Typography variant='body2'>
                  {getAddress(client.clientAddress)}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Card>
  )
}

export default OrderDetailClient
