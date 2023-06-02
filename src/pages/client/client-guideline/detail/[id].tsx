// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card, CardHeader, List } from '@mui/material'
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
import { StyledViewer } from 'src/@core/components/editor/customEditor'
import { toast } from 'react-hot-toast'
import FileItem from 'src/@core/components/fileItem'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import EmptyPost from 'src/@core/components/page/empty-post'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
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
  getGuidelineDownloadPreSignedUrl,
  restoreGuideline,
} from 'src/apis/client-guideline.api'
import { getDownloadUrlforCommon } from 'src/apis/common.api'
import { getUserTokenFromBrowser } from 'src/shared/auth/storage'
import { useMutation } from 'react-query'

// ** helpers
import { getFilePath } from 'src/shared/transformer/filePath.transformer'

// ** types
import { FileType } from 'src/types/common/file.type'
import FallbackSpinner from '@src/@core/components/spinner'
import logger from '@src/@core/utils/logger'
import { client_guideline } from '@src/shared/const/permission-class'
import { S3FileType } from 'src/shared/const/signedURLFileType'

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

const ClientGuidelineDetail = () => {
  const router = useRouter()
  const id = Number(router.query?.id)

  const [mainContent, setMainContent] = useState(EditorState.createEmpty())
  const [historyContent, setHistoryContent] = useState(
    EditorState.createEmpty(),
  )
  const [pageSize, setPageSize] = useState(5)
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

  const { data, refetch, isError } = useGetGuideLineDetail(id)

  useEffect(() => {
    if (!Number.isNaN(id)) {
      refetch()
    }
  }, [id])

  const { currentVersion } = data || {
    id: null,
    userId: null,
    title: '',
    writer: '',
    email: '',
    client: '',
    category: '',
    serviceType: null,
    updatedAt: '',
    content: null,
    files: [],
  }

  const versionHistory = data?.versionHistory || []

  const restoreMutation = useMutation(
    (info: { id: number; writer: string; email: string }) =>
      restoreGuideline(info.id, info.writer, info.email),
    {
      onSuccess: data => {
        refetch()
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )
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
    if (currentVersion?.content) {
      const content = convertFromRaw(currentVersion?.content as any)
      const editorState = EditorState.createWithContent(content)
      setMainContent(editorState)
    }
  }, [currentVersion])

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
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ overflowX: 'scroll' }}>
            {FullDateTimezoneHelper(row.updatedAt, user?.timezone!)}
          </Box>
        )
      },
    },
  ]

  function fetchFile(fileName: string) {
    const path = getFilePath(
      [
        currentVersion?.client!,
        currentVersion?.category!,
        currentVersion?.serviceType!,
        `V${currentVersion?.version}`,
      ],
      fileName,
    )

    getDownloadUrlforCommon(S3FileType.CLIENT_GUIDELINE, path)
    .then(res => {
      fetch(res.url, { method: 'GET' })
      .then(res => {
        return res.blob()
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${fileName}`
        document.body.appendChild(a)
        a.click()
        setTimeout((_: any) => {
          window.URL.revokeObjectURL(url)
        }, 60000)
        a.remove()
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
      <FileItem key={file.name} file={file} onClick={downloadOneFile} />
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
              deleteMutation.mutate(id)
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
              restoreMutation.mutate({
                id: currentRow?.id!,
                writer: currentRow?.writer!,
                email: currentRow?.email!,
              })
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
        <Typography variant='subtitle1'>There is no version history</Typography>
      </Box>
    )
  }

  //author can edit / delete / restore the post
  //master can edit/delete/restore the guideline
  function isAuthor(can: 'update' | 'delete', id: number) {
    const writer = new client_guideline(id)
    return ability.can(can, writer)
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
    <>
      {!data ? (
        <FallbackSpinner />
      ) : isError ? (
        <EmptyPost />
      ) : (
        <StyledViewer style={{ margin: '0 70px' }}>
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
                    {currentVersion?.title}
                  </Typography>

                  <Box display='flex' flexDirection='column' gap='8px'>
                    <Box display='flex' alignItems='center' gap='8px'>
                      <CustomChip
                        label='Writer'
                        skin='light'
                        color='error'
                        size='small'
                      />
                      <Typography
                        sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                        color={`${
                          user?.id === currentVersion?.userId ? 'primary' : ''
                        }`}
                      >
                        {currentVersion?.writer}
                      </Typography>
                      <Divider
                        orientation='vertical'
                        variant='middle'
                        flexItem
                      />
                      <Typography variant='body2'>
                        {currentVersion?.email}
                      </Typography>
                    </Box>
                    <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                      {FullDateTimezoneHelper(
                        currentVersion?.updatedAt,
                        user?.timezone!,
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Grid container>
                  <Grid item xs={2} mb='10px'>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Client
                    </Typography>
                  </Grid>
                  <Grid item xs={2} mb='10px'>
                    <Typography variant='body2'>
                      {currentVersion?.client}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container mb='10px'>
                  <Grid item xs={2}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Category
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='body2'>
                      {currentVersion?.category}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container mb='10px'>
                  <Grid item xs={2}>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
                      Service type
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant='body2'>
                      {currentVersion?.serviceType}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider />
                <ReactDraftWysiwyg editorState={mainContent} readOnly={true} />
              </Card>

              <Card sx={{ marginTop: '24px', width: '100%' }}>
                <CardHeader title='Version history' />
                <Box sx={{ height: '100%' }}>
                  <DataGrid
                    components={{
                      NoRowsOverlay: () => noHistory(),
                      NoResultsOverlay: () => noHistory(),
                    }}
                    sx={{
                      '& .MuiDataGrid-row': { cursor: 'pointer' },
                    }}
                    autoHeight
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={setPageSize}
                    rowsPerPageOptions={[5, 15, 30]}
                    rowCount={versionHistory?.length || 0}
                    rows={versionHistory || []}
                    onRowClick={onRowClick}
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
                      {Math.round(getFileSize(currentVersion?.files) / 100) /
                        10 >
                      1000
                        ? `${(
                            Math.round(
                              getFileSize(currentVersion?.files) / 100,
                            ) / 10000
                          ).toFixed(1)} mb`
                        : `${(
                            Math.round(
                              getFileSize(currentVersion?.files) / 100,
                            ) / 10
                          ).toFixed(1)} kb`}
                      /50mb
                    </Typography>
                  </Box>
                  <Button
                    variant='outlined'
                    startIcon={<Icon icon='mdi:download' />}
                    onClick={() => downloadAllFiles(currentVersion?.files)}
                  >
                    Download all
                  </Button>
                  {currentVersion?.files?.length ? (
                    <Fragment>
                      <List>{fileList(currentVersion?.files)}</List>
                    </Fragment>
                  ) : null}
                </Box>
              </Card>
              <Card style={{ marginTop: '24px' }}>
                {
                  isAuthor('delete', currentVersion?.userId!) 
                  || isAuthor('update', currentVersion?.userId!) 
                  ? (<Box
                  sx={{
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {isAuthor('delete', currentVersion?.userId!) ? (
                    <Button
                      variant='outlined'
                      color='secondary'
                      startIcon={<Icon icon='mdi:delete-outline' />}
                      onClick={onDelete}
                    >
                      Delete
                    </Button>
                  ) : (
                    ''
                  )}
                  {isAuthor('update', currentVersion?.userId!) ? (
                    <Button
                      variant='contained'
                      startIcon={<Icon icon='mdi:pencil-outline' />}
                      onClick={onEdit}
                    >
                      Edit
                    </Button>
                  ) : (
                    ''
                  )}
                </Box>) : null}
              </Card>
            </Grid>
          </Grid>
          <Dialog
            open={openDetail}
            onClose={() => setOpenDetail(false)}
            maxWidth='lg'
          >
            <StyledViewer maxHeight={true}>
              <Grid
                container
                sx={{ padding: '50px 60px 50px' }}
                justifyContent='center'
              >
                <Grid container spacing={6}>
                  <Grid item xs={12} md={8}>
                    <Card sx={{ padding: '20px', width: '100%' }}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        mb='26px'
                      >
                        <Typography variant='h6'>
                          {currentRow?.title}
                        </Typography>

                        <Box display='flex' flexDirection='column' gap='8px'>
                          <Box display='flex' alignItems='center' gap='8px'>
                            <CustomChip
                              label='Writer'
                              skin='light'
                              color='error'
                              size='small'
                            />
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
                            {FullDateTimezoneHelper(
                              new Date(),
                              user?.timezone!,
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      <Grid container>
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
                      <Grid container mb='10px'>
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
                      <Grid container mb='10px'>
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
                          <Typography
                            sx={{ fontWeight: 600, fontSize: '14px' }}
                          >
                            Attached file
                          </Typography>
                          <Typography variant='body2'>
                            {Math.round(getFileSize(currentRow?.files) / 100) /
                              10 >
                            1000
                              ? `${(
                                  Math.round(
                                    getFileSize(currentRow?.files) / 100,
                                  ) / 10000
                                ).toFixed(1)} mb`
                              : `${(
                                  Math.round(
                                    getFileSize(currentRow?.files) / 100,
                                  ) / 10
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
                  {isAuthor('update', Number(currentRow?.userId!)) ? (
                    <Button
                      variant='contained'
                      onClick={onRestore}
                      sx={{ width: '226px' }}
                    >
                      Restore this version
                    </Button>
                  ) : (
                    ''
                  )}
                </ModalButtonGroup>
              </Grid>
            </StyledViewer>
          </Dialog>
        </StyledViewer>
      )}
    </>
  )
}

export default ClientGuidelineDetail

ClientGuidelineDetail.acl = {
  action: 'read',
  subject: 'client_guideline',
}
