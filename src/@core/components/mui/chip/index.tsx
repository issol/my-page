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

  const getSx = () => {
    if (skin === 'light' && color) {
      return Object.assign(colors[color], sx)
    } else if (customcolor) {
      if (type === 'jobType') {
        return {
          backgroundColor: customcolor,
          color: 'rgba(17, 17, 17, 0.87)',
          fontSize: '13px',
        }
      } else if (type === 'role') {
        return {
          background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${customcolor}`,
          border: `1px solid ${customcolor}`,
          color: 'rgba(17, 17, 17, 0.87)',
          fontSize: '13px',
        }
      } else if (type === 'testStatus') {
        return {
          background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${customcolor}`,
          color: customcolor,
          fontSize: '13px',
          fontWeight: 500,
        }
      } else if (type?.split('-')[0] === 'testType') {
        return {
          background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), ${customcolor}`,
          color: 'rgba(17, 17, 17, 0.87)',
          border: `1px solid ${
            type.split('-')[1] === 'Basic test' ? '#DF9F23' : customcolor
          }`,
          fontSize: '13px',
        }
      }
    } else {
      return sx
    }
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
      sx={getSx()}
    />
  )
}

export default Chip
