// ** MUI Imports
import { Theme } from '@mui/material/styles'
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'

const select = (theme: Theme) => {
  return {
    MuiSelect: {
      styleOverrides: {
        select: {
          minWidth: '6rem !important',
          '&.MuiTablePagination-select': {
            minWidth: '1.5rem !important',
          },
          '&.Mui-disabled ~ .MuiOutlinedInput-notchedOutline': {
            borderColor: hexToRGBA(theme.palette.customColors.main, 0.22),
          },
        },
      },
    },
  }
}

export default select
