// ** MUI Imports
import MuiChip from '@mui/material/Chip'

// ** Third Party Imports
import clsx from 'clsx'

// ** Types
import { CustomChipProps } from './types'

// ** Hooks Imports
import useBgColor, { UseBgColorType } from 'src/@core/hooks/useBgColor'
import { createTheme } from '@mui/material/styles'

const Chip = (props: CustomChipProps) => {
  // ** Props
  const { sx, skin, color, rounded, customcolor, type } = props

  // ** Hook
  const bgColors = useBgColor()

  const colors: UseBgColorType = {
    primary: { ...bgColors.primaryLight },
    secondary: { ...bgColors.secondaryLight },
    success: { ...bgColors.successLight },
    error: { ...bgColors.errorLight },
    warning: { ...bgColors.warningLight },
    info: { ...bgColors.infoLight },
  }

  const propsToPass = { ...props }

  propsToPass.rounded = undefined

  return (
    <MuiChip
      {...propsToPass}
      variant='filled'
      className={clsx({
        'MuiChip-rounded': rounded,
        'MuiChip-light': skin === 'light',
      })}
      sx={
        skin === 'light' && color
          ? Object.assign(colors[color], sx)
          : type === 'jobType' && customcolor
          ? {
              backgroundColor: customcolor,
              color: 'rgba(17, 17, 17, 0.87)',
              fontSize: '13px',
            }
          : type === 'role' && customcolor
          ? {
              background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${customcolor}`,
              border: `1px solid ${customcolor}`,
              color: 'rgba(17, 17, 17, 0.87)',
              fontSize: '13px',
            }
          : type === 'testStatus' && customcolor
          ? {
              background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${customcolor}`,
              color: customcolor,
              fontSize: '13px',
              fontWeight: 500,
            }
          : sx
      }
    />
  )
}

export default Chip
