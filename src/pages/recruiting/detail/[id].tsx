// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card, CardHeader, IconButton } from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import { DataGrid } from '@mui/x-data-grid'

// ** React Imports
import { useContext, useEffect, useState } from 'react'

// ** Third Party Imports
import { convertFromRaw, EditorState } from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { StyledViewer } from 'src/@core/components/editor/customEditor'
import { toast } from 'react-hot-toast'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'
import EmptyPost from 'src/@core/components/page/empty-post'
import PageHeader from 'src/@core/components/page-header'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
import Icon from 'src/@core/components/icon'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'
import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** helpers
import {
  convertTimeToTimezone,
  MMDDYYYYHelper,
} from 'src/shared/helpers/date.helper'

// ** NextJS
import { useRouter } from 'next/router'

// ** fetches
import { useGetRecruitingDetail } from 'src/queries/recruiting.query'
import { useMutation, useQueryClient } from 'react-query'
import {
  CurrentHistoryType,
  deleteRecruiting,
  hideRecruiting,
} from 'src/apis/recruiting.api'
import FallbackSpinner from '@src/@core/components/spinner'
import { recruiting } from '@src/shared/const/permission-class'
import { timezoneSelector } from '@src/states/permission'

// ** types

type CellType = {
  row: CurrentHistoryType
}

