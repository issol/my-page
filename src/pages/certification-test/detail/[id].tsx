import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import { useGetTestDetail } from 'src/queries/certification-test/certification-test-detail.query'
import IconButton from '@mui/material/IconButton'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useContext, useEffect, useState, Fragment } from 'react'
import { AuthContext } from 'src/context/AuthContext'
import Divider from '@mui/material/Divider'
import { Writer } from '@src/@core/components/chip'
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'
import { convertFromRaw, EditorState } from 'draft-js'
import _ from 'lodash'
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'
import { EditorWrapper } from 'src/@core/styles/libs/react-draft-wysiwyg'
import styled from 'styled-components'
import CardHeader from '@mui/material/CardHeader'
import { DataGrid } from '@mui/x-data-grid/DataGrid'
import { CurrentTestType } from 'src/types/certification-test/detail'
import Dialog from '@mui/material/Dialog'
import Icon from 'src/@core/components/icon'
import { FileType } from '@src/apis/client-guideline.api'
import List from '@mui/material/List'
import toast from 'react-hot-toast'
import {
  deleteTest,
  getTestDownloadPreSignedUrl,
} from 'src/apis/certification-test.api'
import { getFilePath } from 'src/shared/transformer/filePath.transformer'
import axios from 'axios'
import { getUserTokenFromBrowser } from 'src/shared/auth/storage'
import { v4 as uuidv4 } from 'uuid'
import { GridColumns } from '@mui/x-data-grid'
import { AbilityContext } from 'src/layouts/components/acl/Can'

import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
import { useMutation } from 'react-query'
import { ModalContext } from 'src/context/ModalContext'

type CellType = {
  row: CurrentTestType
}

const CertificationTestDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)
  const { setModal } = useContext(ModalContext)

  const { data } = useGetTestDetail(Number(id!), true)
  const [pageSize, setPageSize] = useState(5)
  const [mainContent, setMainContent] = useState(EditorState.createEmpty())
  const [openDetail, setOpenDetail] = useState(false)
  const [historyContent, setHistoryContent] = useState(
    EditorState.createEmpty(),
  )

  const [currentRow, setCurrentRow] = useState({
    id: null,
    userId: null,
    version: null,
    writer: '',
    email: '',
    testType: '',
    jobType: '',
    role: '',
    source: '',
    target: '',
    googleFormLink: '',
    updatedAt: '',
    content: null,
    files: [],
  })

  const { currentVersion } = data || {
    id: null,
    userId: null,
    version: null,
    writer: '',
    email: '',
    testType: '',
    jobType: '',
    role: '',
    source: '',
    target: '',
    googleFormLink: '',
    updatedAt: '',
    content: null,
    files: [],
  }

  const versionHistory = data?.versionHistory || []

  const deleteMutation = useMutation((id: number) => deleteTest(id), {
    onSuccess: () => {
      router.push('/certification-test')
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })

  const columns: GridColumns<CurrentTestType> = [
    {
      flex: 0.28,
      field: 'version',
      minWidth: 80,
      headerName: 'Version',
      renderHeader: () => <Box>Version</Box>,
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderCell: ({ row }: CellType) => <Box>Ver.{row.version}</Box>,
    },
    {
      flex: 0.3,
      minWidth: 130,
      field: 'email',
      headerName: 'Email',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => <Box>Account</Box>,
      renderCell: ({ row }: CellType) => (
        <Typography variant='body2'>{row.email}</Typography>
      ),
    },
    {
      flex: 0.23,
      minWidth: 120,
      field: 'updatedAt',
      headerName: 'Date & Time',
      disableColumnMenu: true,
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: CellType) => {
        return <Box>{FullDateTimezoneHelper(row.updatedAt)}</Box>
      },
    },
  ]

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

  function getFileSize(files: Array<FileType> | [] | undefined) {
    if (!files || !files.length) return 0
    /* @ts-ignore */
    return files.reduce((acc: number, file: FileType) => acc + file.size, 0)
  }

  function fileList(files: Array<FileType> | []) {
    if (!files.length) return null
    return files.map(file => (
      <FileList key={uuidv4()} onClick={() => downloadOneFile(file.name)}>
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

  function fetchFile(fileName: string) {
    const language =
      currentVersion?.testType === 'basic'
        ? `${currentVersion?.target}`
        : `${currentVersion?.source}-${currentVersion?.target}`
    const path = getFilePath(
      [
        'testPaper',
        currentVersion?.testType === 'Basic test' ? 'basic' : 'skill',
        currentVersion?.jobType!,
        currentVersion?.role!,
        language,
        `V${currentVersion?.version!}`,
      ],
      fileName,
    )

    getTestDownloadPreSignedUrl([path]).then(res => {
      axios
        .get(res[0], {
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
            Are you sure you want to delete this test?
          </Typography>
        </Box>
        <ModalButtonGroup>
          <Button variant='outlined' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              setModal(null)
              deleteMutation.mutate(Number(id!))
            }}
          >
            Delete
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  useEffect(() => {
    if (currentVersion?.content) {
      const content = convertFromRaw(currentVersion?.content as any)
      const editorState = EditorState.createWithContent(content)
      setMainContent(editorState)
    }
  }, [currentVersion])

  return (
    <Box>
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        maxWidth='xl'
      >
        <Box
          sx={{
            padding: '20px',
            gap: 10,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Grid xs={9.55} container>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  width: '100%',
                }}
              >
                <Card sx={{ padding: '20px', width: '100%' }}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}
                  >
                    <Grid container xs={12}>
                      <Grid item xs={2}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '20px',
                          }}
                        >
                          Test type
                        </Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <Typography variant='subtitle2'>
                          {currentRow.testType === 'basic'
                            ? 'Basic test'
                            : 'Skill test'}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container xs={12}>
                      <Grid item xs={2}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '20px',
                          }}
                        >
                          Language pair
                        </Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <Typography variant='subtitle2'>
                          {currentRow.testType === 'basic' ? (
                            `${currentRow.target!.toUpperCase()}`
                          ) : (
                            <>
                              {currentRow.source!.toUpperCase()}
                              &nbsp;&rarr;&nbsp;
                              {currentRow.target!.toUpperCase()}
                            </>
                          )}
                        </Typography>
                      </Grid>
                    </Grid>
                    {currentRow.testType === 'skill' ? (
                      <Grid container xs={12}>
                        <Grid item xs={2}>
                          <Typography
                            sx={{
                              fontWeight: 600,
                              fontSize: '14px',
                              lineHeight: '20px',
                            }}
                          >
                            Job type / Role
                          </Typography>
                        </Grid>
                        <Grid item xs={10}>
                          <Typography variant='subtitle2'>
                            {currentRow.jobType} / {currentRow.role}
                          </Typography>
                        </Grid>
                      </Grid>
                    ) : null}

                    <Grid container xs={12}>
                      <Grid item xs={2}>
                        <Typography
                          sx={{
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '20px',
                          }}
                        >
                          Google form link
                        </Typography>
                      </Grid>
                      <Grid item xs={10}>
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant='subtitle2'>
                            {currentRow.googleFormLink}
                          </Typography>
                          <IconButton
                            sx={{ width: 24, height: 24 }}
                            onClick={() =>
                              currentRow.googleFormLink !== '' &&
                              window.open(currentRow.googleFormLink, '_blank')
                            }
                          >
                            <OpenInNewIcon />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </Card>

                <Card sx={{ padding: '20px' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box
                      sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                      <Typography variant='h6'>Test guideline</Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',

                          alignItems: 'center',
                        }}
                      >
                        <Writer label='Writer' size='small' />
                        {user?.username === currentRow.writer ? (
                          <Typography
                            sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                            color='primary'
                          >
                            {currentRow.writer}
                          </Typography>
                        ) : (
                          <Typography
                            sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                          >
                            {currentRow.writer}
                          </Typography>
                        )}

                        <Divider
                          orientation='vertical'
                          variant='middle'
                          flexItem
                        />
                        <Typography variant='body2'>
                          {currentRow.email}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mb: '20px',
                      }}
                    >
                      <Typography variant='body2'>
                        {FullDateTimezoneHelper(currentRow.updatedAt)}
                      </Typography>
                    </Box>
                    <Divider />
                    <StyledEditor minHeight={17}>
                      <ReactDraftWysiwyg
                        editorState={historyContent}
                        readOnly={true}
                      />
                    </StyledEditor>
                  </Box>
                </Card>
              </Box>
            </Grid>
            <Grid container xs={2.45}>
              <Box sx={{ width: '100%' }}>
                <Card>
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
                        Test guideline file
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
                      fullWidth
                      startIcon={<Icon icon='mdi:download' />}
                      onClick={() => downloadAllFiles(currentRow?.files)}
                    >
                      Download all
                    </Button>
                  </Box>
                  <Box
                    sx={{
                      padding: '0 20px',
                      overflow: 'scroll',

                      height: '454px',

                      '&::-webkit-scrollbar': { display: 'none' },
                    }}
                  >
                    {currentVersion?.files?.length ? (
                      <Fragment>
                        <List>{fileList(currentVersion?.files)}</List>
                      </Fragment>
                    ) : null}
                  </Box>
                </Card>
              </Box>
            </Grid>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              variant='outlined'
              color='secondary'
              size='medium'
              sx={{ width: 185 }}
              onClick={() => setOpenDetail(false)}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Dialog>
      <Box sx={{ display: 'flex', gap: 4 }}>
        <Grid xs={9.55} container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              width: '100%',
            }}
          >
            <Card sx={{ padding: '20px', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Grid container xs={12}>
                  <Grid item xs={2}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '20px',
                      }}
                    >
                      Test type
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant='subtitle2'>
                      {currentVersion?.testType === 'basic'
                        ? 'Basic test'
                        : 'Skill test'}
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container xs={12}>
                  <Grid item xs={2}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '20px',
                      }}
                    >
                      Language pair
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Typography variant='subtitle2'>
                      {currentVersion?.testType === 'basic' ? (
                        `${currentVersion?.target.toUpperCase()}`
                      ) : (
                        <>
                          {currentVersion?.source.toUpperCase()}
                          &nbsp;&rarr;&nbsp;
                          {currentVersion?.target.toUpperCase()}
                        </>
                      )}
                    </Typography>
                  </Grid>
                </Grid>
                {currentVersion?.testType === 'skill' ? (
                  <Grid container xs={12}>
                    <Grid item xs={2}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: '14px',
                          lineHeight: '20px',
                        }}
                      >
                        Job type / Role
                      </Typography>
                    </Grid>
                    <Grid item xs={10}>
                      <Typography variant='subtitle2'>
                        {currentVersion?.jobType} / {currentVersion?.role}
                      </Typography>
                    </Grid>
                  </Grid>
                ) : null}

                <Grid container xs={12}>
                  <Grid item xs={2}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: '14px',
                        lineHeight: '20px',
                      }}
                    >
                      Google form link
                    </Typography>
                  </Grid>
                  <Grid item xs={10}>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant='subtitle2'>
                        {currentVersion?.googleFormLink}
                      </Typography>
                      <IconButton
                        sx={{ width: 24, height: 24 }}
                        onClick={() =>
                          currentVersion?.googleFormLink !== '' &&
                          window.open(currentVersion?.googleFormLink, '_blank')
                        }
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Card>

            <Card sx={{ padding: '20px' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant='h6'>Test guideline</Typography>
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    <Writer label='Writer' size='small' />
                    {user?.username === currentVersion?.writer ? (
                      <Typography
                        sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                        color='primary'
                      >
                        {currentVersion?.writer}
                      </Typography>
                    ) : (
                      <Typography
                        sx={{ fontWeight: 500, fontSize: '0.875rem' }}
                      >
                        {currentVersion?.writer}
                      </Typography>
                    )}
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <Typography variant='body2'>{user?.email}</Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    mb: '20px',
                  }}
                >
                  <Typography variant='body2'>
                    {FullDateTimezoneHelper(currentVersion?.updatedAt)}
                  </Typography>
                </Box>
                <Divider />
                <StyledEditor>
                  <ReactDraftWysiwyg
                    editorState={mainContent}
                    readOnly={true}
                  />
                </StyledEditor>
              </Box>
            </Card>
            <Card>
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
                  disableSelectionOnClick
                  autoHeight
                  columns={columns}
                  pageSize={pageSize}
                  onPageSizeChange={setPageSize}
                  rowsPerPageOptions={[5, 15, 30]}
                  onCellClick={params => {
                    setOpenDetail(true)
                    setCurrentRow(params.row)
                    console.log(params.row)

                    if (params.row?.content) {
                      const content = convertFromRaw(params.row.content as any)
                      const editorState = EditorState.createWithContent(content)
                      setHistoryContent(editorState)
                    }
                  }}
                  rowCount={versionHistory?.length || 0}
                  rows={versionHistory || []}
                  // onRowClick={onRowClick}
                />
              </Box>
            </Card>
          </Box>
        </Grid>
        <Grid container xs={2.45}>
          <Box sx={{ width: '100%' }}>
            <Card>
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
                    Test guideline file
                  </Typography>
                  <Typography variant='body2'>
                    {Math.round(getFileSize(currentVersion?.files) / 100) / 10 >
                    1000
                      ? `${(
                          Math.round(getFileSize(currentVersion?.files) / 100) /
                          10000
                        ).toFixed(1)} mb`
                      : `${(
                          Math.round(getFileSize(currentVersion?.files) / 100) /
                          10
                        ).toFixed(1)} kb`}
                    /50mb
                  </Typography>
                </Box>

                <Button
                  variant='outlined'
                  fullWidth
                  startIcon={<Icon icon='mdi:download' />}
                  onClick={() => downloadAllFiles(currentVersion?.files)}
                >
                  Download all
                </Button>
              </Box>
              <Box
                sx={{
                  padding: '0 20px',
                  overflow: 'scroll',

                  height: '454px',

                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >
                {currentVersion?.files?.length ? (
                  <Fragment>
                    <List>{fileList(currentVersion?.files)}</List>
                  </Fragment>
                ) : null}
              </Box>
            </Card>

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
                  startIcon={<Icon icon='mdi:edit-outline' />}
                  onClick={() => {
                    router.push({
                      pathname: '/certification-test/post',
                      query: {
                        edit: JSON.stringify(true),
                        id: id,
                      },
                    })
                  }}
                >
                  Edit
                </Button>
              </Box>
            </Card>
          </Box>
        </Grid>
      </Box>
    </Box>
  )
}

CertificationTestDetail.acl = {
  action: 'read',
  subject: 'certification_test',
}

const StyledEditor = styled(EditorWrapper)<{
  error?: boolean
  maxHeight?: boolean
  minHeight?: number
}>`
  .rdw-editor-main {
    border: none !important;
    min-height: ${({ minHeight }) =>
      minHeight ? `${minHeight}rem !important` : '10rem'};
    max-height: ${({ maxHeight }) => (maxHeight ? `300px` : '800px')};
  }
  .rdw-editor-toolbar {
    display: none;
  }
`

const FileList = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 8px;
  justify-content: space-between;
  border-radius: 8px;
  padding: 8px;
  border: 1px solid rgba(76, 78, 100, 0.22);
  background: #f9f8f9;
  cursor: pointer;
  .file-details {
    width: 85%;
    display: flex;
    align-items: center;
  }

  .close-button {
    display: flex;
    align-items: center;
    width: 15%;
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

  .file-info {
    width: 100%;

    overflow: hidden;
  }

  .file-name {
    width: 100%;
    font-weight: 600;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`

export default CertificationTestDetail