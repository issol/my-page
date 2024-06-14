// ** MUI Imports
import { Theme } from '@mui/material/styles'
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'

const Rating = (theme: Theme) => {
  return {
    MuiRating: {
      styleOverrides: {
        root: {
          color: theme.palette.warning.main,
          '& svg': {
            flexShrink: 0,
          },
        },
        iconEmpty: {
          color: hexToRGBA(theme.palette.customColors.main, 0.22),
        },
      },
    },
  }
}

export default Rating
