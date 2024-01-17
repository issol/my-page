import { Box, Typography } from '@mui/material'

const NoList = (title: string) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Typography variant='subtitle1'>{title}</Typography>
    </Box>
  )
}

export default NoList
