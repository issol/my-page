import {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useContext,
  useEffect,
  useState,
} from 'react'
import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'
import Divider from '@mui/material/Divider'
import DialogContent from '@mui/material/DialogContent'
import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'
import { ModalContext } from 'src/context/ModalContext'
import {
  AssignReviewerType,
  SelectedJobInfoType,
  TestHistoryType,
} from 'src/types/onboarding/list'
import Button from '@mui/material/Button'

import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Checkbox from '@mui/material/Checkbox'
import Autocomplete from '@mui/material/Autocomplete'
import Icon from 'src/@core/components/icon'

import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Chip from 'src/@core/components/mui/chip'
import { TestStatusColor } from 'src/shared/const/chipColors'
import RequestReviewerModal from '../modal/request-reviewer-modal'

import {
  useForm,
  Controller,
  useFieldArray,
  Control,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'
import { TestStatus } from 'src/shared/const/personalInfo'
import { CardProps } from '../../list/filters'
import { FullDateTimezoneHelper } from 'src/shared/helpers/date.helper'
// import { useGetReviewerList } from 'src/queries/onboarding/onboarding-query'
import { useMutation, useQueryClient } from 'react-query'

import { AppliedRoleType } from 'src/types/onboarding/details'
import {
  useGetHistory,
  useGetReviewerList,
} from 'src/queries/onboarding/onboarding-query'
import { assignReviewer } from 'src/apis/onboarding.api'

// type AssignReviewerType = {
//   jobType: { label: string; value: string }
//   role: { label: string; value: string }
//   source: { label: string; value: string }
//   target: { label: string; value: string }
// }

type CellType = {
  row: TestHistoryType
}

type ReviewerCellType = {
  row: AssignReviewerType
}

type Props = {
  jobInfo: AppliedRoleType
  reviewerList: AssignReviewerType[]
  type: string
  history: any
}

const defaultValues = {
  jobType: '',
  role: '',
  source: '',
  target: '',
}

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  '& .MuiTab-root': {
    minHeight: 38,
    minWidth: 110,
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))
export default function TestDetailsModal({
  jobInfo,
  reviewerList,
  type,
  history,
}: Props) {
  const { setModal } = useContext(ModalContext)
  const [info, setInfo] = useState<AppliedRoleType>(jobInfo)
  const { data: reviewerList1 } = useGetReviewerList()
  const { data: history1 } = useGetHistory()
  const [selectedReviewer, setSelectedReviewer] =
    useState<AssignReviewerType | null>(null)
  const [reviewers, setReviewers] = useState<AssignReviewerType[]>(reviewerList)
  const [value, setValue] = useState<string>(type === 'detail' ? '1' : '2')
  const [inputStyle, setInputStyle] = useState<boolean>(true)
  const [testHistoryPage, setTestHistoryPage] = useState<number>(0)
  const [testHistoryPageSize, setTestHistoryPageSize] = useState<number>(10)
  const queryClient = useQueryClient()

  const [requestReviewerModalOpen, setRequestReviewerModalOpen] =
    useState(false)

  const [isAccepted, setIsAccepted] = useState(false)
  const [acceptedId, setAcceptedId] = useState(0)
  const [assignReviewerPage, setAssignReviewerPage] = useState<number>(0)
  const [assignReviewerPageSize, setAssignReviewerPageSize] =
    useState<number>(10)

  const [testStatus, setTestStatus] = useState<{
    value: string
    label: string
  } | null>(null)

  const assignReviewerMutation = useMutation(
    (value: { id: number; status: string }) =>
      assignReviewer(value.id, value.status),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries('reviewers')
      },
    },
  )

  // const {
  //   control,
  //   handleSubmit,
  //   watch,
  //   trigger,
  //   reset,
  //   formState: { errors, dirtyFields },
  // } = useForm<AssignReviewerType>({
  //   // defaultValues,
  //   mode: 'onChange',
  //   // resolver: yupResolver(profileSchema),
  // })

  const onChangeTestStatus = (
    event: SyntheticEvent,
    newValue: { value: string; label: string } | null,
  ) => {
    setTestStatus(newValue)
  }

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }
  function getLegalName(row: any) {
    return !row.firstName || !row.lastName
      ? '-'
      : row.firstName +
          (row.middleName ? ' (' + row.middleName + ')' : '') +
          ` ${row.lastName}`
  }

  const requestReview = (
    reviewer: AssignReviewerType | null,
    status: string,
  ) => {
    console.log(reviewer)
    assignReviewerMutation.mutate({
      id: reviewer?.id!,
      status: status,
    })
  }

  const reassignReviewer = () => {
    assignReviewerMutation.mutate({
      id: acceptedId,
      status: 'Re assign',
    })
  }

  const onClickRequestReview = (reviewer: AssignReviewerType | null) => {
    setSelectedReviewer(reviewer)
    setRequestReviewerModalOpen(true)
  }

  useEffect(() => {
    setInfo(jobInfo)
    setTestStatus({ value: jobInfo.testStatus, label: jobInfo.testStatus })
  }, [jobInfo])

  useEffect(() => {
    const accepted = reviewerList1.find(
      (value: any) => value.status === 'Request accepted',
    )
    const acceptedId = reviewerList1.findIndex(
      (value: any) => value.status === 'Request accepted',
    )
    if (accepted) {
      setAcceptedId(reviewerList1[acceptedId].id)
      setIsAccepted(true)
      const res = reviewerList1.map((value: any) => {
        if (value.status === 'Request accepted') {
          return { ...value }
        } else {
          return { ...value, status: '-' }
        }
      })
      setReviewers(res)
    } else {
      setIsAccepted(false)
      setReviewers(reviewerList1)
    }
  }, [reviewerList1])

  useEffect(() => {
    const accepted = reviewerList.find(
      value => value.status === 'Request accepted',
    )
    const acceptedId = reviewerList.findIndex(
      (value: any) => value.status === 'Request accepted',
    )
    if (accepted) {
      setIsAccepted(true)
      setAcceptedId(reviewerList[acceptedId].id)
      const res = reviewerList.map(value => {
        if (value.status === 'Request accepted') {
          return { ...value }
        } else {
          return { ...value, status: '-' }
        }
      })
      setReviewers(res)
    } else {
      setIsAccepted(false)
      setReviewers(reviewerList)
    }
  }, [reviewerList])

  const columns = [
    {
      flex: 0.15,
      field: 'status',
      minWidth: 120,
      headerName: 'Test status',
      renderCell: ({ row }: CellType) => {
        return (
          <Chip
            size='medium'
            type='testStatus'
            label={row.status}
            /* @ts-ignore */
            customcolor={TestStatusColor[row.status]}
            sx={{
              textTransform: 'capitalize',
              '& .MuiChip-label': { lineHeight: '18px' },
              mr: 1,
            }}
          />
        )
      },
    },
    {
      flex: 0.17,
      minWidth: 200,
      field: 'reviewer',
      headerName: 'Test reviewer / TAD',

      renderCell: ({ row }: CellType) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',

              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            <Box
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {getLegalName(row.reviewer)}
              </Typography>

              <Typography
                variant='body2'
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.reviewer.email}
              </Typography>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'date',
      headerName: 'Date&Time',

      renderCell: ({ row }: CellType) => (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {FullDateTimezoneHelper(row.date)}
        </Box>
      ),
    },
  ]

  const reviewerColumns = [
    {
      flex: 0.17,
      minWidth: 200,
      field: 'reviewer',
      headerName: 'Test reviewer / TAD',

      renderCell: ({ row }: ReviewerCellType) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',

              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {' '}
            <Box
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <Typography
                sx={{
                  fontWeight: '600',
                  fontSize: '1rem',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {getLegalName(row)}
              </Typography>

              <Typography
                variant='body2'
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.email}
              </Typography>
            </Box>
          </Box>
        )
      },
    },
    {
      flex: 0.15,
      field: 'action',
      minWidth: 120,
      headerName: 'Action',
      renderCell: ({ row }: ReviewerCellType) => {
        if (row.status === 'Not requested') {
          return (
            <Button
              variant='contained'
              fullWidth
              onClick={() => onClickRequestReview(row)}
            >
              Request review
            </Button>
          )
        } else if (row.status === 'Requested') {
          return (
            <Button
              fullWidth
              variant='contained'
              disabled
              sx={{
                '&.Mui-disabled': {
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FDB528;',
                  border: '1px solid rgba(253, 181, 40, 0.5)',
                  color: '#FDB528',
                },
              }}
              startIcon={
                <img src='/images/icons/onboarding-icons/reviewer-requested.svg' />
              }
            >
              Requested
            </Button>
          )
        } else if (
          row.status === 'Request rejected' ||
          row.status === 'Canceled'
        ) {
          return (
            <Button
              fullWidth
              variant='contained'
              disabled
              sx={{
                '&.Mui-disabled': {
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #FF4D49',
                  border: '1px solid #FF4D49',
                  color: '#FF4D49',
                },
              }}
              startIcon={<Icon icon='mdi:alert-circle-outline' />}
            >
              {row.status}
            </Button>
          )
        } else if (row.status === 'Request accepted') {
          return (
            <Button
              fullWidth
              variant='contained'
              disabled
              sx={{
                '&.Mui-disabled': {
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128',
                  border: '1px solid #72E128',
                  color: '#64C623',
                },
              }}
              startIcon={<Icon icon='mdi:check-circle-outline' />}
            >
              Request accepted
            </Button>
          )
        } else if (row.status === '-') {
          return <Box>-</Box>
        }
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'date',
      headerName: 'Date&Time',

      renderCell: ({ row }: ReviewerCellType) => (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {FullDateTimezoneHelper(row.date)}
        </Box>
      ),
    },
  ]

  return (
    <Dialog
      open={true}
      keepMounted
      fullWidth
      onClose={() => setModal(null)}
      // TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='md'
    >
      <RequestReviewerModal
        reviewer={selectedReviewer}
        requestReview={requestReview}
        open={requestReviewerModalOpen}
        onClose={() => setRequestReviewerModalOpen(false)}
      />

      <DialogContent
        sx={{
          padding: '50px',
          position: 'relative',
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: '20px', right: '20px' }}
          onClick={() => setModal(null)}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <TabContext value={value}>
            <TabList
              onChange={handleChange}
              aria-label='customized tabs example'
            >
              <Tab
                value='1'
                label='Test details'
                sx={{ textTransform: 'none' }}
                icon={
                  <img
                    src={`/images/icons/onboarding-icons/test-details-${
                      value === '1' ? 'active' : 'inactive'
                    }.svg`}
                  />
                }
                iconPosition='start'
              />
              <Tab
                value='2'
                label='Assign reviewer'
                icon={
                  <img
                    src={`/images/icons/onboarding-icons/assign-reviewer-${
                      value === '2' ? 'active' : 'inactive'
                    }.svg`}
                  />
                }
                iconPosition='start'
                sx={{ textTransform: 'none' }}
              />
            </TabList>
            <TabPanel value='1' sx={{ padding: 0 }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
              >
                <Card sx={{ padding: '20px' }}>
                  <CardContent
                    sx={{ padding: 0, paddingBottom: '0 !important' }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', gap: '10px' }}>
                          <Typography variant='body1' sx={{ fontWeight: 600 }}>
                            {jobInfo.jobType}
                          </Typography>
                          <Divider orientation='vertical' flexItem />
                          <Typography variant='body1' sx={{ fontWeight: 600 }}>
                            {jobInfo.role}
                          </Typography>
                          <Divider orientation='vertical' flexItem />
                          <Typography
                            variant='subtitle2'
                            sx={{ fontWeight: 600 }}
                          >
                            {jobInfo.source && jobInfo.target ? (
                              <>
                                {jobInfo.source.toUpperCase()} &rarr;{' '}
                                {jobInfo.target.toUpperCase()}
                              </>
                            ) : (
                              ''
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      {/* <Box sx={{ width: '292px' }}>
                        <Autocomplete
                          fullWidth
                          value={testStatus}
                          onChange={onChangeTestStatus}
                          // isOptionEqualToValue={(option, newValue) => {
                          //   return option.value === newValue.value
                          // }}
                          options={TestStatus}
                          id='testStatus'
                          getOptionLabel={option => option.label}
                          renderInput={params => (
                            <TextField {...params} label='Test status' />
                          )}
                        />
                      </Box> */}
                    </Box>
                  </CardContent>
                </Card>

                <Grid item xs={12}>
                  <Card>
                    <CardHeader title='Certification test history'></CardHeader>
                    <Box
                      sx={{
                        width: '100%',
                        '& .MuiDataGrid-columnHeaderTitle': {
                          textTransform: 'none',
                        },
                      }}
                    >
                      <DataGrid
                        components={{
                          NoRowsOverlay: () => {
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
                                <Typography variant='subtitle1'>
                                  There are no History
                                </Typography>
                              </Box>
                            )
                          },
                          NoResultsOverlay: () => {
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
                                <Typography variant='subtitle1'>
                                  There are no History
                                </Typography>
                              </Box>
                            )
                          },
                        }}
                        columns={columns}
                        // rowHeight={70}
                        rows={history ?? []}
                        autoHeight
                        disableSelectionOnClick
                        pageSize={testHistoryPageSize}
                        rowsPerPageOptions={[5, 10, 25, 50]}
                        page={testHistoryPage}
                        rowCount={history!.length}
                        onPageChange={(newPage: number) => {
                          setTestHistoryPage(newPage)
                        }}
                        onPageSizeChange={(newPageSize: number) =>
                          setTestHistoryPageSize(newPageSize)
                        }
                      />
                    </Box>
                  </Card>
                </Grid>
              </Box>
            </TabPanel>
            <TabPanel value='2'>
              <Grid item xs={12}>
                <Card>
                  <Box
                    sx={{
                      padding: '20px',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Typography variant='h6' sx={{ fontWeight: 600 }}>
                      Reviewer list
                    </Typography>
                    <Button
                      variant='outlined'
                      disabled={!isAccepted}
                      color={isAccepted ? 'primary' : 'secondary'}
                      onClick={reassignReviewer}
                    >
                      Re-assign
                    </Button>
                  </Box>

                  <Box
                    sx={{
                      width: '100%',
                      '& .MuiDataGrid-columnHeaderTitle': {
                        textTransform: 'none',
                      },
                    }}
                  >
                    <DataGrid
                      components={{
                        NoRowsOverlay: () => {
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
                              <Typography variant='subtitle1'>
                                There are no Reviewer
                              </Typography>
                            </Box>
                          )
                        },
                        NoResultsOverlay: () => {
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
                              <Typography variant='subtitle1'>
                                There are no Reviewer
                              </Typography>
                            </Box>
                          )
                        },
                      }}
                      columns={reviewerColumns}
                      // rowHeight={70}
                      rows={reviewers ?? []}
                      autoHeight
                      disableSelectionOnClick
                      pageSize={assignReviewerPageSize}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      page={assignReviewerPage}
                      rowCount={reviewers?.length}
                      onPageChange={(newPage: number) => {
                        setAssignReviewerPage(newPage)
                      }}
                      onPageSizeChange={(newPageSize: number) =>
                        setAssignReviewerPageSize(newPageSize)
                      }
                    />
                  </Box>
                </Card>
              </Grid>
            </TabPanel>
          </TabContext>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export const AutoCompleteComponent = styled(Card)<CardProps>(
  ({ theme, dropdownClose }) => ({
    '& .MuiAutocomplete-inputRoot': {
      height: !dropdownClose && '56px;',
      flexWrap: dropdownClose ? 'wrap;' : 'nowrap;',
    },
    width: '292px',
    boxShadow: 'none',

    padding: 6,
    borderRadius: '8px',
  }),
)
