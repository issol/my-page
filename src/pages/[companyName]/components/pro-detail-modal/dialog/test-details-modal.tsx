import { SyntheticEvent, useEffect, useState } from 'react'
import Box from '@mui/material/Box'

import Divider from '@mui/material/Divider'

import { DataGrid } from '@mui/x-data-grid'
import IconButton from '@mui/material/IconButton'

import { AssignReviewerType, TestHistoryType } from 'src/types/onboarding/list'
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

import Icon from 'src/@core/components/icon'
import { v4 as uuidv4 } from 'uuid'

import Grid from '@mui/material/Grid'
import Chip from 'src/@core/components/mui/chip'
import { TestStatusColor } from 'src/shared/const/chipColors'

import { CardProps } from '../../../onboarding/components/list/filters'
import { convertTimeToTimezone } from 'src/shared/helpers/date.helper'

import { useMutation, useQuery, useQueryClient } from 'react-query'

import { TestType } from 'src/types/onboarding/details'

import {
  assignReviewer,
  getHistory,
  getReviewer,
  requestReviewer,
  cancelReviewer,
} from '@src/apis/onboarding.api'
import { UserDataType } from '@src/context/types'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

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
  row: {
    firstName: string
    jobType: string
    lastName: string
    middleName: string
    role: string
    source: string
    status: string | null
    target: string
    testId: number | null
    updatedAt: string | null
    userEmail: string
    userId: number
  }
}

