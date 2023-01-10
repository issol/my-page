// ** MUI Components
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'

interface FooterIllustrationsProp {
  image?: string
  top: number
}

interface ImageProps {
  top: number
}

// Styled Components
const MaskImg = styled('img')<ImageProps>(({ theme, top }) => ({
  zIndex: -1,

  width: '200px',
  position: 'absolute',

  top: `${top}%`,
  right: '20%',
  transform: `translate(-20%, -${top}%)`,
  [theme.breakpoints.down('xl')]: {
    right: '15%',
    transform: `translate(-15%, -${top}%)`,
  },
  [theme.breakpoints.down('lg')]: {
    right: '10%',
    transform: `translate(-10%, -${top}%)`,
  },
  [theme.breakpoints.down(1000)]: {
    right: '5%',
    transform: `translate(-5%, -${top}%)`,
  },
}))

const RightIllustration = (props: FooterIllustrationsProp) => {
  // ** Props
  const { image } = props

  // ** Hook
  const theme = useTheme()

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  const src = image || `/images/pages/forgot-password-complete.png`

  if (!hidden) {
    return <MaskImg alt='mask' src={src} top={props.top} />
  } else {
    return null
  }
}

export default RightIllustration
