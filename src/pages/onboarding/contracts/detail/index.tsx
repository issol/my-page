// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Button, Card, CardHeader, Chip } from '@mui/material'
import { Box } from '@mui/system'
import Divider from '@mui/material/Divider'
import Dialog from '@mui/material/Dialog'
import { DataGrid } from '@mui/x-data-grid'

// ** React Imports
import { Suspense, useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'

// ** Third Party Imports
import {
  ContentBlock,
  ContentState,
  convertFromRaw,
  EditorState,
} from 'draft-js'

// ** Component Import
import ReactDraftWysiwyg from 'src/@core/components/react-draft-wysiwyg'

// ** Styled Component Import
import { StyledViewer } from 'src/@core/components/editor/customEditor'
import FallbackSpinner from 'src/@core/components/spinner'
import CustomChip from 'src/@core/components/mui/chip'

// ** Styles
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { ModalButtonGroup, ModalContainer } from 'src/@core/components/modal'
import Icon from 'src/@core/components/icon'

// ** contexts
import { ModalContext } from 'src/context/ModalContext'
import { AuthContext } from 'src/context/AuthContext'
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** fetcher
import {
  useInvalidateContractQuery,
  useGetContract,
} from 'src/queries/contract/contract.query'

// ** types
import {
  LangType,
  ContractType,
  deleteContract,
  restoreContract,
  ContractTypeEnum,
  ContractLangEnum,
} from 'src/apis/contract.api'
import { useMutation } from 'react-query'
import { toast } from 'react-hot-toast'
import { contract as Contract } from '@src/shared/const/permission-class'
import { Entity } from 'draft-js'

type CellType = {
  row: {
    documentId: number
    userId: number
    version: string
    writer?: string
    email: string
    updatedAt: string
    content?: any
  }
}

const ContractDetail = () => {
  const router = useRouter()
  const invalidate = useInvalidateContractQuery()
  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)
  const type = router.query.type as ContractType
  const language = router.query.language as LangType

  const [openDetail, setOpenDetail] = useState(false)

  const [mainContent, setMainContent] = useState(EditorState.createEmpty())
  const [historyContent, setHistoryContent] = useState(
    EditorState.createEmpty(),
  )
  const [pageSize, setPageSize] = useState(5)
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

  const { data, refetch } = useGetContract({
    type,
    language,
  })

  useEffect(() => {
    if (type && language) {
      refetch()
    }
  }, [type, language])

  const { currentVersion: contract } = data || {
    documentId: null,
    userId: null,
    title: '',
    email: '',
    writer: '',
    updatedAt: '',
    content: null,
  }
  const versionHistory = data?.versionHistory || []

  const deleteMutation = useMutation(() => deleteContract(type, language), {
    onSuccess: () => {
      invalidate()
      router.push('/onboarding/contracts')
      return
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })
  const restoreMutation = useMutation(
    (restoreDocId: number) =>
      restoreContract(restoreDocId, user?.username!, user?.email!),
    {
      onSuccess: () => {
        refetch()
        return
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  useEffect(() => {
    refetch()
  }, [])

  function urlToImage(url: string): Promise<HTMLImageElement> {
    const image = new Image()
    image.src = url
    return new Promise(resolve => {
      image.onload = () => resolve(image)
    })
  }

  // ** TODO : 추후 contract에 pro의 이름을 넣어야 하는 경우 아래 코드 수정하여 사용하기
  // useEffect(() => {
  //   /* eslint-disable */
  //   const initialState = {
  //     entityMap: {
  //       0: {
  //         type: 'IMAGE',
  //         mutability: 'IMMUTABLE',
  //         data: {
  //           src: 'https://picsum.photos/200/300',
  //         },
  //       },
  //     },
  //     blocks: [
  //       {
  //         key: 'ov7r',
  //         text: ' ',
  //         type: 'atomic',
  //         depth: 0,
  //         inlineStyleRanges: [],
  //         entityRanges: [
  //           {
  //             offset: 0,
  //             length: 1,
  //             key: 0,
  //           },
  //         ],
  //         data: {},
  //       },
  //       {
  //         key: 'e23a8',
  //         text: 'See advanced examples further down …',
  //         type: 'unstyled',
  //         depth: 0,
  //         inlineStyleRanges: [],
  //         entityRanges: [],
  //         data: {},
  //       },
  //     ],
  //   }
  //   /* eslint-enable */

  //   if (contract?.content) {
  //     const copyContent = { ...contract.content }

  //     for (let i = 0; i < copyContent?.blocks?.length; i++) {
  //       if (!copyContent?.blocks[i]?.text.includes('dsdd')) continue
  //       copyContent.blocks[i].text = copyContent?.blocks[i]?.text?.replace(
  //         'dsdd',
  //         '',
  //       )
  //       copyContent.blocks[i].type = 'atomic'
  //       copyContent.blocks[i].entityRanges = [
  //         {
  //           offset: 0,
  //           length: 1,
  //           key: 0,
  //         },
  //       ]
  //     }
  //     copyContent.entityMap = {
  //       [0]: {
  //         type: 'IMAGE',
  //         mutability: 'IMMUTABLE',
  //         data: {
  //           src: 'https://picsum.photos/200/300',
  //         },
  //       },
  //     }

  //     console.log(copyContent)
  //     console.log(initialState)
  //     const content = convertFromRaw(copyContent as any)

  //     const editorState = EditorState.createWithContent(content)
  //     // const editorState = EditorState.createWithContent(
  //     //   convertFromRaw(initialState),
  //     // )
  //     setMainContent(editorState)
  //   }
  // }, [contract])

  function getTitle() {
    switch (type) {
      case ContractTypeEnum.NDA:
        if (language === ContractLangEnum.KOREAN) return '[KOR] NDA'
        else return '[ENG] NDA'
      case ContractTypeEnum.PRIVACY:
        if (language === ContractLangEnum.KOREAN)
          return '[KOR] Privacy Contract'
        else return '[ENG] Privacy Contract'
      case ContractTypeEnum.FREELANCER:
        if (language === ContractLangEnum.KOREAN)
          return '[KOR] Freelancer Contract'
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
          {FullDateTimezoneHelper(row.updatedAt, user?.timezone!)}
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
          <Button variant='outlined' onClick={() => setModal(null)}>
            Cancel
          </Button>
          <Button
            variant='contained'
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

  function isAuthor(can: 'update' | 'delete', id: number) {
    const writer = new Contract(id)
    if (contract) {
      return ability.can(can, writer)
    }
  }

  useEffect(() => {
    if (contract?.content) {
      const content = convertFromRaw(contract?.content as any)
      const editorState = EditorState.createWithContent(content)
      setMainContent(editorState)
    }
  }, [contract])

  function onRestore(restoreDoc: any) {
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
            variant='outlined'
            onClick={() => {
              setModal(null)
              setOpenDetail(true)
            }}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            onClick={() => {
              setModal(null)
              restoreMutation.mutate(restoreDoc.documentId)
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

  if (!contract) return null

  return (
    <Suspense fallback={<FallbackSpinner />}>
      <StyledViewer style={{ margin: '0 70px' }}>
        <Grid></Grid>
        <Grid container spacing={6}>
          <Grid item xs={9}>
            <Card sx={{ padding: '30px 20px 20px', width: '100%' }}>
              <Box display='flex' justifyContent='space-between' mb='26px'>
                <Typography variant='h6'>{getTitle()}</Typography>

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
                        user?.id === contract?.userId ? 'primary' : ''
                      }`}
                    >
                      {contract?.writer}
                    </Typography>
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <Typography variant='body2'>{contract?.email}</Typography>
                  </Box>
                  <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                    {FullDateTimezoneHelper(
                      contract?.updatedAt,
                      user?.timezone!,
                    )}
                  </Typography>
                </Box>
              </Box>
              <Divider />
              <ReactDraftWysiwyg editorState={mainContent} readOnly={true} />
            </Card>
            <Card sx={{ marginTop: '24px', width: '100%' }}>
              <CardHeader title='Version history' />
              <Box sx={{ height: '100%' }}>
                <DataGrid
                  getRowId={row => row?.documentId}
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
                  rowCount={versionHistory?.length}
                  rows={versionHistory}
                  onRowClick={onRowClick}
                />
              </Box>
            </Card>
          </Grid>
          <>
            <Grid item xs={3} className='match-height' sx={{ height: '152px' }}>
              {isAuthor('delete', contract?.userId) ||
              isAuthor('update', contract?.userId) ? (
                <Card>
                  <Box
                    sx={{
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {isAuthor('delete', contract?.userId) ? (
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

                    {isAuthor('update', contract?.userId) ? (
                      <Button
                        variant='contained'
                        onClick={onEdit}
                        startIcon={<Icon icon='mdi:pencil-outline' />}
                      >
                        Edit
                      </Button>
                    ) : (
                      ''
                    )}
                  </Box>
                </Card>
              ) : null}
            </Grid>
          </>
        </Grid>
        <Dialog
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          maxWidth='md'
        >
          <StyledViewer maxHeight={true}>
            <Grid
              container
              /* xs={12} */
              sx={{ padding: '50px 60px 50px' }}
              justifyContent='center'
            >
              <Card sx={{ padding: '20px', width: '100%' }}>
                <Box display='flex' justifyContent='space-between' mb='26px'>
                  <Typography variant='h6'>[ENG] NDA</Typography>

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
                    <Typography variant='body2' sx={{ alignSelf: 'flex-end' }}>
                      {FullDateTimezoneHelper(
                        currentRow?.updatedAt,
                        user?.timezone!,
                      )}
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

                {isAuthor('update', Number(currentRow?.userId)) ? (
                  <Button
                    variant='contained'
                    onClick={() => onRestore(currentRow)}
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
    </Suspense>
  )
}

export default ContractDetail

ContractDetail.acl = {
  action: 'read',
  subject: 'contract',
}
