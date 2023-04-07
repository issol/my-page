import Image from 'next/image'

import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

import { AddRoleType } from 'src/types/onboarding/list'
import { AddPriceType } from '@src/types/company/standard-client-prices'
import { Dispatch, SetStateAction, useContext } from 'react'
import { ModalContext } from '@src/context/ModalContext'
type Props = {
  priceData?: AddPriceType
  type: string
  onClickAction: (type: string) => void
}
export default function PriceActionModal({
  priceData,
  type,
  onClickAction,
}: Props) {
  const { setModal } = useContext(ModalContext)

  return (
    <Dialog
      open={true}
      keepMounted
      onClose={() => setModal(null)}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='xs'
      PaperProps={{
        style: {
          zIndex: 1301,
        },
      }}
    >
      <DialogContent
        sx={{
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Image
            src={`/images/icons/alert/${
              type === 'Add' || type === 'Save'
                ? 'alert-success'
                : 'alert-error-color'
            }.svg`}
            width={68}
            height={68}
            alt=''
          />
        </Box>

        <DialogContentText id='alert-dialog-slide-description'>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',

              textAlign: 'center',
              letterSpacing: '0.15px',

              color: 'rgba(76, 78, 100, 0.6)',
            }}
          >
            {type === 'Add' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>Are you sure you want to add this price?</Box>
                <Typography>{priceData?.priceName}</Typography>
              </Box>
            ) : type === 'Discard' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>Are you sure you want to discard this price?</Box>
                <Typography>{priceData?.priceName}</Typography>
              </Box>
            ) : type === 'Cancel' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>Are you sure you want to discard all changes?</Box>
                <Typography>{priceData?.priceName}</Typography>
              </Box>
            ) : type === 'Save' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>Are you sure you want to save all changes?</Box>
                <Typography>{priceData?.priceName}</Typography>
              </Box>
            ) : null}
          </Typography>
        </DialogContentText>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '18px',
            gap: '10px',
          }}
        >
          <Button
            size='medium'
            type='button'
            variant='outlined'
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            onClick={() => {
              setModal(null)
              onClickAction('Cancel')
            }}
          >
            Cancel
          </Button>
          <Button
            size='medium'
            type='button'
            variant='contained'
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            onClick={() => {
              setModal(null)
              onClickAction(
                type === 'Add'
                  ? 'Add'
                  : type === 'Discard'
                  ? 'Discard'
                  : type === 'Cancel'
                  ? 'Discard'
                  : type === 'Save'
                  ? 'Save'
                  : '',
              )
            }}
          >
            {type === 'Add'
              ? 'Add'
              : type === 'Discard'
              ? 'Discard'
              : type === 'Cancel'
              ? 'Discard'
              : type === 'Save'
              ? 'Save'
              : ''}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
