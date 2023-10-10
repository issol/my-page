import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import { Box, Button, Typography } from '@mui/material'

type Props = {
  onClose: () => void
}
export default function ServerErrorModal({ onClose }: Props) {
  return (
    <SmallModalContainer>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '68px',
          height: '68px',
          background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF;',
          borderRadius: '68px',
        }}
      >
        <AlertIcon type='error' />
      </Box>
      <Typography variant='body1'>
        An temporary error has occurred on the server.
        <br />
        Please try again later.
      </Typography>
      <Box display='flex' gap='20px' justifyContent='center' mt='26px'>
          <Button
            variant='contained'
            onClick={() => {onClose()}}>
            Okay
          </Button>
      </Box>
    </SmallModalContainer>
  )
}
