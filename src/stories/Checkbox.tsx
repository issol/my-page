import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import pal from 'src/@core/theme/palette'
import { PaletteType } from 'src/@core/theme/palette/type'

const palette: PaletteType = pal('light', 'default')

const BpIcon = styled.span(({ theme }) => ({
  borderRadius: 4,
  width: 20,
  height: 20,
  border: '1px solid #aaa',
  backgroundColor: '#fff',
  'input:hover ~ &': {
    backgroundColor: '#ebf1f5',
  },
  'input:disabled ~ &': {
    boxShadow: 'none',
    background: 'rgba(206,217,224,.5)',
  },
}))

const BpCheckedIcon = styled(BpIcon)({
  backgroundColor: `${palette.primary.main}`,
  border: `1px solid ${palette.primary.main}`,
  '&:before': {
    display: 'block',
    width: 20,
    height: 20,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 17 17'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  'input:hover ~ &': {
    border: `1px solid ${palette.primary.main}`,
    backgroundColor: `${palette.primary.main}`,
  },
})
const BpCheckedIconReverse = styled(BpIcon)({
  backgroundColor: `#ffffff`,
  border: `1px solid ${palette.primary.main}`,
  '&:before': {
    display: 'block',
    width: 20,
    height: 20,
    backgroundImage:
      'url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iOSIgdmlld0JveD0iMCAwIDE0IDkiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xLjM3NSAzLjYwMzhMNS45Mzk4MSA3Ljg4ODg5TDEzLjA0MTcgMS4yMjIyMiIgc3Ryb2tlPSIjNjY2Q0ZGIiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '40% 50%',
    content: '""',
  },
  'input:hover ~ &': {
    border: `1px solid ${palette.primary.main}`,
    backgroundColor: `#ffffff`,
  },
})

export function CustomCheckBox(props: CheckboxProps & { reverse?: boolean }) {
  return (
    <Checkbox
      sx={{
        '&:hover': { bgcolor: 'transparent' },
        padding: '0',
      }}
      disableRipple
      color='default'
      checkedIcon={props.reverse ? <BpCheckedIconReverse /> : <BpCheckedIcon />}
      icon={<BpIcon />}
      inputProps={{ 'aria-label': 'Checkbox demo' }}
      {...props}
    />
  )
}
