import { Box, Typography } from '@mui/material'

export default function NoList(title: string) {
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
