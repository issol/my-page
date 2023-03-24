// ** MUI Import
import { useTheme } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import styled, { keyframes } from 'styled-components'

const OverlaySpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  // ** Hook
  const theme = useTheme()

  return (
    <Overlay>
      <LoadingContainer>
        <LoadingWrapper>
          <div className='desktop'>
            <CircularProgress disableShrink sx={{ mt: 6 }} />
          </div>
        </LoadingWrapper>
      </LoadingContainer>
    </Overlay>
  )
}

const LoadingImageOpacity = keyframes`
  0% {
    opacity: 1;
  }
  20% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  z-index: 10000;
`

const LoadingContainer = styled.div`
  width: 100%;
`

const LoadingWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`

const LoadingImage = styled.div`
  width: 400px;
  height: auto;

  -moz-animation: ${LoadingImageOpacity} 2s linear 0s infinite normal;
  -o-animation: ${LoadingImageOpacity} 2s linear 0s infinite normal;
  -webkit-animation: ${LoadingImageOpacity} 2s linear 0s infinite normal;
  animation: ${LoadingImageOpacity} 2s linear 0s infinite normal;
  opacity: 0;
  .mobile {
    display: none;
  }
`

export default OverlaySpinner
