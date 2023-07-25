import { Box, Button, Card, Grid, Switch, Typography } from '@mui/material'

import { UserDataType } from '@src/context/types'
import { Dispatch, SetStateAction } from 'react'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

import { UseMutationResult } from 'react-query'

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
import { updateOrderType } from '../[id]'

type Props = {
  downloadData: OrderDownloadData
  user: UserDataType
  onClickDownloadOrder?: () => void
  downloadLanguage?: 'EN' | 'KO'
  setDownloadLanguage?: Dispatch<SetStateAction<'EN' | 'KO'>>
  type: 'detail' | 'history'
  updateProject?: UseMutationResult<void, unknown, updateOrderType, unknown>
  statusList: { value: number; label: string }[]
  project: ProjectInfoType
}

const ClientOrder = ({
  downloadData,
  user,
  onClickDownloadOrder,
  downloadLanguage,
  setDownloadLanguage,
  type,
  updateProject,
  statusList,
  project,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const handleAcceptQuote = (status: number) => {
    // TODO API call
    updateProject &&
      updateProject?.mutate(
        { status: status },
        {
          onSuccess: () => {
            closeModal('AcceptQuoteModal')
          },
        },
      )
  }

  const handleRequestRevision = (status: number, reason: CancelReasonType) => {
    // TODO API call
    updateProject &&
      updateProject?.mutate(
        { status: status, reason: reason },
        {
          onSuccess: () => {
            closeModal('RequestRevisionModal')
          },
        },
      )
  }

  const handleRejectQuote = (status: number, reason: CancelReasonType) => {
    // TODO API call
    updateProject &&
      updateProject?.mutate(
        { status: status, reason: reason },
        {
          onSuccess: () => {
            closeModal('RejectQuoteModal')
          },
        },
      )
  }

  const onClickAcceptQuote = () => {
    openModal({
      type: 'AcceptQuoteModal',
      children: (
        <CustomModal
          onClose={() => closeModal('AcceptQuoteModal')}
          onClick={handleAcceptQuote}
          vary='successful'
          title='Are you sure you want to accept this quote?'
          rightButtonText='Accept'
        />
      ),
    })
  }

  const onClickAction = (action: 'Request revision' | 'Rejected') => {
    openModal({
      type: `${
        action === 'Request revision' ? 'RequestRevision' : 'RejectQuote'
      }Modal`,
      children: (
        <SelectReasonModal
          onClose={() =>
            closeModal(
              `${
                action === 'Request revision'
                  ? 'RequestRevision'
                  : 'RejectQuote'
              }Modal`,
            )
          }
          onClick={(status: number, cancelReason: CancelReasonType) => {
            action === 'Request revision'
              ? handleRequestRevision(status, cancelReason)
              : handleRejectQuote(status, cancelReason)
          }}
          vary={action === 'Request revision' ? 'successful' : 'error'}
          title={
            action === 'Request revision'
              ? 'Are you sure you want to request a revision of the quote?'
              : 'Are you sure you want to reject this quote?'
          }
          rightButtonText={action === 'Request revision' ? 'Request' : 'Reject'}
          action={action}
          from={'client'}
          statusList={statusList}
          type={
            action === 'Request revision' ? 'requested_revision' : 'rejected'
          }
          reasonList={
            action === 'Request revision'
              ? RequestRevisionReason
              : CancelQuoteReason
          }
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
        <PrintOrderPage
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
                variant='outlined'
                fullWidth
                onClick={onClickDownloadOrder}
              >
                Download order
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

export default ClientOrder
