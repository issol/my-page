import { Switch, SwitchProps } from '@mui/material'
import { styled as muiStyled } from '@mui/material/styles'
import pal from 'src/@core/theme/palette'

const palette = pal('light', 'default')
export const AntSwitch = muiStyled(Switch)(({ theme }) => ({
  width: 28,
  height: 16,
  padding: 0,
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 15,
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
    },
  },
  '& .MuiSwitch-switchBase': {
    padding: 2,
    '&.Mui-checked': {
      transform: 'translateX(12px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: `${palette.primary.main}`,
      },
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 12,
    height: 12,
    borderRadius: 6,
    transition: theme.transitions.create(['width'], {
      duration: 200,
    }),
  },
  '& .MuiSwitch-track': {
    borderRadius: 16 / 2,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? palette.grey[400] : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box',
  },
}))

export function ToggleButton(props: Omit<SwitchProps, 'inputRef'>) {
  AntSwitch.defaultProps = { ...props }

  return <AntSwitch />
}
