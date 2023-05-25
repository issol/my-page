import { Badge, Box, Button, IconButton, Tooltip } from '@mui/material'
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
import { useGetAssignProList } from '@src/queries/order/job.query'

import {
  GridCallbackDetails,
  GridColumns,
  GridSelectionModel,
} from '@mui/x-data-grid'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import {
  AssignmentStatusChip,
  ProStatusChip,
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

const defaultValues: AssignProFilterType = {
  source: [],
  target: [],
  areaOfExpertise: [],
  category: [],
  serviceType: [],
  client: [],
  search: '',
}

const defaultFilters: AssignProFilterPostType = {
  take: 10,
  skip: 0,
  search: '',
  source: [],
  target: [],
  areaOfExpertise: [],
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
}

const AssignPro = ({
  user,
  row,
  orderDetail,
  type,
  assignProList,
  item,
}: Props) => {
  const [proListPage, setProListPage] = useState<number>(0)
  const [proListPageSize, setProListPageSize] = useState<number>(5)
  const [hideOffBoard, setHideOffBoard] = useState<boolean>(true)

  const { openModal, closeModal } = useModal()

  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])

  const [filters, setFilters] = useState<AssignProFilterPostType>({
    source: [],
    target: [],
    areaOfExpertise: [],
    category: [],
    serviceType: [],
    client: [],
    take: proListPageSize,
    skip: proListPage * proListPageSize,
    isOffBoard: hideOffBoard,
    // sortId: 'DESC',
    // sortDate: 'DESC',
  })

  const { data: AssignProList, isLoading } = useGetAssignProList(
    row.id,
    filters,
  )
  const [serviceTypeList, setServiceTypeList] = useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)
  const languageList = getGloLanguage()

  const { control, handleSubmit, trigger, reset, setValue } =
    useForm<AssignProFilterType>({
      defaultValues,
      mode: 'onSubmit',
    })

  const handleSelectionModelChange = (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails<any>,
  ) => {
    setSelectionModel(selectionModel)
  }

  const handleRequestPro = () => {
    // TODO API call
    closeModal('AssignProRequestJobModal')
  }

  const onClickRequestJob = () => {
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
      'areaOfExpertise',
      orderDetail.expertise.map(value => ({
        value: value,
        label: value,
      })),
    )

    setFilters(prevState => ({
      ...prevState,
      source: [row.sourceLanguage],
      target: [row.targetLanguage],
      category: [orderDetail.category],
      serviceType: [row.serviceType],
      areaOfExpertise: orderDetail.expertise,
    }))
  }, [row, orderDetail, setValue])

  const onClickResetButton = () => {
    reset(defaultValues)

    setFilters(defaultFilters)
  }

  const onSubmit = (data: AssignProFilterType) => {
    console.log('submit')
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
          />
        </Box>
      ),
    })
  }

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
              id: row.id,
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
        return <ProStatusChip status={row.status} label={row.status} />
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
            {row.assignmentStatus ? (
              <AssignmentStatusChip
                label={row.assignmentStatus}
                status={row.assignmentStatus}
              />
            ) : (
              '-'
            )}
            {row.assignmentStatus === 'Request accepted' && (
              <Button variant='outlined' sx={{ height: '30px' }} size='small'>
                Assign
              </Button>
            )}
            {row.assignmentStatus === 'Assigned' && (
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
              id: row.id,
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
        return <ProStatusChip status={row.status} label={row.status} />
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
          type === 'history'
            ? assignProList?.totalCount!
            : AssignProList?.totalCount!
        }
        list={type === 'history' ? assignProList?.data! : AssignProList?.data!}
        columns={type === 'history' ? historyColumns : columns}
        setFilters={setFilters}
        setPageSize={setProListPageSize}
        setRowsPerPage={setProListPage}
        isLoading={isLoading}
        pageSize={proListPageSize}
        rowsPerPage={proListPage}
        hideOffBoard={hideOffBoard}
        setHideOffBoard={setHideOffBoard}
        selectionModel={selectionModel}
        handleSelectionModelChange={handleSelectionModelChange}
        onClickRequestJob={onClickRequestJob}
        type={type}
      />
    </Box>
  )
}

export default AssignPro
