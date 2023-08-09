import { Box, Button, Card, Grid, Switch, Typography } from '@mui/material'

import { UserDataType } from '@src/context/types'
import { Dispatch, SetStateAction } from 'react'
import useModal from '@src/hooks/useModal'

import { UseMutationResult, useMutation, useQueryClient } from 'react-query'

import { CancelReasonType } from '@src/types/requests/detail.type'
import {
  CancelQuoteReason,
  RequestRevisionReason,
} from '@src/shared/const/reason/reason'
import {
  OrderDownloadData,
  ProjectInfoType,
} from '@src/types/orders/order-detail'

import SelectReasonModal from '@src/pages/quotes/components/modal/select-reason-modal'
import PrintOrderPage from '@src/pages/orders/order-print/print-page'
import {
  InvoiceDownloadData,
  InvoiceReceivablePatchParamsType,
} from '@src/types/invoice/receivable.type'
import PrintInvoicePage from '../invoice-print/print-page'
import ConfirmInvoiceModal from './modal/confirm-invoice-modal'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { confirmInvoiceFromClient } from '@src/apis/invoice/receivable.api'

type Props = {
  downloadData: InvoiceDownloadData
  user: UserDataType

  downloadLanguage?: 'EN' | 'KO'
  setDownloadLanguage?: Dispatch<SetStateAction<'EN' | 'KO'>>
  onClickDownloadInvoice?: () => void
  type: 'detail' | 'history'
  onSave?: (data: {
    id: number
    form: InvoiceReceivablePatchParamsType
  }) => void
}

const ClientInvoice = ({
  downloadData,
  user,

  downloadLanguage,
  setDownloadLanguage,
  type,
  onSave,
  onClickDownloadInvoice,
}: // statusList,
// project,
Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()

  const confirmInvoiceMutation = useMutation(
    (data: {
      clientConfirmedAt: string
      clientConfirmTimezone: CountryType
      taxInvoiceDueAt?: string
      taxInvoiceDueTimezone?: CountryType
    }) => confirmInvoiceFromClient(downloadData.invoiceId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('invoiceReceivableDetail')
        closeModal('ConfirmInvoiceModal')
      },
    },
  )

  const handleConfirmInvoice = (data?: {
    taxInvoiceDueAt: string
    taxInvoiceDueTimezone: CountryType
  }) => {
    //TODO API 연결
    const res = {
      ...data,
      clientConfirmedAt: Date(),
      clientConfirmTimezone: user.timezone,
    }
    confirmInvoiceMutation.mutate({ ...res })
  }

  const onClickConfirmInvoice = () => {
    openModal({
      type: 'ConfirmInvoiceModal',
      children: (
        <ConfirmInvoiceModal
          onClose={() => closeModal('ConfirmInvoiceModal')}
          onClick={handleConfirmInvoice}
        />
      ),
    })
  }

  return (
    <Grid container xs={12} spacing={4}>
      <Grid item xs={type === 'history' ? 12 : 9}>
        {type === 'history' ? (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              sx={{
                display: 'flex',
                gap: '4px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                fontSize={14}
                fontWeight={downloadLanguage === 'KO' ? 400 : 600}
                color={downloadLanguage === 'KO' ? '#BDBDBD' : '#666CFF'}
              >
                English
              </Typography>
              <Switch
                checked={downloadLanguage === 'KO'}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setDownloadLanguage &&
                    setDownloadLanguage(event.target.checked ? 'KO' : 'EN')
                }}
                inputProps={{ 'aria-label': 'controlled' }}
                sx={{
                  '.MuiSwitch-switchBase:not(.Mui-checked)': {
                    color: '#666CFF',
                    '.MuiSwitch-thumb': {
                      color: '#666CFF',
                    },
                  },
                  '.MuiSwitch-track': {
                    backgroundColor: '#666CFF',
                  },
                }}
              />
              <Typography
                fontSize={14}
                fontWeight={downloadLanguage === 'KO' ? 600 : 400}
                color={downloadLanguage === 'KO' ? '#666CFF' : '#BDBDBD'}
              >
                Korean
              </Typography>
            </Box>
          </Box>
        ) : null}
        <PrintInvoicePage
          data={downloadData!}
          type={'preview'}
          user={user!}
          lang={downloadLanguage ?? 'EN'}
        />
      </Grid>
      {type === 'history' ? null : (
        <Grid item xs={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
          >
            <Card
              sx={{
                padding: '24px',
                gap: '14.89px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Button
                variant='contained'
                fullWidth
                onClick={onClickConfirmInvoice}
              >
                Confirm invoice
              </Button>
              <Button
                variant='outlined'
                fullWidth
                color='secondary'
                onClick={onClickDownloadInvoice}
              >
                Download invoice
              </Button>
            </Card>
            <Card sx={{ padding: '24px' }}>
              <Box
                sx={{
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  fontSize={14}
                  fontWeight={downloadLanguage === 'KO' ? 400 : 600}
                  color={downloadLanguage === 'KO' ? '#BDBDBD' : '#666CFF'}
                >
                  English
                </Typography>
                <Switch
                  checked={downloadLanguage === 'KO'}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setDownloadLanguage &&
                      setDownloadLanguage(event.target.checked ? 'KO' : 'EN')
                  }}
                  inputProps={{ 'aria-label': 'controlled' }}
                  sx={{
                    '.MuiSwitch-switchBase:not(.Mui-checked)': {
                      color: '#666CFF',
                      '.MuiSwitch-thumb': {
                        color: '#666CFF',
                      },
                    },
                    '.MuiSwitch-track': {
                      backgroundColor: '#666CFF',
                    },
                  }}
                />
                <Typography
                  fontSize={14}
                  fontWeight={downloadLanguage === 'KO' ? 600 : 400}
                  color={downloadLanguage === 'KO' ? '#666CFF' : '#BDBDBD'}
                >
                  Korean
                </Typography>
              </Box>
            </Card>
          </Box>
        </Grid>
      )}
    </Grid>
  )
}

export default ClientInvoice
