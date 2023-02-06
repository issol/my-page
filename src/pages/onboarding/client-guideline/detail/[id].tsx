// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card, CardHeader, Chip, IconButton, List } from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import { DataGrid } from '@mui/x-data-grid'

// ** React Imports
import { Fragment, useContext, useEffect, useState } from 'react'

// ** Third Party Imports
import { convertFromRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import { toast } from 'react-hot-toast'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
import styled from 'styled-components'
import Icon from 'src/@core/components/icon'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { AuthContext } from 'src/context/AuthContext'

// ** helpers
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'

// ** NextJS
import { useRouter } from 'next/router'

// ** fetches
import axios from 'axios'
import { useGetGuideLineDetail } from 'src/queries/client-guideline.query'
import {
  deleteGuideline,
  getGuidelineFileURl,
  restoreGuideline,
} from 'src/apis/client-guideline.api'
import { getUserTokenFromBrowser } from 'src/shared/auth/storage'
import { useMutation } from 'react-query'

type CellType = {
  row: {
    id: number
    userId: number
    title: string
    writer?: string
    email: string
    client: string
    category: string
    serviceType: string
    updatedAt?: string
    files: any
    content: any
  }
}

type FileType = { name: string; size: number }

const ClientGuidelineDetail = () => {
  const router = useRouter()
  const { id } = router.query

  const [mainContent, setMainContent] = useState(EditorState.createEmpty())
  const [historyContent, setHistoryContent] = useState(
    EditorState.createEmpty(),
  )

  const [currentRow, setCurrentRow] = useState({
    id: null,
    userId: null,
    title: '',
    writer: '',
    email: '',
    updatedAt: '',
    client: '',
    category: '',
    serviceType: '',
    files: [],
    content: null,
  })

  const [openDetail, setOpenDetail] = useState(false)

  const { setModal } = useContext(ModalContext)
  const ability = useContext(AbilityContext)
  const { user } = useContext(AuthContext)

  const { data, refetch } = useGetGuideLineDetail(Number(id))
  const restoreMutation = useMutation((id: number) => restoreGuideline(id), {
    onSuccess: data => {
      refetch()
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })
  const deleteMutation = useMutation((id: number) => deleteGuideline(id), {
    onSuccess: () => {
      router.push('/onboarding/client-guideline')
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })

  useEffect(() => {
    if (data?.content) {
      const content = convertFromRaw(data?.content as any)
      const editorState = EditorState.createWithContent(content)
      setMainContent(editorState)
    }
  }, [data])

  const columns = [
    {
      flex: 0.28,
      field: 'title',
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
      field: 'updatedAt',
      headerName: 'Date & Time',
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: CellType) => (
        <Box sx={{ overflowX: 'scroll' }}>
          {FullDateTimezoneHelper(row.updatedAt)}
        </Box>
      ),
    },
  ]

  // ** TODO: file down 구현하기
  function fetchFile(fileName: string) {
    getGuidelineFileURl(user?.id as number, fileName).then(res => {
      axios
        .get(res, {
          headers: {
            Authorization:
              'Bearer ' + typeof window === 'object'
                ? getUserTokenFromBrowser()
                : null,
          },
        })
        .then(res => {
          console.log('upload client guideline file success :', res)
          const url = window.URL.createObjectURL(new Blob([res.data]))
          const link = document.createElement('a')
          link.href = url
          link.setAttribute('download', `${fileName}`)
          document.body.appendChild(link)
          link.click()
        })
        .catch(err =>
          toast.error(
            'Something went wrong while uploading files. Please try again.',
            {
              position: 'bottom-left',
            },
          ),
        )
    })
  }

  function downloadOneFile(name: string) {
    fetchFile(name)
  }

  function downloadAllFiles(files: Array<FileType> | [] | undefined) {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file.name)
    })
  }

  function getFileSize(files: Array<FileType> | [] | undefined) {
    if (!files || !files.length) return 0
    /* @ts-ignore */
    return files.reduce((acc: number, file: FileType) => acc + file.size, 0)
  }

  function fileList(files: Array<FileType> | []) {
    if (!files.length) return null
    return files.map(file => (
      <FileList key={file.name} onClick={() => downloadOneFile(file.name)}>
        <div className='file-details'>
          <div className='file-preview'>
            <Icon
              icon='material-symbols:file-present-outline'
              style={{ color: 'rgba(76, 78, 100, 0.54)' }}
            />
          </div>
          <div>
            <Typography className='file-name'>{file.name}</Typography>
            <Typography className='file-size' variant='body2'>
              {Math.round(file.size / 100) / 10 > 1000
                ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
                : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
            </Typography>
          </div>
        </div>
      </FileList>
    ))
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
              deleteMutation.mutate(Number(id))
            }}
          >
            Delete
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  function onEdit() {
    router.push(`/onboarding/client-guideline/form/${id}`)
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
              restoreMutation.mutate(currentRow?.id!)
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

  function isEditable(id: number) {
    return ability.can('update', 'client_guideline') || id === user?.id!
  }

  function onRowClick(e: any) {
    setOpenDetail(true)
    setCurrentRow(e?.row)
    if (e.row?.content) {
      const content = convertFromRaw(e.row.content as any)
      const editorState = EditorState.createWithContent(content)
      setHistoryContent(editorState)
    }
  }

  return (
    <StyledEditor style={{ margin: '0 70px' }}>
      <Grid container spacing={6}>
        <Grid item md={9} xs={12}>
          <Card sx={{ padding: '30px 20px 20px' }}>
            <Box display='flex' justifyContent='space-between' mb='26px'>
              <Typography
                variant='h6'
                sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Icon
                  icon='mdi:chevron-left'
                  cursor='pointer'
                  onClick={() => router.back()}
                />
                {data?.title}
              </Typography>

              <Box display='flex' flexDirection='column' gap='8px'>
                <Box display='flex' alignItems='center' gap='8px'>
                  <Writer label='Writer' size='small' />
                  <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                    {data?.writer}
                  </Typography>
                  <Divider orientation='vertical' variant='middle' flexItem />
                  <Typography variant='body2'>{data?.email}</Typography>
                </Box>
                <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                  {FullDateTimezoneHelper(data?.updatedAt)}
                </Typography>
              </Box>
            </Box>
            <Grid container xs={12}>
              <Grid item xs={2} mb='10px'>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Client
                </Typography>
              </Grid>
              <Grid item xs={2} mb='10px'>
                <Typography variant='body2'>{data?.client}</Typography>
              </Grid>
            </Grid>
            <Grid container xs={12} mb='10px'>
              <Grid item xs={2}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Category
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='body2'>{data?.category}</Typography>
              </Grid>
            </Grid>
            <Grid container xs={12} mb='10px'>
              <Grid item xs={2}>
                <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                  Service type
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant='body2'>{data?.serviceType}</Typography>
              </Grid>
            </Grid>
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
                sx={{
                  '& .MuiDataGrid-row': { cursor: 'pointer' },
                }}
                columns={columns}
                autoHeight
                onRowClick={onRowClick}
                rows={data?.versionHistory?.slice(0, 10) || []}
              />
            </Box>
          </Card>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card style={{ height: '565px', overflow: 'scroll' }}>
            <Box
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <Box display='flex' justifyContent='space-between'>
                <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                  Attached file
                </Typography>
                <Typography variant='body2'>
                  {Math.round(getFileSize(data?.files) / 100) / 10 > 1000
                    ? `${(
                        Math.round(getFileSize(data?.files) / 100) / 10000
                      ).toFixed(1)} mb`
                    : `${(
                        Math.round(getFileSize(data?.files) / 100) / 10
                      ).toFixed(1)} kb`}
                  /50mb
                </Typography>
              </Box>
              <Button
                variant='outlined'
                startIcon={<Icon icon='mdi:download' />}
                onClick={() => downloadAllFiles(data?.files)}
              >
                Download all
              </Button>
              {data?.files?.length ? (
                <Fragment>
                  <List>{fileList(data?.files)}</List>
                </Fragment>
              ) : null}
            </Box>
          </Card>
          {isEditable(Number(id)) && (
            <Card style={{ marginTop: '24px' }}>
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
                  onClick={onEdit}
                >
                  Edit
                </Button>
              </Box>
            </Card>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth='lg'
      >
        <StyledEditor maxHeight={true}>
          <Grid
            container
            sx={{ padding: '50px 60px 50px' }}
            justifyContent='center'
          >
            <Grid container spacing={6}>
              <Grid item xs={12} md={8}>
                <Card sx={{ padding: '20px', width: '100%' }}>
                  <Box display='flex' justifyContent='space-between' mb='26px'>
                    <Typography variant='h6'>{currentRow?.title}</Typography>

                    <Box display='flex' flexDirection='column' gap='8px'>
                      <Box display='flex' alignItems='center' gap='8px'>
                        <Writer label='Writer' size='small' />
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
                      <Typography
                        variant='body2'
                        sx={{ alignSelf: 'flex-end' }}
                      >
                        {FullDateTimezoneHelper(new Date())}
                      </Typography>
                    </Box>
                  </Box>
                  <Grid container xs={12}>
                    <Grid item xs={2} mb='10px'>
                      <Typography
                        sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                      >
                        Client
                      </Typography>
                    </Grid>
                    <Grid item xs={2} mb='10px'>
                      <Typography variant='body2'>
                        {currentRow?.client}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container xs={12} mb='10px'>
                    <Grid item xs={2}>
                      <Typography
                        sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                      >
                        Category
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant='body2'>
                        {currentRow?.category}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container xs={12} mb='10px'>
                    <Grid item xs={2}>
                      <Typography
                        sx={{ fontWeight: 600, fontSize: '0.875rem' }}
                      >
                        Service type
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography variant='body2'>
                        {currentRow?.serviceType}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Divider />
                  <ReactDraftWysiwyg
                    editorState={historyContent}
                    readOnly={true}
                  />
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <Card style={{ height: '100%', overflow: 'scroll' }}>
                  <Box
                    sx={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <Box display='flex' justifyContent='space-between'>
                      <Typography sx={{ fontWeight: 600, fontSize: '14px' }}>
                        Attached file
                      </Typography>
                      <Typography variant='body2'>
                        {Math.round(getFileSize(currentRow?.files) / 100) / 10 >
                        1000
                          ? `${(
                              Math.round(getFileSize(currentRow?.files) / 100) /
                              10000
                            ).toFixed(1)} mb`
                          : `${(
                              Math.round(getFileSize(currentRow?.files) / 100) /
                              10
                            ).toFixed(1)} kb`}
                        /50mb
                      </Typography>
                    </Box>
                    <Button
                      variant='outlined'
                      startIcon={<Icon icon='mdi:download' />}
                      onClick={() => downloadAllFiles(currentRow?.files)}
                    >
                      Download all
                    </Button>
                    {currentRow?.files?.length ? (
                      <Fragment>
                        <List>{fileList(currentRow?.files)}</List>
                      </Fragment>
                    ) : null}
                  </Box>
                </Card>
              </Grid>
            </Grid>
            <ModalButtonGroup style={{ marginTop: '24px' }}>
              <Button
                onClick={() => setOpenDetail(false)}
                variant='outlined'
                color='secondary'
                sx={{ width: '226px' }}
              >
                Close
              </Button>
              {isEditable(Number(currentRow?.userId!)) && (
                <Button
                  variant='contained'
                  onClick={onRestore}
                  sx={{ width: '226px' }}
                >
                  Restore this version
                </Button>
              )}
            </ModalButtonGroup>
          </Grid>
        </StyledEditor>
      </Dialog>
    </StyledEditor>
  )
}

export default ClientGuidelineDetail

ClientGuidelineDetail.acl = {
  action: 'read',
  subject: 'onboarding',
}

const Writer = styled(Chip)`
  background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.88),
      rgba(255, 255, 255, 0.88)
    ),
    #ff4d49;
  font-weight: 500;
  color: #ff4d49;
`

const StyledEditor = styled(EditorWrapper)<{
  error?: boolean
  maxHeight?: boolean
}>`
  .rdw-editor-main {
    border: none !important;
    max-height: ${({ maxHeight }) => (maxHeight ? `300px` : '800px')};
  }
  .rdw-editor-toolbar {
    display: none;
  }
`
const FileList = styled.div`
  display: flex;
  cursor: pointer;
  margin-bottom: 8px;
  justify-content: space-between;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(76, 78, 100, 0.22);
  background: #f9f8f9;
  .file-details {
    display: flex;
    align-items: center;
  }
  .file-preview {
    margin-right: 8px;
    display: flex;
  }

  img {
    width: 38px;
    height: 38px;

    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid rgba(93, 89, 98, 0.14);
  }

  .file-name {
    font-weight: 600;
  }
`
