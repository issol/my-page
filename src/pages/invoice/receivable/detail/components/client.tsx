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
import { getClient } from '@src/apis/order-detail.api'

import useModal from '@src/hooks/useModal'
import ClientQuotesFormContainer from '@src/pages/components/form-container/clients/client-container'
import { NOT_APPLICABLE } from '@src/shared/const/not-applicable'
import { getAddress } from '@src/shared/helpers/address-helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getPhoneNumber } from '@src/shared/helpers/phone-number-helper'
import { getGmtTimeEng } from '@src/shared/helpers/timezone.helper'
import { InvoiceProjectInfoFormType } from '@src/types/invoice/common.type'
import {
  InvoiceReceivableDetailType,
  InvoiceReceivablePatchParamsType,
} from '@src/types/invoice/receivable.type'
import { ClientType } from '@src/types/orders/order-detail'
import { ClientAddressType } from '@src/types/schema/client-address.schema'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import { da } from 'date-fns/locale'
import { Dispatch, SetStateAction, useEffect } from 'react'
import {
  Control,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  UseFormTrigger,
  UseFormWatch,
  useForm,
} from 'react-hook-form'

type Props = {
  type: string
  client: ClientType
  edit: boolean
  setEdit?: Dispatch<SetStateAction<boolean>>
  setTax?: (n: number | null) => void
  setTaxable?: (n: boolean) => void
  clientControl?: Control<ClientFormType, any>
  getClientValue?: UseFormGetValues<ClientFormType>
  setClientValue?: UseFormSetValue<ClientFormType>
  clientWatch?: UseFormWatch<ClientFormType>
  getInvoiceInfo?: UseFormGetValues<InvoiceProjectInfoFormType>
  invoiceInfo?: InvoiceReceivableDetailType
  isClientValid?: boolean
  onSave?: (data: {
    id: number
    form: InvoiceReceivablePatchParamsType
    type: 'basic' | 'accounting'
  }) => void
  isUpdatable: boolean
}

const InvoiceClient = ({
  type,
  client,
  edit,
  setEdit,
  setTax,
  setTaxable,
  clientControl,
  getClientValue,
  setClientValue,
  getInvoiceInfo,
  clientWatch,
  isClientValid,
  invoiceInfo,
  onSave,
  isUpdatable,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const onClickDiscard = () => {
    setEdit!(false)
    closeModal('DiscardModal')
  }

  const onClickSave = () => {
    if (getClientValue) {
      const clients = {
        ...getClientValue(),
        contactPersonId:
          getClientValue().contactPersonId === NOT_APPLICABLE
            ? null
            : getClientValue().contactPersonId,
      }

      const data = getInvoiceInfo && getInvoiceInfo()
      if (onSave && data && invoiceInfo) {
        onSave({
          id: invoiceInfo.id,
          form: {
            ...data,
            // contactPersonId: clients.contactPersonId,
            ...clients,

            isTaxable: data.isTaxable ? '1' : '0',
            showDescription: data.showDescription ? '1' : '0',
            taxInvoiceIssued: data.taxInvoiceIssued ? '1' : '0',
            setReminder: data.setReminder ? '1' : '0',
          },
          type: 'basic',
        })
      }
    }
  }

  return (
    <Card sx={{ padding: '24px' }}>
      {edit ? (
        <Grid container spacing={6}>
          <ClientQuotesFormContainer
            control={clientControl!}
            setValue={setClientValue!}
            setTax={setTax!}
            setTaxable={setTaxable!}
            watch={clientWatch!}
            type='order'
            formType='edit'
            getValue={getClientValue!}
            fromQuote={false}
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
          {type === 'detail' &&
          isUpdatable &&
          client?.contactPerson?.userId === null &&
          ![30900, 301200].includes(invoiceInfo?.invoiceStatus!) ? (
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
            <Typography variant='h6'>{client.client?.name}</Typography>
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
                          ? client.contactPerson.timezone?.code
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
                          ? client.contactPerson.timezone?.phone
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
                          ? client.contactPerson.timezone?.phone
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
                          ? client.contactPerson.timezone?.phone
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
                    {/* {client.addressType} */}
                    {
                      client.clientAddress.find(value => value.isSelected)
                        ?.addressType
                    }
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

export default InvoiceClient
