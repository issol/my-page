import {
  Badge,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material'
import {
  AssignProFilterPostType,
  AssignProFilterType,
  AssignProListType,
} from '@src/types/orders/job-detail'
import { ProListFilterType } from '@src/types/pro/list'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import AssignProFilters from './filters'
import AssignProListPage from './list'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { CategoryList } from '@src/shared/const/category/categories'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import {
  useGetAssignableProList,
  useGetContactProList,
} from '@src/queries/order/job.query'

import {
  GridCallbackDetails,
  GridColumns,
  GridSelectionModel,
} from '@mui/x-data-grid'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import {
  AssignmentStatusChip,
  ProStatusChip,
  assignmentStatusChip,
} from '@src/@core/components/chips/chips'
import { Icon } from '@iconify/react'
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { UserDataType } from '@src/context/types'
import useModal from '@src/hooks/useModal'
import Message from './message'
import { JobItemType, JobType } from '@src/types/common/item.type'
import SourceFileUpload from './source-file'
import languageHelper from '@src/shared/helpers/language.helper'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters,
  useMutation,
} from 'react-query'
import { ServiceTypeToProRole } from '@src/shared/const/role/roles'
import { assignJob, requestJobToPro } from '@src/apis/job-detail.api'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import toast from 'react-hot-toast'

const defaultValues: AssignProFilterType = {
  source: [],
  target: [],
  expertise: [],
  category: [],
  serviceType: [],
  client: [],
  search: '',
}

const defaultFilters: AssignProFilterPostType = {
  take: 5,
  skip: 0,
  search: '',
  source: [],
  target: [],
  expertise: [],
  category: [],
  serviceType: [],
  client: [],
  isOffBoard: true,
}

type Props = {
  user: UserDataType
  row: JobType
  orderDetail: ProjectInfoType
  type: string
  assignProList?: { data: AssignProListType[]; totalCount: number }
  item: JobItemType
  refetch?: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      {
        id: number
        cooperationId: string
        items: JobItemType[]
      },
      unknown
    >
  >
}