const RecruitingDetail = () => {
  const router = useRouter()
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const id = Number(router.query?.id)
  const queryClient = useQueryClient()

  const [mainContent, setMainContent] = useState(EditorState.createEmpty())
  const [historyContent, setHistoryContent] = useState(
    EditorState.createEmpty(),
  )

  const initialValue = {
    id: null,
    version: null,
    writer: '',
    email: '',
    createdAt: '',
    status: '',
    client: '',
    jobType: '',
    role: '',
    sourceLanguage: '',
    targetLanguage: '',
    openings: null,
    dueDate: '',
    dueDateTimezone: '',
    jobPostLink: '',
    content: '',
    isHide: 'false',
  }
  const [pageSize, setPageSize] = useState(5)
  const [currentRow, setCurrentRow] = useState(initialValue)

  const [openDetail, setOpenDetail] = useState(false)

  const { setModal } = useContext(ModalContext)
  const ability = useContext(AbilityContext)

  const auth = useRecoilValueLoadable(authState)
  const { data, refetch, isSuccess, isError } = useGetRecruitingDetail(
    id,
    false,
  )

  useEffect(() => {
    if (!Number.isNaN(id)) {
      refetch()
    }
  }, [id])

  const { currentVersion } = data || { initialValue }

  const versionHistory = data?.versionHistory || []

  const writer = new recruiting(currentVersion?.userId!)
  const isWriter = ability.can('update', writer) //writer can edit, hide the post
  const isMaster = ability.can('delete', writer) //master can edit, delete the post
  const deleteMutation = useMutation((id: number) => deleteRecruiting(id), {
    onSuccess: () => {
      router.replace('/recruiting/')
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

  function renderTable(
    label: string,
    value: number | string | undefined | null,
  ) {
    return (
      <Grid container mb={'11px'}>
        <Grid item xs={6}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
            {label}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            variant='body2'
            sx={{
              display: 'flex',
              alignItems: 'center',
              wordBreak: 'break-all',
            }}
          >
            {value ?? '-'}
            {label === 'Job posting link' && !!value && (
              <IconButton
                onClick={() => {
                  if (typeof window === 'object') {
                    window.open(value as string)
                  }
                }}
              >
                <Icon
                  icon='material-symbols:open-in-new'
                  opacity={0.7}
                  fontSize='1.3rem'
                  cursor='pointer'
                />
              </IconButton>
            )}
          </Typography>
        </Grid>
      </Grid>
    )
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
      field: 'createdAt',
      headerName: 'Date & Time',
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ overflowX: 'scroll' }}>
            {convertTimeToTimezone(
              row.createdAt,
              auth.getValue().user?.timezone!,
              timezone.getValue(),
            )}
          </Box>
        )
      },
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
            Are you sure to delete this recruiting request?
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
              deleteMutation.mutate(id)
            }}
          >
            Delete
          </Button>
        </ModalButtonGroup>
      </ModalContainer>,
    )
  }

  const hideMutation = useMutation(
    () => hideRecruiting(id, !currentVersion?.isHide),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('get-recruiting/list')
        router.replace('/recruiting/')
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  function onHide() {
    hideMutation.mutate()
  }

  function onEdit() {
    router.push(`/recruiting/edit/${id}`)
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
          <PageHeader
            title={
              <Box display='flex' alignItems='center' gap='8px'>
                <Icon
                  icon='material-symbols:arrow-back-ios-new'
                  style={{ cursor: 'pointer' }}
                  onClick={() => router.push('/recruiting')}
                />
                <Typography variant='h5'>Recruiting Request</Typography>
              </Box>
            }
          />

          <Grid container spacing={6} sx={{ paddingTop: '20px' }}>
            <Grid item md={9} xs={12}>
              <Card sx={{ padding: '30px 20px 20px' }}>
                <Box display='flex' justifyContent='space-between' mb='26px'>
                  <CustomChip
                    label={currentVersion?.id}
                    skin='light'
                    color='primary'
                    size='small'
                  />

                  <Box display='flex' flexDirection='column' gap='8px'>
                    <Box display='flex' alignItems='center' gap='8px'>
                      <CustomChip
                        label='Requestor'
                        skin='light'
                        color='error'
                        size='small'
                      />
                      <Typography
                        sx={{ fontSize: '0.875rem', fontWeight: 500 }}
                        color={`${
                          auth.getValue().user?.email === currentVersion?.email
                            ? 'primary'
                            : ''
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
                      {convertTimeToTimezone(
                        currentVersion?.createdAt,
                        auth.getValue().user?.timezone!,
                        timezone.getValue(),
                      )}
                    </Typography>
                  </Box>
                </Box>
                <Divider />
                <Grid container spacing={12} pt='10px'>
                  <Grid item xs={5}>
                    {renderTable('Status', currentVersion?.status)}
                    {renderTable('Job type', currentVersion?.jobType)}
                    {renderTable(
                      'Source language',
                      currentVersion?.sourceLanguage.toUpperCase(),
                    )}
                  </Grid>
                  <Grid item xs={7}>
                    {renderTable('Client', currentVersion?.client)}
                    {renderTable('Role', currentVersion?.role)}
                    {renderTable(
                      'Target language',
                      currentVersion?.targetLanguage.toUpperCase(),
                    )}
                  </Grid>
                </Grid>

                <Divider />
                <Grid container spacing={12} pt='10px'>
                  <Grid item xs={5}>
                    {renderTable(
                      'Number of linguist',
                      currentVersion?.openings,
                    )}

                    {renderTable(
                      'Due date',
                      currentVersion?.dueDate
                        ? convertTimeToTimezone(
                            currentVersion?.dueDate,
                            currentVersion?.dueDateTimezone!,
                            timezone.getValue(),
                          )
                        : '',
                    )}
                  </Grid>
                  <Grid item xs={7}>
                    {renderTable(
                      'Job posting link',
                      currentVersion?.jobPostLink,
                    )}
                    {renderTable(
                      'Due date timezone',
                      auth.getValue().user?.timezone?.label,
                    )}
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
              <Card>
                {isWriter || isMaster ? (
                  <Box
                    sx={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {isWriter && (
                      <Button
                        variant='outlined'
                        color='secondary'
                        startIcon={<Icon icon='clarity:eye-hide-line' />}
                        onClick={onHide}
                      >
                        {currentVersion?.isHide ? 'Re-post' : 'Hide'}
                      </Button>
                    )}
                    {isMaster && (
                      <Button
                        variant='outlined'
                        color='secondary'
                        startIcon={<Icon icon='mdi:delete-outline' />}
                        onClick={onDelete}
                      >
                        Delete
                      </Button>
                    )}

                    {isMaster || isWriter ? (
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
                  </Box>
                ) : null}
              </Card>
            </Grid>
          </Grid>
          <Dialog
            open={openDetail}
            onClose={() => setOpenDetail(false)}
            maxWidth='md'
          >
            <StyledViewer maxHeight={true}>
              <Grid
                container
                sx={{ padding: '50px 60px 50px' }}
                justifyContent='center'
              >
                <Grid container spacing={6}>
                  <Grid item xs={12}>
                    <Card sx={{ padding: '20px', width: '100%' }}>
                      <Box
                        display='flex'
                        justifyContent='space-between'
                        mb='26px'
                      >
                        <CustomChip
                          label={currentRow?.id}
                          skin='light'
                          color='primary'
                          size='small'
                        />

                        <Box display='flex' flexDirection='column' gap='8px'>
                          <Box display='flex' alignItems='center' gap='8px'>
                            <CustomChip
                              label='Requestor'
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
                            {convertTimeToTimezone(
                              new Date(),
                              auth.getValue().user?.timezone!,
                              timezone.getValue(),
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      <Divider />
                      <Grid container spacing={12} pt='10px'>
                        <Grid item xs={5}>
                          {renderTable('Status', currentRow?.status)}
                          {renderTable('Job type', currentRow?.jobType)}
                          {renderTable(
                            'Source language',
                            currentRow?.sourceLanguage.toUpperCase(),
                          )}
                        </Grid>
                        <Grid item xs={7}>
                          {renderTable('Client', currentRow?.client)}
                          {renderTable('Role', currentRow?.role)}
                          {renderTable(
                            'Target language',
                            currentRow?.targetLanguage.toUpperCase(),
                          )}
                        </Grid>
                      </Grid>

                      <Divider />
                      <Grid container spacing={12} pt='10px'>
                        <Grid item xs={5}>
                          {renderTable(
                            'Number of linguist',
                            currentRow?.openings,
                          )}
                          {renderTable(
                            'Due date',
                            MMDDYYYYHelper(currentRow?.dueDate),
                          )}
                          {renderTable(
                            'Due date',
                            currentRow?.dueDate
                              ? convertTimeToTimezone(
                                  currentRow?.dueDate,
                                  currentRow?.dueDateTimezone!,
                                  timezone.getValue(),
                                )
                              : '',
                          )}
                        </Grid>
                        <Grid item xs={7}>
                          {renderTable(
                            'Job posting link',
                            currentRow?.jobPostLink,
                          )}
                          {renderTable(
                            'Due date timezone',
                            auth.getValue().user?.timezone?.label,
                          )}
                        </Grid>
                      </Grid>
                      <Divider />
                      <ReactDraftWysiwyg
                        editorState={historyContent}
                        readOnly={true}
                      />
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
                </ModalButtonGroup>
              </Grid>
            </StyledViewer>
          </Dialog>
        </StyledViewer>
      )}
    </>
  )
}

export default RecruitingDetail

RecruitingDetail.acl = {
  action: 'read',
  subject: 'recruiting',
}
