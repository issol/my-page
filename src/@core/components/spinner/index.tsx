// ** MUI Import
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

const FallbackSpinner = ({
  sx,
  noImage,
}: {
  sx?: BoxProps['sx']
  noImage?: boolean
}) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Box
      sx={{
        height: noImage ? '100%' : '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx,
      }}
    >
      {noImage ? null : <img src='/images/logos/loading-logo.svg' alt='logo' />}

      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
