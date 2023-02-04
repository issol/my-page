// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card, CardHeader } from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import { DataGrid } from '@mui/x-data-grid'

// ** React Imports
import { Suspense, useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

// ** Third Party Imports
import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import FallbackSpinner from 'src/@core/components/spinner'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
import styled from 'styled-components'
import Icon from 'src/@core/components/icon'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'
import { AuthContext } from 'src/context/AuthContext'
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** fetcher
import { useGetContract } from 'src/queries/contract/contract.query'

// ** types
import {
  ContractParam,
  deleteContract,
  restoreContract,
} from 'src/apis/contract.api'
import { useMutation } from 'react-query'
import { toast } from 'react-hot-toast'

type CellType = {
  row: {
    id: number
    userId: number
    version: string
    writer?: string
    email: string
    updatedAt: string
    content?: any
  }
}

// ** TODO : api완료되면 mutation 파라미터 수정, detail 데이터 스키마 변경에 따라 변경해주기
const ContractDetail = () => {
  const router = useRouter()

  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)

  const { type, language } = router.query as ContractParam
  const [openDetail, setOpenDetail] = useState(false)

  const [mainContent, setMainContent] = useState(EditorState.createEmpty())
  const [historyContent, setHistoryContent] = useState(
    EditorState.createEmpty(),
  )
  const [currentRow, setCurrentRow] = useState({
    id: null,
    userId: null,
    version: '',
    writer: '',
    email: '',
    updatedAt: '',
    content: null,
  })

  const { setModal } = useContext(ModalContext)

  const { data: contract, refetch } = useGetContract({
    type,
    language,
  })

  const deleteMutation = useMutation(() => deleteContract(contract?.id!), {
    onSuccess: () => {
      router.push('/onboarding/contracts')
      return
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })
  const restoreMutation = useMutation(() => restoreContract(contract?.id!), {
    onSuccess: () => {
      refetch()
      return
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })

  useEffect(() => {
    if (contract?.content) {
      const content = convertFromRaw(contract?.content as any)
      const editorState = EditorState.createWithContent(content)
      setMainContent(editorState)
    }
  }, [contract])

  function getTitle() {
    switch (type) {
      case 'nda':
        if (language === 'ko') return '[KOR] NDA'
        else return '[ENG] NDA'
      case 'privacy':
        if (language === 'ko') return '[KOR] Privacy Contract'
        else return '[ENG] Privacy Contract'
      case 'freelancer':
        if (language === 'ko') return '[KOR] Freelancer Contract'
        else return '[ENG] Freelancer Contract'
      default:
        return ''
    }
  }

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
          {FullDateTimezoneHelper(row.updatedAt)}
        </Box>
      ),
    },
  ]

  function onRowClick(e: any) {
    setOpenDetail(true)
    setCurrentRow(e?.row)
    if (e.row?.content) {
      const content = convertFromRaw(e.row.content as any)
      const editorState = EditorState.createWithContent(content)
      setHistoryContent(editorState)
    }
  }

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
              deleteMutation.mutate()
            }}
          >
            Delete
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function onEdit() {
    router.push({
      pathname: `/onboarding/contracts/form/edit`,
      query: { type, language },
    })
  }

  function isEditable() {
    if (contract) {
      return ability.can('update', 'contract') || contract.userId === user?.id!
    }
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
          <Button
            variant='contained'
            onClick={() => {
              setModal(null)
              setOpenDetail(true)
            }}
          >
            Cancel
          </Button>
          <Button
            variant='outlined'
            onClick={() => {
              setModal(null)
              restoreMutation.mutate()
            }}
          >
            Restore
          </Button>
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

  if (!contract) return null

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <StyledEditor style={{ margin: '0 70px' }}>
        <Grid container spacing={6}>
          <Grid container xs={9} mt='24px'>
            <Card sx={{ padding: '30px 20px 20px', width: '100%' }}>
              <Box display='flex' justifyContent='space-between' mb='26px'>
                <Typography variant='h6'>{getTitle()}</Typography>

                <Box display='flex' flexDirection='column' gap='8px'>
                  <Box display='flex' alignItems='center' gap='8px'>
                    <Chip>Writer</Chip>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {contract?.writer}
                    </Typography>
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <Typography variant='body2'>{contract?.email}</Typography>
                  </Box>
                  <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                    {FullDateTimezoneHelper(contract?.updatedAt)}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <ReactDraftWysiwyg editorState={mainContent} readOnly={true} />
            </Card>
            <Card sx={{ marginTop: '24px', width: '100%' }}>
              <CardHeader title='Version history' />
              <Box sx={{ height: 500 }}>
                <DataGrid
                  components={{
                    NoRowsOverlay: () => noHistory(),
                    NoResultsOverlay: () => noHistory(),
                  }}
                  onRowClick={onRowClick}
                  columns={columns}
                  autoHeight
                  rows={contract?.versionHistory?.slice(0, 10)}
                />
              </Box>
            </Card>
          </Grid>
          {isEditable() && (
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
                    onClick={onEdit}
                    startIcon={<Icon icon='mdi:pencil-outline' />}
                  >
                    Edit
                  </Button>
                </Box>
              </Card>
            </Grid>
          )}
        </Grid>
        <Dialog
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          maxWidth='md'
        >
          <StyledEditor maxHeight={true}>
            <Grid
              container
              xs={12}
              sx={{ padding: '50px 60px 50px' }}
              justifyContent='center'
            >
              <Card sx={{ padding: '20px', width: '100%' }}>
                <Box display='flex' justifyContent='space-between' mb='26px'>
                  <Typography variant='h6'>[ENG] NDA</Typography>

                  <Box display='flex' flexDirection='column' gap='8px'>
                    <Box display='flex' alignItems='center' gap='8px'>
                      <Chip>Writer</Chip>
                      <Typography
                        sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                      >
                        {currentRow?.writer}
                      </Typography>
                      <Divider
                        orientation='vertical'
                        variant='middle'
                        flexItem
                      />
                      <Typography variant='body2'>
                        {currentRow?.email}
                      </Typography>
                    </Box>
                    <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                      {FullDateTimezoneHelper(currentRow?.updatedAt)}
                    </Typography>
                  </Box>
                </Box>
                <ReactDraftWysiwyg
                  editorState={historyContent}
                  readOnly={true}
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
                {ability.can('update', 'contract') ||
                  (currentRow?.userId === user?.id! && (
                    <Button variant='contained' onClick={onRestore}>
                      Restore this version
                    </Button>
                  ))}
              </ModalButtonGroup>
            </Grid>
          </StyledEditor>
        </Dialog>
      </StyledEditor>
    </Suspense>
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
