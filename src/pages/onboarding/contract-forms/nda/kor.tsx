// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card } from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'

// ** React Imports
import { useContext, useState } from 'react'

// ** Third Party Imports
import { convertToRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
import styled from 'styled-components'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'

const NdaKor = () => {
  const [value, setValue] = useState(EditorState.createEmpty())
  const [showError, setShowError] = useState(false)
  console.log(value)
  const { setModal } = useContext(ModalContext)

  function onDiscard() {
    setModal(
      <ModalContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src='/images/icons/project-icons/status-alert-error.png'
            width={60}
            height={60}
            alt='role select error'
          />
          <Typography variant='body2'>
            Are you sure to discard this contract?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='contained' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              setModal(null)
              setValue(EditorState.createEmpty())
            }}
          >
            Discard
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function onUpload() {
    setModal(
      <ModalContainer>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <img
            src='/images/icons/project-icons/status-successful.png'
            width={60}
            height={60}
            alt='role select error'
          />
          <Typography variant='body2'>
            Are you sure to upload this contract?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='contained' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              setModal(null)
            }}
          >
            Upload
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function onContentChange(value: EditorState) {
    const contentState = value.getCurrentContent()
    console.log('content state', convertToRaw(contentState))
    setShowError(true)
    setValue(value)
  }
  return (
    <StyledEditor
      style={{ margin: '0 70px' }}
      error={!value.getCurrentContent().getPlainText('\u0001') && showError}
    >
      <Grid container spacing={6} className='match-height'>
        <Grid item xs={9}>
          <Card sx={{ padding: '30px 20px 20px' }}>
            <Box display='flex' justifyContent='space-between' mb='26px'>
              <Typography variant='h6'>[KOR] NDA</Typography>

              <Box display='flex' alignItems='center' gap='8px'>
                <Chip>Writer</Chip>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                  Ellie (Minji) Park
                </Typography>
                <Divider orientation='vertical' variant='middle' flexItem />
                <Typography variant='body2'>ellie@glozinc.com</Typography>
              </Box>
            </Box>
            <Divider />
            <ReactDraftWysiwyg
              editorState={value}
              placeholder='Create a contact form'
              onEditorStateChange={onContentChange}
            />
            {!value.getCurrentContent().getPlainText('\u0001') && showError ? (
              <Typography
                color='error'
                sx={{ fontSize: '0.75rem', marginLeft: '12px' }}
                mt='8px'
              >
                This field is required
              </Typography>
            ) : (
              ''
            )}
          </Card>
        </Grid>
        <Grid item xs={3} className='match-height' sx={{ height: '152px' }}>
          <Card>
            <Box
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Button variant='outlined' color='secondary' onClick={onDiscard}>
                Discard
              </Button>
              <Button
                variant='contained'
                onClick={onUpload}
                disabled={!value.getCurrentContent().getPlainText('\u0001')}
              >
                Upload
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </StyledEditor>
  )
}

export default NdaKor

NdaKor.acl = {
  action: 'read',
  subject: 'onboarding',
}

const Chip = styled.span`
  padding: 3px 8px;
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #ff4d49;
  border-radius: 16px;

  font-weight: 500;
  font-size: 0.813rem;
  color: #ff4d49;
`

const StyledEditor = styled(EditorWrapper)<{ error: boolean }>`
  .rdw-editor-main {
    border: ${({ error }) => (error ? '1px solid #FF4D49 !important' : '')};
  }
`
