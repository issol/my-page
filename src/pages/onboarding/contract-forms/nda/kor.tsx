// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** React Imports
import { useState } from 'react'

// ** Third Party Imports
import { EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { Button, Card } from '@mui/material'
import { Box } from '@mui/system'
import styled from 'styled-components'
import Divider from '@mui/material/Divider'

const NdaKor = () => {
  const [value, setValue] = useState(EditorState.createEmpty())
  return (
    <EditorWrapper style={{ margin: '0 70px' }}>
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
              onEditorStateChange={data => setValue(data)}
            />
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
              <Button variant='outlined' color='secondary'>
                Discard
              </Button>
              <Button variant='contained' color='secondary'>
                Upload
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </EditorWrapper>
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