type Props = {
  skillTest: TestType
  // reviewerList: AssignReviewerType[]
  type: string
  // history: any
  user: UserDataType
  onClose: any
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
  skillTest,
  // reviewerList,
  type,
  // history,
  onClose,
  user,
}: Props) {
  const [info, setInfo] = useState<TestType>(skillTest)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  // const { data: reviewerList1 } = useGetReviewerList()
  // const { data: history1 } = useGetHistory(skillTest.testId)
  const history = useQuery<{
    history: Array<TestHistoryType>
    jobType: string
    role: string
    source: string
    target: string
  }>(`test-history-${skillTest.testId}`, () => getHistory(skillTest.testId))

  const reviewer = useQuery<
    Array<{
      firstName: string
      jobType: string
      lastName: string
      middleName: string
      role: string
      source: string
      status: string | null
      target: string
      testId: number | null
      updatedAt: string | null
      userEmail: string
      userId: number
    }>
  >(`test-reviewer-${skillTest.testId}`, () => getReviewer(skillTest.testId), {
    select: data => {
      const res = data.map(value => ({ ...value, id: uuidv4() }))
      return res
    },
  })

  // const [reviewers, setReviewers] = useState<AssignReviewerType[]>(reviewerList)
  const [value, setValue] = useState<string>(type === 'detail' ? '1' : '2')

  const [testHistoryPage, setTestHistoryPage] = useState<number>(0)
  const [testHistoryPageSize, setTestHistoryPageSize] = useState<number>(10)
  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  const [isAccepted, setIsAccepted] = useState(false)

  const [assignReviewerPage, setAssignReviewerPage] = useState<number>(0)
  const [assignReviewerPageSize, setAssignReviewerPageSize] =
    useState<number>(10)

  const assignReviewerMutation = useMutation(
    (value: { reviewerId: number; testId: number; status: string }) =>
      assignReviewer(value.reviewerId, value.testId, value.status),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`test-reviewer-${variables.testId}`)
      },
    },
  )

  const requestReviewerMutation = useMutation(
    (value: { reviewerId: number; testId: number }) =>
      requestReviewer(value.testId, value.reviewerId),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`test-reviewer-${variables.testId}`)
      },
    },
  )

  const cancelReviewerMutation = useMutation(
    (value: { testId: number }) => cancelReviewer(value.testId),
    {
      onSuccess: (data, variables) => {
        queryClient.invalidateQueries(`test-reviewer-${variables.testId}`)
      },
    },
  )

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
    // console.log(reviewer?.userId, skillTest.testId, status)
    requestReviewerMutation.mutate({
      reviewerId: reviewer?.userId!,
      testId: skillTest.testId,
    })
  }

  const onClickReassignReviewer = () => {
    cancelReviewerMutation.mutate({
      testId: skillTest.testId,
    })
  }

  const onClickRequestReview = (reviewer: AssignReviewerType | null) => {
    // setRequestReviewerModalOpen(true)
    openModal({
      type: 'RequestReviewModal',
      children: (
        <CustomModal
          title={
            <>
              Are you sure to request a review to this reviewer?
              <Typography variant='body2' fontWeight={600}>
                {reviewer?.userEmail}
              </Typography>
            </>
          }
          onClose={() => closeModal('RequestReviewModal')}
          onClick={() => {
            closeModal('RequestReviewModal')
            requestReview(reviewer, 'Request accepted')
          }}
          rightButtonText='Request'
          vary='successful'
        />
      ),
    })
  }

  useEffect(() => {
    setInfo(skillTest)
    // setTestStatus({ value: skillTest.testStatus, label: jobInfo.testStatus })
  }, [skillTest])

  // useEffect(() => {
  //   const accepted = reviewerList1.find(
  //     (value: any) => value.status === 'Request accepted',
  //   )
  //   const acceptedId = reviewerList1.findIndex(
  //     (value: any) => value.status === 'Request accepted',
  //   )
  //   if (accepted) {
  //     setAcceptedId(reviewerList1[acceptedId].id)
  //     setIsAccepted(true)
  //     const res = reviewerList1.map((value: any) => {
  //       if (value.status === 'Request accepted') {
  //         return { ...value }
  //       } else {
  //         return { ...value, status: '-' }
  //       }
  //     })
  //     setReviewers(res)
  //   } else {
  //     setIsAccepted(false)
  //     setReviewers(reviewerList1)
  //   }
  // }, [reviewerList1])

  useEffect(() => {
    if (reviewer.data) {
      const accepted = reviewer.data.find(value => value.status === 'Accepted')
      // console.log(accepted)

      const acceptedId = reviewer.data.findIndex(
        (value: any) => value.status === 'Accepted',
      )
      if (accepted) {
        setIsAccepted(true)
        // setAcceptedId(reviewer.data[acceptedId].id)
        // const res = reviewer.data.map(value => {
        //   if (value.status === 'Request accepted') {
        //     return { ...value }
        //   } else {
        //     return { ...value, status: '-' }
        //   }
        // })
        // setReviewers(res)
      } else {
        setIsAccepted(false)
        // setReviewers(reviewer)
      }
    }
  }, [reviewer])

  const columns = [
    {
      flex: 0.15,
      field: 'status',
      minWidth: 120,
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      headerName: 'Test status',
      renderCell: ({ row }: CellType) => {
        return (
          <Chip
            size='medium'
            type='testStatus'
            label={row.testStatus}
            /* @ts-ignore */
            customcolor={TestStatusColor[row.testStatus]}
            sx={{
              // textTransform: 'capitalize',
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
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
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
                {getLegalName(row.operator)}
              </Typography>

              <Typography
                variant='body2'
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {row.operator.email}
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
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {convertTimeToTimezone(
            row.createdAt,
            user.timezone,
            timezone.getValue(),
          )}
        </Box>
      ),
    },
  ]

  const reviewerColumns = [
    {
      flex: 0.17,
      minWidth: 200,
      field: 'reviewer',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
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
                {row.userEmail}
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
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      headerName: 'Action',
      renderCell: ({ row }: ReviewerCellType) => {
        if (row.status === 'Not requested') {
          if (isAccepted) {
            return <Box>-</Box>
          }
          return (
            <Button
              variant='contained'
              fullWidth
              onClick={() => onClickRequestReview(row)}
            >
              Request review
            </Button>
          )
        } else if (row.status === 'NO_REPLY') {
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
        } else if (row.status === 'Rejected' || row.status === 'Canceled') {
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
        } else if (row.status === 'Accepted') {
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
      disableColumnMenu: true,
      renderCell: ({ row }: ReviewerCellType) => (
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          {convertTimeToTimezone(
            row.updatedAt,
            user.timezone,
            timezone.getValue(),
          )}
        </Box>
      ),
    },
  ]

  return (
    <Box
      sx={{
        maxWidth: '940px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
        position: 'relative',
      }}
    >
      <IconButton
        sx={{ position: 'absolute', top: '20px', right: '20px' }}
        onClick={onClose}
      >
        <Icon icon='mdi:close'></Icon>
      </IconButton>

      <Box
        sx={{
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
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
                            {skillTest.jobType}
                          </Typography>
                          <Divider orientation='vertical' flexItem />
                          <Typography variant='body1' sx={{ fontWeight: 600 }}>
                            {skillTest.role}
                          </Typography>
                          <Divider orientation='vertical' flexItem />
                          <Typography
                            variant='subtitle2'
                            sx={{ fontWeight: 600 }}
                          >
                            {skillTest.sourceLanguage &&
                            skillTest.targetLanguage ? (
                              <>
                                {skillTest.sourceLanguage.toUpperCase()} &rarr;{' '}
                                {skillTest.targetLanguage.toUpperCase()}
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
                {history.data ? (
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
                          rows={history.data.history! ?? []}
                          autoHeight
                          disableSelectionOnClick
                          pageSize={testHistoryPageSize}
                          rowsPerPageOptions={[5, 10, 25, 50]}
                          page={testHistoryPage}
                          rowCount={history!.data.history.length}
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
                ) : null}
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
                      onClick={onClickReassignReviewer}
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
                      loading={reviewer.isLoading}
                      // rowHeight={70}
                      rows={reviewer.data ?? []}
                      autoHeight
                      disableSelectionOnClick
                      pageSize={assignReviewerPageSize}
                      rowsPerPageOptions={[5, 10, 25, 50]}
                      page={assignReviewerPage}
                      rowCount={reviewer.data?.length}
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
      </Box>
    </Box>
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