const AssignPro = ({
  user,
  row,
  orderDetail,
  type,
  assignProList,
  item,
  refetch,
}: Props) => {
  const [proListPage, setProListPage] = useState<number>(0)
  const [proListPageSize, setProListPageSize] = useState<number>(5)
  const [hideOffBoard, setHideOffBoard] = useState<boolean>(true)
  const jobId = row.id

  const { openModal, closeModal } = useModal()

  const [proList, setProList] = useState<
    | {
        totalCount: number
        data: AssignProListType[]
        count: number
      }
    | undefined
  >()
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])

  const [filters, setFilters] = useState<AssignProFilterPostType>({
    source: [],
    target: [],
    expertise: [],
    category: [],
    serviceType: [],
    client: [],
    take: proListPageSize,
    skip: proListPage * proListPageSize,
    isOffBoard: hideOffBoard,
    // sortId: 'DESC',
    // sortDate: 'DESC',
  })
  console.log('orderDetail', orderDetail)
  const {
    data: AssignableProList,
    isLoading: isAssignableProListLoading,
    refetch: refetchAssignableProList,
  } = useGetAssignableProList(
    row.id,
    filters,
    type === 'history' ? true : false,
  )

  const {
    data: contactProList,
    isLoading: isContactProListLoading,
    refetch: refetchContactProList,
  } = useGetContactProList(row.id)

  const requestJobMutation = useMutation(
    (data: { ids: number[]; jobId: number }) =>
      requestJobToPro(data.ids, data.jobId),
    {
      onSuccess: () => {
        refetchAssignableProList()
        refetchContactProList()
      },
    },
  )

  const assignJobMutation = useMutation(
    (data: { jobId: number; proId: number }) =>
      assignJob(data.jobId, data.proId),
    {
      onSuccess: () => {
        refetchAssignableProList()
        refetchContactProList()
      },
    },
  )

  useEffect(() => {
    if (
      AssignableProList &&
      !isAssignableProListLoading &&
      contactProList &&
      !isContactProListLoading
    ) {
      setProList({
        data: [...contactProList.data, ...AssignableProList.data],
        count: AssignableProList.count + contactProList.count,
        totalCount: AssignableProList.totalCount + contactProList.totalCount,
      })
    }
    console.log('proList', proList)
  }, [
    AssignableProList,
    isAssignableProListLoading,
    contactProList,
    isContactProListLoading,
  ])
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)
  const languageList = getGloLanguage()

  const { control, handleSubmit, trigger, reset, setValue, getValues } =
    useForm<AssignProFilterType>({
      defaultValues,
      mode: 'onSubmit',
    })

  function isFiltersDifferent(): boolean {
    // console.log(filters.source)

    const res =
      filters.source!.length > 0 ||
      filters.target!.length > 0 ||
      filters.expertise!.length > 0 ||
      filters.category!.length > 0 ||
      filters.serviceType!.length > 0 ||
      // filters.client!.length > 0 &&
      !filters.isOffBoard

    // console.log(res)

    // console.log(res)

    return res
  }

  const handleSelectionModelChange = (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails<any>,
  ) => {
    setSelectionModel(selectionModel)
  }

  const handleRequestPro = () => {
    // TODO API call
    const res = selectionModel.map((value: any) => {
      return Number(value)
    })
    // console.log(res)

    requestJobMutation.mutate({ ids: res, jobId: row.id })
    closeModal('AssignProRequestJobModal')
  }

  const handleAssignJob = (jobId: number, proId: number) => {
    assignJobMutation.mutate(
      { jobId: jobId, proId: proId },
      {
        onSuccess: () => {
          closeModal('AssignProJobModal')
        },
        onError: () => {
          closeModal('AssignProJobModal')
          toast.error('Something went wrong. Please try again.', {
            position: 'bottom-left',
          })
        },
      },
    )
  }

  const onClickAssignJob = (jobId: number, proId: number, name: string) => {
    openModal({
      type: 'AssignProJobModal',
      children: (
        <CustomModal
          onClose={() => closeModal('AssignProJobModal')}
          title={
            <>
              Are you sure you want to assign the job to selected Pro?
              <Typography variant='body2' fontSize={16} fontWeight={600}>
                {name}
              </Typography>
            </>
          }
          onClick={() => handleAssignJob(jobId, proId)}
          vary='successful'
          rightButtonText='Assign'
        />
      ),
    })
  }

  const onClickRequestJob = () => {
    if (!!item.itemName) {
      openModal({
        type: 'AssignProRequestJobModal',
        children: (
          <CustomModal
            onClose={() => closeModal('AssignProRequestJobModal')}
            title='Are you sure you want to request the job to selected Pro(s)?'
            vary='successful'
            rightButtonText='Request'
            onClick={handleRequestPro}
          ></CustomModal>
        ),
      })
    } else {
      openModal({
        type: 'AssignDenyModal',
        children: (
          <CustomModal
            onClose={() => closeModal('AssignDenyModal')}
            title='Please enter all required fields to make a request.'
            vary='error'
            soloButton={true}
            rightButtonText='Okey'
            onClick={() => {
              //TODO Job info 탭으로 이동하는거 추가해야 함
              closeModal('AssignDenyModal')
            }}
          ></CustomModal>
        ),
      })
    }
  }

  useEffect(() => {
    setValue('source', [
      { value: row.sourceLanguage, label: languageHelper(row.sourceLanguage)! },
    ])
    setValue('target', [
      { value: row.targetLanguage, label: languageHelper(row.targetLanguage)! },
    ])
    setValue('category', [
      {
        value: orderDetail.category,
        label: orderDetail.category,
      },
    ])
    setValue('serviceType', [
      {
        value: row.serviceType,
        label: row.serviceType,
      },
    ])
    setValue(
      'expertise',
      orderDetail.expertise?.map(value => ({
        value: value,
        label: value,
      })),
    )
    //@ts-ignore
    const serviceTypeToPro = ServiceTypeToProRole[row.serviceType].map(
      (value: any) => value.value,
    )
    // console.log(serviceTypeToPro)

    setFilters(prevState => ({
      ...prevState,
      source: [row.sourceLanguage],
      target: [row.targetLanguage],
      category: [orderDetail.category],
      //@ts-ignore
      serviceType: serviceTypeToPro,
      expertise: orderDetail.expertise,
    }))
  }, [row, orderDetail, setValue])

  const onClickResetButton = () => {
    reset(defaultValues)

    setFilters(defaultFilters)
  }

  // console.log(AssignProList)

  const onSubmit = () => {
    const data = getValues()

    const res: AssignProFilterPostType = {
      source: data.source?.map(value => value.value),
      target: data.target?.map(value => value.value),
      category: data.category?.map(value => value.value),
      serviceType: data.serviceType?.map(value => value.value),
      expertise: data.expertise?.map(value => value.value) ?? '',
      client: data.client?.map(value => value.value),
      search: data.search,
      take: proListPageSize,
      skip: proListPage * proListPageSize,
      isOffBoard: hideOffBoard,
    }

    setFilters(res)
  }

  const onClickMessage = (info: AssignProListType) => {
    closeModal('JobDetailViewModal')
    openModal({
      type: 'AssignProMessageModal',
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
          <Message
            info={info}
            user={user}
            row={row}
            orderDetail={orderDetail}
            item={item}
            refetch={refetch!}
          />
        </Box>
      ),
    })
  }

  const onClickSourceFileToPro = (info: AssignProListType) => {
    closeModal('JobDetailViewModal')
    openModal({
      type: 'SourceFileUploadModal',
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
          <SourceFileUpload
            info={info}
            row={row}
            orderDetail={orderDetail}
            item={item}
            refetch={refetch!}
          />
        </Box>
      ),
    })
  }
  useEffect(() => {
    // console.log(proListPageSize)
  }, [proListPageSize])

  const columns: GridColumns<AssignProListType> = [
    {
      minWidth: 310,
      field: 'name',
      headerName: 'Legal name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Legal name / Email</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        return (
          <LegalNameEmail
            row={{
              isOnboarded: true,
              isActive: true,

              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
              email: row.email,
            }}
          />
        )
      },
    },
    {
      minWidth: 180,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        // return <ProStatusChip status={row.status} label={row.status} />
        return row.status
      },
    },
    {
      minWidth: 170,
      field: 'responseRate',
      headerName: 'Response rate',
      hideSortIcons: true,
      disableColumnMenu: true,
      align: 'center',
      sortable: false,
      renderHeader: () => <Box>Response rate</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        return <Box>{row.responseRate ?? '-'} %</Box>
      },
    },
    {
      minWidth: 110,
      field: 'message',
      headerName: 'Message',
      hideSortIcons: true,
      disableColumnMenu: true,
      align: 'center',
      sortable: false,
      renderHeader: () => <Box>Message</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        return (
          <Badge badgeContent={row.message?.unReadCount} color='primary'>
            <IconButton
              sx={{ padding: 0 }}
              disabled={row.assignmentStatus === null}
              onClick={() => onClickMessage(row)}
            >
              <Icon
                icon='material-symbols:chat'
                color='rgba(76, 78, 100, 0.87)'
              />
            </IconButton>
          </Badge>
        )
      },
    },

    {
      minWidth: 260,
      field: 'assignmentStatus',
      headerName: 'Assignment status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Assignment status</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        return (
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {row.assignmentStatus
              ? // <AssignmentStatusChip
                //   label={row.assignmentStatus}
                //   status={row.assignmentStatus}
                // />
                assignmentStatusChip(Number(row.assignmentStatus))
              : '-'}
            {row.assignmentStatus === 60200 && (
              <Button
                variant='outlined'
                sx={{ height: '30px' }}
                size='small'
                onClick={() =>
                  onClickAssignJob(
                    jobId,
                    row.userId,
                    getLegalName({
                      firstName: row.firstName,
                      middleName: row.middleName,
                      lastName: row.lastName,
                    }),
                  )
                }
              >
                Assign
              </Button>
            )}
            {row.assignmentStatus === 60500 && (
              <IconButton onClick={() => onClickSourceFileToPro(row)}>
                <Icon icon='ic:outline-upload-file' color='#666cff' />
              </IconButton>
            )}
          </Box>
        )
      },
    },

    {
      minWidth: 240,
      field: 'assignmentDate',
      headerName: 'Assignment date',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        return (
          <Box>
            {row.assignmentStatus
              ? FullDateTimezoneHelper(row.assignmentDate, user.timezone)
              : '-'}
          </Box>
        )
      },
    },
  ]

  const historyColumns: GridColumns<AssignProListType> = [
    {
      minWidth: 310,
      field: 'name',
      headerName: 'Legal name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Legal name / Email</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        return (
          <LegalNameEmail
            row={{
              isOnboarded: true,
              isActive: true,

              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
              email: row.email,
            }}
          />
        )
      },
    },
    {
      minWidth: 180,
      field: 'status',
      headerName: 'Status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Status</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        // return <ProStatusChip status={row.status} label={row.status} />
        return row.status
      },
    },
    {
      minWidth: 170,
      field: 'responseRate',
      headerName: 'Response rate',
      hideSortIcons: true,
      disableColumnMenu: true,
      align: 'center',
      sortable: false,
      renderHeader: () => <Box>Response rate</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        return <Box>{row.responseRate ?? '-'} %</Box>
      },
    },

    {
      minWidth: 260,
      field: 'assignmentStatus',
      headerName: 'Assignment status',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Assignment status</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        return (
          <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            {row.assignmentStatus ? (
              <AssignmentStatusChip
                label={row.assignmentStatus}
                status={row.assignmentStatus}
              />
            ) : (
              '-'
            )}
          </Box>
        )
      },
    },

    {
      minWidth: 240,
      field: 'assignmentDate',
      headerName: 'Assignment date',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Date & Time</Box>,
      renderCell: ({ row }: { row: AssignProListType }) => {
        return (
          <Box>
            {row.assignmentStatus
              ? FullDateTimezoneHelper(row.assignmentDate, user.timezone)
              : '-'}
          </Box>
        )
      },
    },
  ]

  return (
    <Box>
      {type === 'history' ? null : (
        <AssignProFilters
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          filters={filters}
          setFilters={setFilters}
          onReset={onClickResetButton}
          serviceTypeList={serviceTypeList}
          setServiceTypeList={setServiceTypeList}
          categoryList={categoryList}
          setCategoryList={setCategoryList}
          trigger={trigger}
          languageList={languageList}
        />
      )}

      <AssignProListPage
        listCount={
          isFiltersDifferent() ? proList?.count! : proList?.totalCount!
        }
        list={proList?.data!}
        columns={type === 'history' ? historyColumns : columns}
        setFilters={setFilters}
        setPageSize={setProListPageSize}
        setPage={setProListPage}
        isLoading={isAssignableProListLoading}
        page={proListPage}
        pageSize={proListPageSize}
        hideOffBoard={hideOffBoard}
        setHideOffBoard={setHideOffBoard}
        selectionModel={selectionModel}
        handleSelectionModelChange={handleSelectionModelChange}
        onClickRequestJob={onClickRequestJob}
        type={type}
        jobInfo={row}
      />
    </Box>
  )
}

export default AssignPro
