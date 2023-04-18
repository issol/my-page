import Image from 'next/image'

import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'

import Button from '@mui/material/Button'

import Typography from '@mui/material/Typography'
import AlertIcon from '@src/@core/components/alert-icon'
import languageHelper from '@src/shared/helpers/language.helper'
import { SetPriceUnit } from '@src/types/common/standard-price'
import { FieldArrayWithId } from 'react-hook-form'

type Props = {
  onClose: any
  item: FieldArrayWithId<SetPriceUnit, 'pair', 'id'>
  isBase: boolean
  onClickAction: (
    item: FieldArrayWithId<SetPriceUnit, 'pair', 'id'>,
    isBase: boolean,
  ) => void
}
export default function BasePriceUnitRemoveModal({
  onClose,
  onClickAction,
  item,
  isBase,
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
          <AlertIcon type={'error'} />
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
            Are you sure you want to delete this base price? The associated
            price units will also be deleted.
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
            Cancel
          </Button>
          <Button
            size='medium'
            type='button'
            variant='contained'
            sx={{ borderRadius: '8px', textTransform: 'none' }}
            onClick={() => {
              onClose()
              onClickAction(item, isBase)
            }}
          >
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
