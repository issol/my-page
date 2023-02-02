// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card, CardHeader } from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'

// ** React Imports
import { useContext, useState } from 'react'

// ** Third Party Imports
import { convertFromRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
import styled from 'styled-components'
import Icon from 'src/@core/components/icon'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'
import { DataGrid } from '@mui/x-data-grid'

const text = {
  blocks: [
    {
      key: 'd9so6',
      text: '1. Agreement ____________________________ (also known as “contractor”) will provide Glocalize Inc. US and Glocalize Inc. Korea (“Glocalize” or “Glocalize Inc.”) with as to the specifications detailed in the terms and conditions below.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'b75mm',
      text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'b751mm',
      text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'b76mm',
      text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'b76mm1',
      text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
    {
      key: 'b76mm2',
      text: 'DUTIES AND RESPONSIBILITIES OF CONTRACTOR: Contractor shall provide to Glocalize Inc. localization services on an as needed basis at times mutually agreed upon by the parties.',
      type: 'unstyled',
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
  entityMap: {},
}

type CellType = {
  row: {
    id: number
    version: string
    email: string
    date: string
  }
}

const mock = [
  { id: 0, version: 'Ver.2', email: 'chloe@glozinc.com', date: Date() },
]
const ContractDetail = () => {
  const [value, setValue] = useState(EditorState.createEmpty())
  const [showError, setShowError] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)

  const contentState = convertFromRaw(text)
  const editorState = EditorState.createWithContent(contentState)
  const { setModal } = useContext(ModalContext)

  const columns = [
    {
      flex: 0.28,
      field: 'version',
      minWidth: 80,
      headerName: 'Version',
      renderHeader: () => <Box>Version</Box>,
    },
    {
      flex: 0.3,
      minWidth: 130,
      field: 'email',
      headerName: 'Email',
      renderHeader: () => <Box>Email</Box>,
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{row.email}</Typography>
      ),
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'date',
      headerName: 'Date & Time',
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>
          {FullDateTimezoneHelper(row.date)}
        </Box>
      ),
    },
  ]

  function onDelete() {
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
            Are you sure to delete this contract?
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
            Delete
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function onRestore() {
    setOpenDetail(false)
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
            Are you sure to restore this version?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='contained' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button variant='outlined'>Restore</Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function noHistory() {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant='subtitle1'>There are no history</Typography>
      </Box>
    )
  }

  return (
    <StyledEditor
      style={{ margin: '0 70px' }}
      error={!value.getCurrentContent().getPlainText('\u0001') && showError}
    >
      <Grid container spacing={6}>
        <Grid container xs={9} mt='24px'>
          <Card sx={{ padding: '30px 20px 20px' }}>
            <Box display='flex' justifyContent='space-between' mb='26px'>
              <Typography variant='h6'>[ENG] NDA</Typography>

              <Box display='flex' flexDirection='column' gap='8px'>
                <Box display='flex' alignItems='center' gap='8px'>
                  <Chip>Writer</Chip>
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    Ellie (Minji) Park
                  </Typography>
                  <Divider orientation='vertical' variant='middle' flexItem />
                  <Typography variant='body2'>ellie@glozinc.com</Typography>
                </Box>
                <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                  {FullDateTimezoneHelper(new Date())}
                </Typography>
              </Box>
            </Box>
            <Divider />
            <ReactDraftWysiwyg
              editorState={editorState}
              readOnly={true}
              onEditorStateChange={data => {
                setShowError(true)
                setValue(data)
              }}
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
          <Card sx={{ marginTop: '24px', width: '100%' }}>
            <CardHeader title='Version history' />
            <Box sx={{ height: 500 }}>
              <DataGrid
                components={{
                  NoRowsOverlay: () => noHistory(),
                  NoResultsOverlay: () => noHistory(),
                }}
                onRowClick={() => setOpenDetail(true)}
                columns={columns}
                autoHeight
                rows={mock.slice(0, 10)}
              />
            </Box>
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
              <Button
                variant='outlined'
                color='secondary'
                startIcon={<Icon icon='mdi:delete-outline' />}
                onClick={onDelete}
              >
                Delete
              </Button>
              <Button
                variant='contained'
                startIcon={<Icon icon='mdi:pencil-outline' />}
                // disabled={!value.getCurrentContent().getPlainText('\u0001')}
              >
                Edit
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth='md'
      >
        <StyledEditor maxHeight={true}>
          <Box sx={{ padding: '50px 60px 50px' }}>
            <Card sx={{ padding: '20px' }}>
              <Box display='flex' justifyContent='space-between' mb='26px'>
                <Typography variant='h6'>[ENG] NDA</Typography>

                <Box display='flex' flexDirection='column' gap='8px'>
                  <Box display='flex' alignItems='center' gap='8px'>
                    <Chip>Writer</Chip>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      Ellie (Minji) Park
                    </Typography>
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <Typography variant='body2'>ellie@glozinc.com</Typography>
                  </Box>
                  <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                    {FullDateTimezoneHelper(new Date())}
                  </Typography>
                </Box>
              </Box>
              <ReactDraftWysiwyg
                editorState={editorState}
                readOnly={true}
                onEditorStateChange={data => {
                  setShowError(true)
                  setValue(data)
                }}
              />
            </Card>
            <ModalButtonGroup style={{ marginTop: '24px' }}>
              <Button
                onClick={() => setOpenDetail(false)}
                variant='outlined'
                color='secondary'
              >
                Close
              </Button>
              <Button variant='contained' onClick={onRestore}>
                Restore this version
              </Button>
            </ModalButtonGroup>
          </Box>
        </StyledEditor>
      </Dialog>
    </StyledEditor>
  )
}

export default ContractDetail

ContractDetail.acl = {
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

const StyledEditor = styled(EditorWrapper)<{
  error?: boolean
  maxHeight?: boolean
}>`
  .rdw-editor-main {
    border: ${({ error }) => (error ? '1px solid #FF4D49 !important' : '')};
    max-height: ${({ maxHeight }) => (maxHeight ? `300px` : '800px')};
  }
  .rdw-editor-toolbar {
    display: none;
  }
`
