import { Box, Button, Card, Grid, Switch, Typography } from '@mui/material'
import PrintQuotePage from './pdf-download/quote-preview'
import { QuoteDownloadData } from '@src/types/common/quotes.type'
import { UserDataType } from '@src/context/types'
import { Dispatch, SetStateAction } from 'react'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import SelectReasonModal from '../../components/modal/select-reason-modal'

type Props = {
  downloadData: QuoteDownloadData
  user: UserDataType
  onClickDownloadQuotes: () => void
  downloadLanguage: 'EN' | 'KO'
  setDownloadLanguage: Dispatch<SetStateAction<'EN' | 'KO'>>
}

const ClientQuote = ({
  downloadData,
  user,
  onClickDownloadQuotes,
  downloadLanguage,
  setDownloadLanguage,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const handleAcceptQuote = () => {
    // TODO API call
    closeModal('AcceptQuoteModal')
  }

  const handleRequestRevision = () => {
    // TODO API call
    closeModal('RequestRevisionModal')
  }

  const handleRejectQuote = () => {
    // TODO API call
    closeModal('RejectQuoteModal')
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

  const onClickAction = (action: 'Request' | 'Reject') => {
    openModal({
      type: `${action === 'Request' ? 'RequestRevision' : 'RejectQuote'}Modal`,
      children: (
        <SelectReasonModal
          onClose={() =>
            closeModal(
              `${
                action === 'Request' ? 'RequestRevision' : 'RejectQuote'
              }Modal`,
            )
          }
          onClick={() => {
            action === 'Request' ? handleRequestRevision() : handleRejectQuote()
          }}
          vary={action === 'Request' ? 'successful' : 'error'}
          title={
            action === 'Request'
              ? 'Are you sure you want to request a revision of the quote?'
              : 'Are you sure you want to reject this quote?'
          }
          rightButtonText={action}
        />
      ),
    })
  }
  return (
    <Grid container xs={12} spacing={4}>
      <Grid item xs={8}>
        <PrintQuotePage
          data={downloadData!}
          type={'preview'}
          user={user!}
          lang={'KO'}
        />
      </Grid>
      <Grid item xs={4}>
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
            <Button variant='contained' fullWidth onClick={onClickAcceptQuote}>
              Accept this quote
            </Button>
            <Button
              variant='outlined'
              fullWidth
              onClick={() => onClickAction('Request')}
            >
              Request revision
            </Button>
            <Button
              variant='outlined'
              fullWidth
              onClick={onClickDownloadQuotes}
            >
              Download quote
            </Button>
            <Button
              variant='outlined'
              color='error'
              fullWidth
              onClick={() => onClickAction('Reject')}
            >
              Reject this quote
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
                  console.log(event.target.checked)
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
    </Grid>
  )
}

export default ClientQuote
