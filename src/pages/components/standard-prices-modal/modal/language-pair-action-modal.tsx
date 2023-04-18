import Image from 'next/image'

import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'
import AlertIcon from '@src/@core/components/alert-icon'
import languageHelper from '@src/shared/helpers/language.helper'

type Props = {
  type: string
  onClose: any
  onClickAction: any
  source?: string
  target?: string
  data?: {
    source: string
    target: string
    priceFactor: number | null
    minimumPrice: number | null
    currency: string
  }[]
}
export default function LanguagePairActionModal({
  type,
  onClose,
  onClickAction,
  source,
  target,
  data,
}: Props) {
  return (
    <Dialog
      open={true}
      keepMounted
      onClose={onClose}
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
          {type === 'Add' || type === 'Save' ? (
            <AlertIcon type={'successful'} />
          ) : (
            <AlertIcon type={'error'} />
          )}
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
                <Box>Are you sure you want to add this language pair(s)?</Box>
              </Box>
            ) : type === 'Discard' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>
                  Are you sure you want to discard this language pair(s)?
                </Box>
              </Box>
            ) : type === 'Delete' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>Are you sure you want to delete this language pair?</Box>
                <Typography
                  variant='body2'
                  sx={{ fontWeight: 700, fontSize: '1rem' }}
                >
                  {languageHelper(source)} &rarr; {languageHelper(target)}
                </Typography>
              </Box>
            ) : type === 'Save' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>Are you sure you want to save all changes?</Box>
              </Box>
            ) : type === 'Cancel' ? (
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box>
                  Are you sure you want to leave this page? Changes you made may
                  not be saved.
                </Box>
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
              onClose()
              // onClickAction('Cancel')
            }}
          >
            {type === 'Cancel' ? 'Stay on this page' : 'Cancel'}
          </Button>
          <Button
            size='medium'
            type='button'
            variant='contained'
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            onClick={() => {
              onClose()
              if (type === 'Add' || type === 'Discard') {
                onClickAction(
                  type === 'Add' ? 'Add' : type === 'Discard' ? 'Discard' : '',
                  type === 'Add' ? data : undefined,
                )
              } else if (
                type === 'Delete' ||
                type === 'Save' ||
                type === 'Cancel'
              ) {
                onClickAction()
              }
            }}
          >
            {type === 'Add'
              ? 'Add'
              : type === 'Discard'
              ? 'Discard'
              : type === 'Delete'
              ? 'Delete'
              : type === 'Save'
              ? 'Save'
              : type === 'Cancel'
              ? 'Leave this page'
              : ''}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
