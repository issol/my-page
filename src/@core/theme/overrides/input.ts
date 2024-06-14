// ** MUI Imports
import { Theme } from '@mui/material/styles'
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'

const input = (theme: Theme) => {
  return {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: theme.palette.text.secondary,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          lineHeight: '1.5rem',
          '&:before': {
            borderBottom: `1px solid ${hexToRGBA(theme.palette.customColors.main, 0.22)}`,
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid ${hexToRGBA(theme.palette.customColors.main, 0.32)}`,
          },
          '&.Mui-disabled:before': {
            borderBottomStyle: 'solid',
          },
        },
      },
    },
    MuiFilledInput: {
      styleOverrides: {
        root: {
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          backgroundColor: hexToRGBA(theme.palette.customColors.main, 0.05),
          '&:hover:not(.Mui-disabled)': {
            backgroundColor: hexToRGBA(theme.palette.customColors.main, 0.08),
          },
          '&:before': {
            borderBottom: `1px solid ${hexToRGBA(theme.palette.customColors.main, 0.22)}`,
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: `1px solid ${hexToRGBA(theme.palette.customColors.main, 0.32)}`,
          },
          '&.Mui-disabled': {
            backgroundColor: hexToRGBA(theme.palette.customColors.main, 0.05),
            '&:before': {
              borderBottomStyle: 'solid',
            },
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&:hover:not(.Mui-focused):not(.Mui-disabled):not(.Mui-error) .MuiOutlinedInput-notchedOutline':
            {
              borderColor: hexToRGBA(theme.palette.customColors.main, 0.32),
            },
          '&:hover.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.error.main,
          },
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: hexToRGBA(theme.palette.customColors.main, 0.22),
          },
          '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.text.disabled,
          },
        },
      },
    },
  }
}

export default input
