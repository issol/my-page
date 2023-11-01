import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  Collapse,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'

import {
  JobsStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import useModal from '@src/hooks/useModal'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import { useGetJobDetails } from '@src/queries/order/job.query'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import languageHelper from '@src/shared/helpers/language.helper'

import { JobItemType, JobType } from '@src/types/common/item.type'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { SyntheticEvent, useEffect, useRef, useState } from 'react'

import { v4 as uuidv4 } from 'uuid'
import JobInfoDetailView from '../detail-view'
import {
  useGetProjectInfo,
  useGetProjectTeam,
} from '@src/queries/order/order.query'
import { useMutation, useQueryClient } from 'react-query'
import { CreateJobParamsType, JobStatusType } from '@src/types/jobs/jobs.type'
import { createJob } from '@src/apis/jobs.api'
import { deleteJob } from '@src/apis/job-detail.api'
import { useGetStatusList } from '@src/queries/common.query'
import { formatCurrency } from '@src/shared/helpers/price.helper'

const JobDetails = () => {
  const router = useRouter()
  const ref = useRef<null | any>(null)
  const { openModal, closeModal } = useModal()

  const { orderId, jobId } = router.query

  const { data: jobDetails, refetch } = useGetJobDetails(Number(orderId!))
  const { data: orderDetail } = useGetProjectInfo(Number(orderId!))
  const { data: statusList } = useGetStatusList('Job')

  const [serviceType, setServiceType] = useState<
    Array<{ label: string; value: string }[]>
  >([])

  const createJobMutation = useMutation(
    (params: CreateJobParamsType) => createJob(params),
    {
      onSuccess: (data, variables) => {
        if (variables.index) {
          const newServiceType = [...serviceType]
          newServiceType.splice(variables.index, 1)
          setServiceType(newServiceType)
        } else {
          setServiceType([])
        }
        refetch()
      },
    },
  )

  const deleteJobMutation = useMutation((jobId: number) => deleteJob(jobId), {
    onSuccess: () => {
      refetch()
    },
  })

  const handleChangeServiceType = (
    event: SyntheticEvent<Element, Event>,
    value: {
      label: string
      value: string
    }[],
    index: number,
  ) => {
    const newSelections = [...serviceType]
    newSelections[index] = value
    setServiceType(newSelections)
  }

  const onClickAddJob = (itemId: number, index: number) => {
    createJobMutation.mutate({
      orderId: Number(orderId),
      itemId: itemId,
      serviceType: serviceType[index].map(value => value.value),
      index: index,
    })
  }

  function NoList() {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          padding: '15px',
          alignItems: 'center',
          borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
        }}
      >
        <Typography variant='subtitle1'>There are no jobs</Typography>
      </Box>
    )
  }

  const handleRemoveJob = (jobId: number) => {
    closeModal('RemoveJobModal')
    deleteJobMutation.mutate(jobId)
  }

  const onClickRemoveJob = (
    jobId: number,
    corporationId: string,
    jobName: string,
  ) => {
    openModal({
      type: 'RemoveJobModal',
      children: (
        <CustomModal
          onClose={() => closeModal('RemoveJobModal')}
          onClick={() => handleRemoveJob(jobId)}
          title='Are you sure you want to delete this job?'
          subtitle={`[${corporationId}] ${jobName ?? ''}`}
          vary={'error'}
          rightButtonText='Delete'
        />
      ),
    })
  }

  const onClickRow = (row: JobType, info: JobItemType) => {
    openModal({
      type: 'JobDetailViewModal',
      children: (
        <Box
          sx={{
            maxWidth: '1180px',
            width: '100%',
            maxHeight: '90vh',
            background: '#ffffff',
            boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
            borderRadius: '10px',
            overflow: 'scroll',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          <JobInfoDetailView
            row={row}
            orderDetail={orderDetail!}
            item={info}
            refetch={refetch}
          />
        </Box>
      ),
    })
  }

  useEffect(() => {
    // 선택된 행으로 스크롤하기

    if (jobDetails) {
      if (ref.current) {
        // console.log(ref.current)

        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })
      }
    }
  }, [jobDetails])

  const onClickBack = () => {
    //TODO 이전 페이지의 주소기반으로 라우팅 해야함, 무조건 back 할경우 사이드이펙이 나올수 있음
    router.back()
  }
  const Row = ({ info, index }: { info: JobItemType; index: number }) => {
    const [open, setOpen] = useState<boolean>(true)
    const separateLine = () => {
      return (
        <TableCell
          sx={{
            height: '54px',

            padding: '16px 0',
            textAlign: 'center',
            flex: 0.0096,
          }}
        >
          <img src='/images/icons/pro-icons/seperator.svg' alt='sep' />
        </TableCell>
      )
    }
    // console.log(info)

    return (
      <Card>
        <Box
          sx={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
          }}
        >
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <IconButton
              aria-label='expand row'
              size='small'
              onClick={() => setOpen(!open)}
            >
              <Icon icon={open ? 'mdi:chevron-up' : 'mdi:chevron-down'} />
            </IconButton>
            <Typography
              variant='body1'
              sx={{
                fontWeight: 600,
                display: 'flex',
                gap: '5px',
                alignItems: 'center',
              }}
            >
              {String(index + 1).padStart(2, '0')}. &nbsp;
              {languageHelper(info.sourceLanguage)}
              &nbsp;&rarr;&nbsp;
              {languageHelper(info.targetLanguage)}&nbsp;
              {info.itemName}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <Autocomplete
              fullWidth
              multiple
              sx={{
                width: '306px',
                '& .MuiInputBase-root': {
                  height: '46px',
                },
                '& .MuiChip-root': {
                  height: '24px',
                },
              }}
              disableCloseOnSelect
              isOptionEqualToValue={(option, newValue) => {
                return option.value === newValue.value
              }}
              onChange={(event, item) => {
                handleChangeServiceType(event, item, index)

                // ServiceTypePair
              }}
              value={serviceType[index] || []}
              options={ServiceTypeList}
              id='ServiceType'
              limitTags={1}
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  size='small'
                  placeholder={serviceType.length ? undefined : 'Service type'}
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} sx={{ mr: 2 }} />
                  {option.label}
                </li>
              )}
            />
            <Button
              variant='contained'
              sx={{ height: '38px' }}
              disabled={serviceType.length === 0}
              onClick={() => onClickAddJob(info.id, index)}
            >
              Add
            </Button>
          </Box>
        </Box>
        <Collapse in={open} timeout='auto' unmountOnExit>
          <Box sx={{ padding: '0px 20px 24px 20px' }}>
            <TableContainer component={Paper}>
              <Table aria-label='collapsible table'>
                <TableHead
                  sx={{
                    background: '#F5F5F7',
                    maxHeight: '54px',
                    textTransform: 'none',
                    width: '100%',
                    display: 'flex',
                  }}
                >
                  <TableRow
                    sx={{
                      maxHeight: '54px',
                      height: '54px',
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      background:
                        'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #666CFF;',
                    }}
                  >
                    <TableCell
                      sx={{
                        height: '54px',

                        fontWeight: '400 !important',
                        fontSize: '14px !important',
                        // paddingRight: '0 !important',
                        display: 'flex !important',
                        alignItems: 'center',
                        flex: 0.1205,
                        minWidth: '140px',
                      }}
                      size='small'
                    >
                      <Box>No.</Box>
                    </TableCell>
                    {separateLine()}

                    <TableCell
                      sx={{
                        height: '54px',

                        fontWeight: '400 !important',
                        fontSize: '14px !important',
                        // paddingRight: '0 !important',
                        display: 'flex',
                        alignItems: 'center',
                        flex: 0.241,
                        minWidth: '280px',
                      }}
                      size='small'
                    >
                      <Box>Job</Box>
                    </TableCell>
                    {separateLine()}

                    <TableCell
                      sx={{
                        height: '54px',

                        fontWeight: '400 !important',
                        fontSize: '14px !important',
                        // paddingRight: '0 !important',
                        display: 'flex',
                        alignItems: 'center',
                        flex: 0.1377,
                        minWidth: '149px',
                      }}
                      size='small'
                    >
                      <Box>Job status</Box>
                    </TableCell>
                    {separateLine()}

                    <TableCell
                      sx={{
                        height: '54px',

                        fontWeight: '400 !important',
                        fontSize: '14px !important',
                        // paddingRight: '0 !important',
                        display: 'flex',
                        alignItems: 'center',
                        flex: 0.3012,
                        minWidth: '350px',
                      }}
                      size='small'
                    >
                      <Box>Assigned Pro</Box>
                    </TableCell>
                    {separateLine()}

                    <TableCell
                      sx={{
                        height: '54px',

                        fontWeight: '400 !important',
                        fontSize: '14px !important',
                        // paddingRight: '0 !important',
                        display: 'flex',

                        alignItems: 'center',
                        flex: 0.1377,
                        minWidth: '160px',
                      }}
                      size='small'
                    >
                      <Box>Prices</Box>
                    </TableCell>

                    {separateLine()}
                    <TableCell
                      sx={{
                        height: '54px',

                        fontWeight: '400 !important',
                        fontSize: '14px !important',
                        // paddingRight: '0 !important',
                        display: 'flex',
                        alignItems: 'center',
                        flex: 0.062,
                        minWidth: '72px',
                      }}
                      size='small'
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {info.jobs.length > 0
                    ? info.jobs.map((row, index) => {
                        return (
                          <TableRow
                            key={uuidv4()}
                            sx={{
                              '& > *': { borderBottom: 'unset' },
                              maxHeight: '54px',
                              height: '54px',
                              display: 'flex',
                              cursor: 'pointer',
                              background:
                                row.id === Number(jobId!)
                                  ? 'rgba(76, 78, 100, 0.12)'
                                  : '#fff',
                            }}
                            // hover
                            onClick={() => {
                              onClickRow(row, info)
                            }}
                            ref={row.id === Number(jobId!) ? ref : null}
                          >
                            <TableCell
                              sx={{
                                height: '54px',

                                fontWeight: '400 !important',
                                fontSize: '14px !important',
                                // paddingRight: '0 !important',
                                display: 'flex !important',
                                alignItems: 'center',
                                flex: 0.1205,
                                minWidth: '140px',
                              }}
                              size='small'
                            >
                              <Box>{row.corporationId}</Box>
                            </TableCell>
                            {separateLine()}

                            <TableCell
                              sx={{
                                height: '54px',

                                fontWeight: '400 !important',
                                fontSize: '14px !important',
                                // paddingRight: '0 !important',
                                display: 'flex',
                                alignItems: 'center',
                                flex: 0.241,
                                minWidth: '280px',
                              }}
                              size='small'
                            >
                              <Box>
                                <ServiceTypeChip label={row.serviceType} />
                              </Box>
                            </TableCell>
                            {separateLine()}

                            <TableCell
                              sx={{
                                height: '54px',

                                fontWeight: '400 !important',
                                fontSize: '14px !important',
                                // paddingRight: '0 !important',
                                display: 'flex',
                                alignItems: 'center',
                                flex: 0.1377,
                                minWidth: '149px',
                              }}
                              size='small'
                            >
                              {JobsStatusChip(
                                row.status as JobStatusType,
                                statusList!,
                              )}
                            </TableCell>
                            {separateLine()}

                            <TableCell
                              sx={{
                                height: '54px',

                                fontWeight: '400 !important',
                                fontSize: '14px !important',
                                // paddingRight: '0 !important',
                                display: 'flex',
                                alignItems: 'center',
                                flex: 0.3012,
                                minWidth: '350px',
                              }}
                              size='small'
                            >
                              <Box>
                                {row.assignedPro ? (
                                  <LegalNameEmail
                                    row={{
                                      isOnboarded: true,
                                      isActive: true,

                                      firstName: row.assignedPro.firstName,
                                      middleName: row.assignedPro.middleName,
                                      lastName: row.assignedPro.lastName,
                                      email: row.assignedPro.email,
                                    }}
                                  />
                                ) : (
                                  '-'
                                )}
                              </Box>
                            </TableCell>
                            {separateLine()}

                            <TableCell
                              sx={{
                                height: '54px',

                                fontWeight: '400 !important',
                                fontSize: '14px !important',
                                // paddingRight: '0 !important',
                                display: 'flex',

                                alignItems: 'center',
                                flex: 0.1377,
                                minWidth: '160px',
                              }}
                              size='small'
                            >
                              <Box>{
                                row?.totalPrice 
                                  ? formatCurrency(
                                    row?.totalPrice,
                                    row?.currency!
                                    )
                                  : '-'
                                }
                              </Box>
                            </TableCell>

                            {separateLine()}
                            <TableCell
                              sx={{
                                height: '54px',

                                fontWeight: '400 !important',
                                fontSize: '14px !important',
                                // paddingRight: '0 !important',
                                display: 'flex',
                                alignItems: 'center',
                                flex: 0.062,
                                minWidth: '72px',
                              }}
                              size='small'
                            >
                              <IconButton
                                onClick={event => {
                                  event.stopPropagation()
                                  onClickRemoveJob(
                                    row.id,
                                    row.corporationId,
                                    row.name,
                                  )
                                }}
                              >
                                <Icon icon='mdi:trash'></Icon>
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    : NoList()}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Collapse>
      </Card>
    )
  }

  return (
    <Grid item xs={12} sx={{ pb: '100px' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            background: '#ffffff',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <IconButton
              sx={{ padding: '0 !important', height: '24px' }}
              onClick={() => onClickBack()}
            >
              <Icon icon='mdi:chevron-left' width={24} height={24} />
            </IconButton>

            <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Typography variant='h5'>Job details</Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <Typography variant='body2'>Linked order :</Typography>
            <Link href={`/orders/order-list/detail/${jobDetails?.id}`}>
              <Typography fontSize={15} fontWeight={500} color={'#6D788D'}>
                {jobDetails?.cooperationId}
              </Typography>
            </Link>
          </Box>
        </Box>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {jobDetails?.items.map((value, index) => {
              return <Row info={value} key={uuidv4()} index={index} />
            })}
          </Box>
        </Card>
      </Box>
    </Grid>
  )
}

export default JobDetails

JobDetails.acl = {
  subject: 'job_list',
  action: 'read',
}
