import {
  Autocomplete,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  OutlinedInput,
  Popover,
  Switch,
  TextField,
  Tooltip,
  Typography,
  styled,
} from '@mui/material'
import {
  DataGrid,
  GridCallbackDetails,
  GridSelectionModel,
} from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { Icon } from '@iconify/react'

import {
  useGetLinguistTeam,
  useGetLinguistTeamDetail,
} from '@src/queries/pro/linguist-team'
import {
  getProJobAssignColumns,
  getProJobAssignColumnsForRequest,
} from '@src/shared/const/columns/pro-job-assgin'
import { JobType } from '@src/types/common/item.type'
import {
  LinguistTeamDetailType,
  LinguistTeamProListFilterType,
} from '@src/types/pro/linguist-team'
import { ProListType } from '@src/types/pro/list'
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { TabType } from '../..'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import _, { round } from 'lodash'
import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import {
  ServiceTypeList,
  ServiceTypePair,
} from '@src/shared/const/service-type/service-types'
import {
  CategoryList,
  CategoryListPair,
} from '@src/shared/const/category/categories'
import { Category } from '@src/shared/const/category/category.enum'
import { AreaOfExpertiseList } from '@src/shared/const/area-of-expertise/area-of-expertise'
import {
  JobAssignProRequestsType,
  JobRequestsProType,
} from '@src/types/jobs/jobs.type'
import select from '@src/@core/theme/overrides/select'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { authState } from '@src/states/auth'
import useModal from '@src/hooks/useModal'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { useRouter } from 'next/router'
import Message from './message-modal'
import { UseMutationResult, useQueryClient } from 'react-query'
import { useGetStatusList } from '@src/queries/common.query'
import { request } from 'http'
import {
  AssignProFilterPostType,
  AssignProListType,
} from '@src/types/orders/job-detail'
import { job_list } from '@src/shared/const/permission-class'
import { AbilityContext } from '@src/layouts/components/acl/Can'

type Props = {
  jobInfo: JobType
  jobAssign: JobAssignProRequestsType[]
  serviceTypeList: Array<{ value: number; label: string }>
  clientList: Array<{ clientId: number; name: string }>
  selectedRows: {
    [key: string]: {
      data: Array<ProListType | AssignProListType>
      isPrivate?: boolean
      isPrioritized?: boolean
    }
  }
  setSelectedRows: Dispatch<
    SetStateAction<{
      [key: string]: {
        data: Array<ProListType | AssignProListType>
        isPrivate?: boolean
        isPrioritized?: boolean
      }
    }>
  >
  selectionModel: { [key: string]: GridSelectionModel }
  setSelectionModel: Dispatch<
    SetStateAction<{ [key: string]: GridSelectionModel }>
  >
  isLoading: boolean
  linguistTeamList: Array<{ value: number; label: string }>
  selectedLinguistTeam: { value: number; label: string } | null
  detail: LinguistTeamDetailType
  setSelectedLinguistTeam: Dispatch<
    SetStateAction<{ value: number; label: string } | null>
  >
  menu: TabType
  setMenu: Dispatch<SetStateAction<TabType>>

  proList: { data: Array<AssignProListType>; totalCount: number; count: number }
  setPastLinguistTeam: Dispatch<
    SetStateAction<{
      value: number
      label: string
    } | null>
  >
  pastLinguistTeam: { value: number; label: string } | null
  filter: AssignProFilterPostType
  setFilter: Dispatch<SetStateAction<AssignProFilterPostType>>
  setActiveFilter: Dispatch<SetStateAction<AssignProFilterPostType>>
  activeFilter: AssignProFilterPostType
  languageList: {
    value: string
    label: GloLanguageEnum
  }[]
  onSearch: () => void
  roundQuery: string | undefined
  proId: string | undefined
  addRoundMode: boolean
  setAddRoundMode: Dispatch<SetStateAction<boolean>>
  addProsMode: boolean
  setAddProsMode: Dispatch<SetStateAction<boolean>>
  assignProMode: boolean
  setAssignProMode: Dispatch<SetStateAction<boolean>>
  selectedAssign: JobAssignProRequestsType | null
  setSelectedAssign: Dispatch<SetStateAction<JobAssignProRequestsType | null>>
  assignJobMutation: UseMutationResult<
    void,
    unknown,
    {
      jobId: number
      proId: number
      status: number
      type: 'force' | 'normal'
    },
    unknown
  >
  reAssignJobMutation: UseMutationResult<
    {
      id: number
    },
    unknown,
    {
      jobId: number
    },
    unknown
  >
}

function loadServerRows(
  page: number,
  pageSize: number,
  data: ProListType[],
): Promise<any> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data.slice(page * pageSize, (page + 1) * pageSize))
    }, 500)
  })
}

const AssignPro = ({
  jobInfo,
  jobAssign,
  serviceTypeList,
  clientList,
  selectedRows,
  setSelectedRows,
  selectionModel,
  setSelectionModel,
  isLoading,
  linguistTeamList,
  selectedLinguistTeam,
  detail,
  setSelectedLinguistTeam,
  menu,
  setMenu,

  proList,
  setPastLinguistTeam,
  pastLinguistTeam,
  filter,
  setFilter,
  setActiveFilter,
  activeFilter,
  languageList,
  onSearch,
  roundQuery,
  proId,
  addRoundMode,
  setAddRoundMode,
  addProsMode,
  setAddProsMode,
  assignProMode,
  setAssignProMode,
  selectedAssign,
  setSelectedAssign,
  assignJobMutation,
  reAssignJobMutation,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const ability = useContext(AbilityContext)

  const [detailAnchorEl, setDetailAnchorEl] = useState<{
    el: HTMLButtonElement | null
    id: number | null
  }>({ el: null, id: null })
  const [selectedUser, setSelectedUser] = useState<{
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
    jobReqId: number | null
  } | null>(null)

  const [listAnchorEl, setListAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  )
  const auth = useRecoilValueLoadable(authState)
  const timezoneList = useRecoilValueLoadable(timezoneSelector)
  const { data: jobStatusList, isLoading: statusListLoading } =
    useGetStatusList('JobAssignment')

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<{
    [key: string]: Array<ProListType | AssignProListType>
  }>({})
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [sourceMultiple, setSourceMultiple] = useState<boolean>(false)
  const [targetMultiple, setTargetMultiple] = useState<boolean>(false)
  const [serviceTypeFormList, setServiceTypeFormList] =
    useState(ServiceTypeList)
  const [categoryList, setCategoryList] = useState(CategoryList)

  const [proIdQuery, setProIdQuery] = useState<number | null>(null)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleDetailClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    row: {
      userId: number
      firstName: string
      middleName?: string | null
      lastName: string
      assignmentStatus: number
      jobReqId: number | null
    },
  ) => {
    setDetailAnchorEl({ id: row.userId, el: event.currentTarget })
    setSelectedUser(row)
  }

  const handleDetailClose = () => {
    setDetailAnchorEl({ id: null, el: null })
  }

  const handleListClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setListAnchorEl(event.currentTarget)
  }

  const handleListClose = () => {
    setListAnchorEl(null)
  }

  const handleAssign = (
    row: {
      userId: number
      firstName: string
      middleName?: string | null
      lastName: string
      assignmentStatus: number
      jobReqId: number | null
    },
    requestType: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign',
  ) => {
    console.log(row.userId, 'getId')

    assignJobMutation.mutate({
      jobId:
        requestType === 'bulkManualAssign' && row.assignmentStatus === 70100
          ? row.jobReqId!
          : jobInfo.id,
      proId: row.userId,
      status: 70300,
      type:
        requestType === 'bulkManualAssign' && row.assignmentStatus === 70100
          ? 'normal'
          : 'force',
    })
  }

  const handleCancelRequest = (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
    jobReqId: number | null
  }) => {
    closeModal('CancelRequestProModal')
    assignJobMutation.mutate({
      jobId: row.jobReqId!,
      proId: row.userId,
      status: 70500,
      type: 'normal',
    })
  }

  const handleReAssign = () => {
    closeModal('ReAssignProModal')
    reAssignJobMutation.mutate({
      jobId: jobInfo.id,
    })
  }

  const onClickAssign = (
    row: {
      userId: number
      firstName: string
      middleName?: string | null
      lastName: string
      assignmentStatus: number
      jobReqId: number | null
    },
    requestType: 'relayRequest' | 'bulkAutoAssign' | 'bulkManualAssign',
  ) => {
    console.log(row, 'row')

    openModal({
      type: 'AssignProModal',
      children: (
        <CustomModalV2
          title='Assign Pro?'
          subtitle={
            <>
              Are you sure you want to assign{' '}
              <Typography fontWeight={600} color='#666CFF'>
                {getLegalName({
                  firstName: row.firstName,
                  lastName: row.lastName,
                  middleName: row.middleName,
                })}
              </Typography>{' '}
              to this job? Other request(s) will be terminated.
            </>
          }
          onClick={() => {
            handleAssign(row, requestType)
          }}
          onClose={() => closeModal('AssignProModal')}
          rightButtonText='Assign'
          vary='successful'
        />
      ),
    })
  }

  const onClickCancel = (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
    jobReqId: number | null
  }) => {
    openModal({
      type: 'CancelRequestProModal',
      children: (
        <CustomModalV2
          title='Cancel request?'
          subtitle={
            'Are you sure you want to cancel the job request of this Pro?'
          }
          onClick={() => {
            handleCancelRequest(row)
          }}
          onClose={() => closeModal('CancelRequestProModal')}
          rightButtonText='Cancel request'
          leftButtonText='No'
          vary='error-alert'
        />
      ),
    })
  }

  const onClickReAssign = (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
    jobReqId: number | null
  }) => {
    openModal({
      type: 'ReAssignProModal',
      children: (
        <CustomModalV2
          title='Re-assign Pro?'
          subtitle={
            'Are you sure you want to re-assign Pro? The assignment of the current Pro will be canceled.'
          }
          onClick={() => {
            handleReAssign()
          }}
          onClose={() => closeModal('ReAssignProModal')}
          rightButtonText='Re-assign'
          vary='error-alert'
        />
      ),
    })
  }

  const onClickMessage = (row: {
    userId: number
    firstName: string
    middleName?: string | null
    lastName: string
    assignmentStatus: number
    jobReqId: number | null
  }) => {
    openModal({
      type: 'AssignProMessageModal',
      children: (
        <Message
          jobId={jobInfo.id}
          info={{
            userId: row.userId,
            firstName: row.firstName,
            lastName: row.lastName,
            middleName: row.middleName ?? null,
          }}
          onClose={() => closeModal('AssignProMessageModal')}
        />
      ),
    })
  }

  const onReset = () => {
    setServiceTypeFormList(ServiceTypeList)
    setCategoryList(CategoryList)
    setFilter({
      source: [],
      target: [],

      client: [],
      take: 10,
      skip: 0,
      genre: [],
      serviceType: [],
      category: [],
      isOffBoard: '1',
    })
    setActiveFilter({
      source: [],
      target: [],

      client: [],
      take: 10,
      skip: 0,
      genre: [],
      serviceType: [],
      category: [],
      isOffBoard: '1',
    })
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const handleSelectionModelChange = (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails<any>,
  ) => {
    if (detail && menu === 'linguistTeam') {
      const selectedPros =
        detail?.pros.filter(pro => selectionModel.includes(pro.userId)) ?? []

      setSelectedRows(prev => {
        if (detail?.isPrioritized) {
          selectedPros.sort((a, b) => a.order! - b.order!)
        } else {
          // detail.isPrioritized가 false이면 selectionModel의 순서에 따라 정렬합니다.
          selectedPros.sort(
            (a, b) =>
              selectionModel.indexOf(a.userId) -
              selectionModel.indexOf(b.userId),
          )
        }

        // 기존 데이터와 새로운 데이터를 합칩니다.
        const newData = [...selectedPros]

        return {
          ...prev,
          [selectedLinguistTeam?.label || '']: {
            data: newData,
            isPrivate: detail.isPrivate,
            isPrioritized: detail.isPrioritized,
          },
        }
      })

      const result = {
        [selectedLinguistTeam?.label || '']: selectionModel,
      }

      setSelectionModel(prev => ({ ...prev, ...result }))
    } else if (menu === 'pro' && proList.data.length > 0) {
      const selectedPros =
        proList.data.filter(pro => selectionModel.includes(pro.userId)) ?? []
      setSelectedRows(prev => {
        // detail.isPrioritized가 false이면 selectionModel의 순서에 따라 정렬합니다.
        selectedPros.sort(
          (a, b) =>
            selectionModel.indexOf(a.userId) - selectionModel.indexOf(b.userId),
        )

        // 기존 데이터에서 데이터 영역만 추출합니다.
        const prevData = prev[selectedLinguistTeam?.label || '']?.data || []
        // 선택된 값과 비교해서 삭제된 값을 필터하여 제거합니다. 추가된 것은 반영하지 않습니다.
        const prevFilteredData = prevData.filter(
          pro => selectionModel.includes(pro.userId),
        )
        
        // 기존 데이터와 새로운 데이터를 합칩니다.
        const newData = [
          ...prevFilteredData,
          // prevFilteredData와 비교하여 새롭게 추가된 항목만 추가합니다.
          ...selectedPros.filter(
            pro => !prevFilteredData.map(prevPro => prevPro.userId).includes(pro.userId),
          )
        ]

        return {
          ...prev,
          [selectedLinguistTeam?.label || '']: {
            data: newData,
          },
        }
      })

      const result = {
        [selectedLinguistTeam?.label || '']: selectionModel,
      }
      console.log("result",result)
      setSelectionModel(prev => ({ ...prev, ...result }))
    }
  }

  useEffect(() => {
    let active = true

    ;(async () => {
      if (detail && detail.pros) {
        setLoading(true)
        const newRows = await loadServerRows(page, pageSize, detail.pros || [])

        if (!active) {
          return
        }

        setRows(prev => {
          return {
            ...prev,
            [selectedLinguistTeam?.label || '']: newRows,
          }
        })
        setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [page, detail, pageSize])

  useEffect(() => {
    if (proList && proList.data && menu === 'pro') {
      console.log(proList.data)

      setRows(prev => {
        return {
          ...prev,
          [selectedLinguistTeam?.label || '']:
            proList.data as AssignProListType[],
        }
      })
    }
  }, [proList, filter.take, filter.skip, menu])

  useEffect(() => {
    if (
      selectedRows[selectedLinguistTeam?.label || '']?.data.map(
        pro => pro.userId,
      )
    ) {
      setSelectionModel(prev => ({
        ...prev,
        [selectedLinguistTeam?.label || '']:
          selectedRows[selectedLinguistTeam?.label || '']?.data.map(
            pro => pro.userId,
          ) || [],
      }))
    }
  }, [selectedLinguistTeam])

  useEffect(() => {
    if (proId) {
      setProIdQuery(Number(proId))
    }
  }, [proId])

  console.log(selectedAssign, 'rows')

  return (
    <>
      {jobAssign &&
      jobAssign.length > 0 &&
      !addRoundMode &&
      !addProsMode &&
      !assignProMode ? (
        <Box sx={{ height: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              padding: '20px',
              justifyContent: 'flex-end',
              gap: '16px',
            }}
          >
            {jobAssign.map((assign, index) => {
              return (
                <Button
                  key={index}
                  variant='outlined'
                  color='secondary'
                  sx={{
                    borderRadius: '100px',
                    border:
                      selectedAssign?.round === assign.round
                        ? '1.5px solid #4C4E64'
                        : '1px solid #8D8E9A',
                    color:
                      selectedAssign?.round === assign.round
                        ? '#4C4E64'
                        : '#8D8E9A',
                  }}
                  onClick={() => setSelectedAssign(assign)}
                >
                  Round{assign.round}
                </Button>
              )
            })}

            {jobAssign.some(
              job =>
                job.pros &&
                Array.isArray(job.pros) &&
                job.pros.some(pro => pro.assignmentStatus === 70300),
            ) ? null : (
              <Button
                variant='outlined'
                color='secondary'
                sx={{
                  borderRadius: '100px',
                  border: '1px solid #8D8E9A',
                  color: '#8D8E9A',
                }}
                // TODO 새로운 페이지 추가 액션
                onClick={() => {
                  setSelectedAssign(null)
                  queryClient.invalidateQueries(['assignProList'])
                  setAddRoundMode(true)
                  setRows({})
                  setSelectionModel({})
                  setSelectedRows({})
                }}
              >
                + Round{jobAssign.length + 1}
              </Button>
            )}
          </Box>
          {selectedAssign ? (
            <Box
              sx={{
                padding: '20px',
                justifyContent: 'space-between',
                alignItems: 'center',
                display: 'flex',
                borderTop: '1px solid #E9EAEC',
              }}
            >
              <Typography fontSize={16} fontWeight={600}>
                {selectedAssign?.type === 'relayRequest'
                  ? `Relay request (${selectedAssign?.pros.length ?? 0})`
                  : selectedAssign?.type === 'bulkAutoAssign'
                    ? `Mass request (First come first serve) (${selectedAssign?.pros.length ?? 0})`
                    : selectedAssign?.type === 'bulkManualAssign'
                      ? `Mass request (Manual assignment) (${selectedAssign?.pros.length ?? 0})`
                      : ''}{' '}
              </Typography>
              <Box>
                <IconButton
                  sx={{ width: '24px', height: '24px', padding: 0 }}
                  onClick={handleListClick}
                >
                  <Icon icon='mdi:dots-horizontal' />
                </IconButton>
                <Menu
                  elevation={8}
                  anchorEl={listAnchorEl}
                  id='customized-menu'
                  onClose={handleListClose}
                  open={Boolean(listAnchorEl)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  {selectedAssign.requestCompleted ? null : (
                    <MenuItem
                      sx={{
                        gap: 2,
                        '&:hover': {
                          background: 'inherit',
                          cursor: 'default',
                        },
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        padding: 0,
                      }}
                    >
                      <Button
                        startIcon={
                          <Icon icon='ic:sharp-add' color='#4C4E648A' />
                        }
                        fullWidth
                        onClick={() => {
                          handleListClose()
                          setMenu('linguistTeam')
                          setAddProsMode(true)
                          setRows({})
                          setSelectionModel({})
                          setSelectedRows({})
                        }}
                        sx={{
                          justifyContent: 'flex-start',
                          padding: '6px 16px',
                          fontSize: 16,
                          fontWeight: 400,
                          color: 'rgba(76, 78, 100, 0.87)',
                          borderRadius: 0,
                        }}
                      >
                        Add Pros to this request
                      </Button>
                    </MenuItem>
                  )}
                  {selectedAssign.requestCompleted ? null : (
                    <MenuItem
                      sx={{
                        gap: 2,
                        '&:hover': {
                          background: 'inherit',
                          cursor: 'default',
                        },
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        padding: 0,
                      }}
                    >
                      <Button
                        startIcon={
                          <Icon
                            icon='tdesign:assignment-user'
                            color='#4C4E648A'
                          />
                        }
                        fullWidth
                        onClick={() => {
                          setAssignProMode(true)
                          handleListClose()
                          setMenu('linguistTeam')
                          setRows({})
                          setSelectionModel({})
                          setSelectedRows({})
                        }}
                        sx={{
                          justifyContent: 'flex-start',
                          padding: '6px 16px',
                          fontSize: 16,
                          fontWeight: 400,
                          color: 'rgba(76, 78, 100, 0.87)',
                          borderRadius: 0,
                        }}
                      >
                        Assign other Pro
                      </Button>
                    </MenuItem>
                  )}
                  {selectedAssign.type === 'relayRequest' ? (
                    <Tooltip title='In preparation'>
                      <MenuItem
                        sx={{
                          gap: 2,
                          '&:hover': {
                            background: 'inherit',
                            cursor: 'default',
                          },
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start',
                          padding: 0,
                        }}
                        // disabled
                      >
                        <Button
                          startIcon={<Icon icon='ic:outline-low-priority' />}
                          fullWidth
                          disabled
                          onClick={() => {
                            handleListClose()
                          }}
                          sx={{
                            justifyContent: 'flex-start',
                            padding: '6px 16px',
                            fontSize: 16,
                            fontWeight: 400,
                            color: 'rgba(76, 78, 100, 0.87)',
                            borderRadius: 0,
                          }}
                        >
                          Edit priority
                        </Button>
                      </MenuItem>
                    </Tooltip>
                  ) : null}
                </Menu>
              </Box>
            </Box>
          ) : null}
          {selectedAssign ? (
            <Box sx={{ height: '100%' }}>
              <DataGrid
                // autoHeight
                sx={{
                  height: 'calc(75vh - 100px)',
                }}
                rows={
                  selectedAssign?.pros && selectedAssign.pros.length > 0
                    ? [...selectedAssign?.pros].sort(
                        (a, b) => a.order - b.order,
                      )
                    : []
                }
                columns={getProJobAssignColumnsForRequest(
                  auth,
                  timezoneList.getValue(),
                  selectedAssign.requestCompleted,
                  // selectedAssign?.pros || [],
                  detailAnchorEl,
                  handleDetailClick,
                  handleDetailClose,
                  onClickAssign,
                  onClickCancel,
                  onClickReAssign,
                  onClickMessage,
                  selectedAssign.type,
                  jobStatusList || [],
                  selectedUser!,
                )}
                keepNonExistentRowsSelected
                getRowId={row => row.userId}
                hideFooterSelectedRowCount
                hideFooter
              />
            </Box>
          ) : null}
        </Box>
      ) : (
        <Box sx={{ height: '100%' }}>
          {addRoundMode || addProsMode ? (
            <Box sx={{ padding: '20px 20px 0 20px' }}>
              <Typography fontSize={14} fontWeight={600}>
                Round{' '}
                {addProsMode
                  ? `${selectedAssign?.round}- Add Pros`
                  : jobAssign.length + 1}
              </Typography>
            </Box>
          ) : null}
          <Box
            sx={{
              display: 'flex',
              padding: '32px 20px 24px 20px',
              justifyContent: 'space-between',
            }}
          >
            <ButtonGroup variant='outlined' color='secondary'>
              <CustomBtn
                value='linguistTeam'
                isFocus={menu === 'linguistTeam'}
                onClick={e => {
                  if (menu === 'linguistTeam') return
                  setPastLinguistTeam(null)
                  setSelectedLinguistTeam(pastLinguistTeam)

                  setMenu(e.currentTarget.value as TabType)
                }}
              >
                Linguist team
              </CustomBtn>
              <CustomBtn
                isFocus={menu === 'pro'}
                value='pro'
                onClick={e => {
                  if (menu === 'pro') return
                  setPastLinguistTeam(selectedLinguistTeam)
                  setSelectedLinguistTeam({
                    value: 0,
                    label: 'Searched Pros',
                  })

                  setMenu(e.currentTarget.value as TabType)
                }}
              >
                Search Pro
              </CustomBtn>
            </ButtonGroup>
            {menu === 'pro' ? (
              <Box sx={{ display: 'flex', gap: '16px' }}>
                <Box display='flex' alignItems='center' gap='4px'>
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76,78,100, 0.60)'
                  >
                    Hide off-boarded Pros
                  </Typography>
                  <Switch
                    checked={activeFilter.isOffBoard === '1'}
                    onChange={e =>
                      setActiveFilter({
                        ...activeFilter,
                        isOffBoard: e.target.checked ? '1' : '0',
                      })
                    }
                  />
                </Box>
                <Box>
                  <Button
                    startIcon={
                      <Icon
                        icon='ion:filter-outline'
                        fontSize={20}
                        color='#8D8E9A'
                      />
                    }
                    sx={{ color: '#8D8E9A', fontWeight: 500 }}
                    aria-describedby={id}
                    onClick={handleClick}
                  >
                    Filters
                  </Button>
                  <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    // sx={{ left: '700px' }}
                    sx={{
                      '& .MuiPaper-root': {
                        left: '40% !important',
                      },
                    }}
                  >
                    <Grid
                      container
                      spacing={4}
                      rowSpacing={4}
                      sx={{
                        padding: '20px',
                        minWidth: '567px',
                        maxWidth: '567px',
                        width: '100%',
                        // maxWidth: '667px',
                      }}
                    >
                      <Grid item xs={6}>
                        <Box className='filterFormAutoComplete'>
                          <Autocomplete
                            multiple
                            fullWidth
                            onChange={(event, item) => {
                              if (targetMultiple) {
                                setSourceMultiple(false)
                                if (item.length > 1) {
                                  item[0] = item[1]
                                  item.splice(1)
                                }
                              } else {
                                if (item.length > 1) setSourceMultiple(true)
                                else setSourceMultiple(false)
                              }
                              setFilter({
                                ...filter,
                                source: item.map(i => i.value),
                              })
                            }}
                            value={languageList.filter(value =>
                              filter.source?.includes(value.value),
                            )}
                            isOptionEqualToValue={(option, newValue) => {
                              return option.value === newValue.value
                            }}
                            disableCloseOnSelect
                            limitTags={1}
                            options={_.uniqBy(languageList, 'value')}
                            id='source'
                            getOptionLabel={option => option.label}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='Source language'
                              />
                            )}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox checked={selected} sx={{ mr: 2 }} />
                                {option.label}
                              </li>
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box className='filterFormAutoComplete'>
                          <Autocomplete
                            multiple
                            fullWidth
                            onChange={(event, item) => {
                              if (sourceMultiple) {
                                setTargetMultiple(false)
                                if (item.length > 1) {
                                  item[0] = item[1]
                                  item.splice(1)
                                }
                              } else {
                                if (item.length > 1) setTargetMultiple(true)
                                else setTargetMultiple(false)
                              }
                              setFilter({
                                ...filter,
                                target: item.map(i => i.value),
                              })
                            }}
                            value={languageList.filter(value =>
                              filter.target?.includes(value.value),
                            )}
                            isOptionEqualToValue={(option, newValue) => {
                              return option.value === newValue.value
                            }}
                            disableCloseOnSelect
                            limitTags={1}
                            options={_.uniqBy(languageList, 'value')}
                            id='source'
                            getOptionLabel={option => option.label}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='Target language'
                              />
                            )}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox checked={selected} sx={{ mr: 2 }} />
                                {option.label}
                              </li>
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          className='filterFormAutoComplete'
                          sx={{
                            '& .MuiChip-root': {
                              maxWidth: '110px',
                            },
                          }}
                        >
                          <Autocomplete
                            fullWidth
                            multiple
                            limitTags={1}
                            isOptionEqualToValue={(option, newValue) => {
                              return option.value === newValue.value
                            }}
                            onChange={(event, item) => {
                              if (item.length > 0) {
                                const arr: {
                                  label: ServiceType
                                  value: ServiceType
                                }[] = []

                                item.map(value => {
                                  /* @ts-ignore */
                                  const res = ServiceTypePair[value.value]
                                  arr.push(...res)
                                })
                                setFilter({
                                  ...filter,
                                  category: item.map(i => i.value),
                                })
                                setServiceTypeFormList(_.uniqBy(arr, 'value'))
                              } else {
                                setFilter({
                                  ...filter,
                                  category: [],
                                })
                                setServiceTypeFormList(ServiceTypeList)
                              }
                            }}
                            value={
                              categoryList.filter(value =>
                                filter.category?.includes(value.value),
                              ) || null
                            }
                            options={categoryList}
                            id='category'
                            getOptionLabel={option => option.label}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='Category'
                              />
                            )}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox checked={selected} sx={{ mr: 2 }} />
                                {option.label}
                              </li>
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          className='filterFormAutoComplete'
                          sx={{
                            '& .MuiChip-root': {
                              maxWidth: '110px',
                            },
                          }}
                        >
                          <Autocomplete
                            fullWidth
                            multiple
                            disableCloseOnSelect
                            isOptionEqualToValue={(option, newValue) => {
                              return option.value === newValue.value
                            }}
                            onChange={(event, item) => {
                              console.log(item)

                              if (item.length > 0) {
                                const arr: {
                                  label: Category
                                  value: Category
                                }[] = []

                                item.map(value => {
                                  /* @ts-ignore */
                                  const res = CategoryListPair[value.value]
                                  arr.push(...res)
                                })
                                const selectedId = item.map(i =>
                                  i.value.toString(),
                                )
                                const serviceTypeId = serviceTypeList.filter(
                                  value => selectedId.includes(value.label),
                                )
                                setFilter({
                                  ...filter,
                                  serviceType: serviceTypeId.map(
                                    value => value.label,
                                  ),
                                })
                                setCategoryList(_.uniqBy(arr, 'value'))
                              } else {
                                setFilter({
                                  ...filter,
                                  serviceType: [],
                                })
                                setCategoryList(CategoryList)
                              }
                            }}
                            value={
                              serviceTypeFormList.filter(value =>
                                serviceTypeList
                                  .filter(item =>
                                    filter.serviceType?.includes(item.label),
                                  )
                                  .map(sorted => sorted.label)
                                  .includes(value.label.toString()),
                              ) ?? null
                            }
                            options={serviceTypeFormList}
                            id='ServiceType'
                            limitTags={1}
                            getOptionLabel={option => option.label || ''}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='Service type'
                              />
                            )}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox checked={selected} sx={{ mr: 2 }} />
                                {option.label}
                              </li>
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          className='filterFormAutoComplete'
                          sx={{
                            '& .MuiChip-root': {
                              maxWidth: '110px',
                            },
                          }}
                        >
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            multiple
                            limitTags={1}
                            disableCloseOnSelect
                            options={clientList || []}
                            value={clientList?.filter(client =>
                              filter?.client?.includes(client.clientId),
                            )}
                            onChange={(e, v) =>
                              setFilter({
                                ...filter,
                                client: v.map(i => i.clientId),
                              })
                            }
                            // filterSelectedOptions
                            getOptionLabel={option => option?.name}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='Client'
                              />
                            )}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox checked={selected} sx={{ mr: 2 }} />
                                {option.name}
                              </li>
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box
                          className='filterFormAutoComplete'
                          sx={{
                            '& .MuiChip-root': {
                              maxWidth: '110px',
                            },
                          }}
                        >
                          <Autocomplete
                            disableCloseOnSelect
                            fullWidth
                            isOptionEqualToValue={(option, newValue) => {
                              return option.value === newValue.value
                            }}
                            multiple
                            limitTags={1}
                            options={AreaOfExpertiseList}
                            onChange={(e, v) => {
                              if (v.length > 0) {
                                setFilter({
                                  ...filter,
                                  genre: v.map(i => i.value),
                                })
                              } else {
                                setFilter({
                                  ...filter,
                                  genre: [],
                                })
                              }
                            }}
                            value={AreaOfExpertiseList.filter(item =>
                              filter.genre?.includes(item.value),
                            )}
                            renderInput={params => (
                              <TextField
                                {...params}
                                autoComplete='off'
                                label='Genre'
                                // placeholder='Area of expertise'
                              />
                            )}
                            renderOption={(props, option, { selected }) => (
                              <li {...props}>
                                <Checkbox checked={selected} sx={{ mr: 2 }} />
                                {option.label}
                              </li>
                            )}
                          />
                        </Box>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth className='filterFormControl'>
                          <OutlinedInput
                            placeholder='Search Pro’s name, email or number'
                            value={filter.search}
                            sx={{
                              height: '46px',
                            }}
                            inputProps={{
                              style: {
                                height: '46px',
                                padding: '0 14px',
                              },
                            }}
                            onChange={e =>
                              setFilter({ ...filter, search: e.target.value })
                            }
                            endAdornment={
                              <InputAdornment position='end'>
                                <IconButton edge='end'>
                                  <Icon icon='mdi:magnify' />
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            height: '46px',
                            width: '100%',
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '16px',
                            }}
                          >
                            <Button
                              variant='outlined'
                              color='secondary'
                              type='button'
                              onClick={onReset}
                              sx={{ flex: 1 }}
                            >
                              Reset
                            </Button>
                            <Button
                              variant='contained'
                              onClick={onSearch}
                              color='secondary'
                              sx={{ flex: 1 }}
                            >
                              Search
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Popover>
                </Box>
              </Box>
            ) : (
              <Box
                className='filterFormSoloAutoComplete'
                sx={{
                  width: '291px',
                  '& .MuiInputBase-root': {
                    padding: '0px 12px !important',
                  },
                }}
              >
                <Autocomplete
                  fullWidth
                  loading={isLoading}
                  options={linguistTeamList}
                  getOptionLabel={option => option.label}
                  value={selectedLinguistTeam}
                  onChange={(e, v) => {
                    if (v) {
                      setSelectedLinguistTeam(v)
                    } else {
                      setSelectedLinguistTeam(null)
                      // setRows([])
                    }
                  }}
                  renderInput={params => (
                    <TextField {...params} placeholder='Select linguist team' />
                  )}
                />
              </Box>
            )}
          </Box>
          {menu === 'linguistTeam' ? (
            <Box
              sx={{
                height: '100%',
              }}
            >
              <DataGrid
                // autoHeight
                sx={{
                  height: 'calc(85vh - 100px)',
                }}
                // sx={{ minHeight: '644px', height: '100%' }}
                rows={rows[selectedLinguistTeam?.label || ''] ?? []}
                components={{
                  NoRowsOverlay: () => NoList('No linguist team is selected'),
                  NoResultsOverlay: () => NoList('There are no linguist teams'),
                }}
                columns={getProJobAssignColumns(
                  detail?.isPrioritized ?? false,
                  false,
                  false,
                  assignProMode,
                  addRoundMode,
                  addProsMode,
                  jobStatusList || [],
                  selectionModel[selectedLinguistTeam?.label || ''],
                  setSelectionModel,
                  selectedLinguistTeam?.label || '',
                  setSelectedRows,
                  detail?.pros,
                )}
                checkboxSelection={!assignProMode}
                selectionModel={
                  selectionModel[selectedLinguistTeam?.label || ''] || []
                }
                isRowSelectable={row => {
                  console.log(selectionModel)
                  return (
                    !Object.entries(selectionModel)
                      .filter(([key]) => key !== selectedLinguistTeam?.label)
                      .map(([, value]) => value)
                      .flat()
                      .includes(row.row.userId) &&
                    !jobAssign
                      .filter(job =>
                        job.pros.every(pro => pro.assignmentStatus !== 70300),
                      )
                      .flatMap(job => job.pros.map(pro => pro.userId))
                      .includes(row.row.userId)
                  )
                }}
                onSelectionModelChange={handleSelectionModelChange}
                keepNonExistentRowsSelected
                getRowId={row => row.userId}
                pagination
                paginationMode='server'
                page={page}
                pageSize={pageSize}
                rowsPerPageOptions={[10, 25, 50]}
                rowCount={detail?.pros?.length || 0}
                loading={loading}
                onPageChange={newPage => {
                  setPage(newPage)
                }}
                onPageSizeChange={newPageSize => {
                  setPageSize(newPageSize)
                }}
                hideFooterSelectedRowCount
              />
            </Box>
          ) : menu === 'pro' ? (
            <Box sx={{ height: '100%' }}>
              <DataGrid
                // autoHeight
                sx={{
                  height: 'calc(75vh - 100px)',
                }}
                rows={rows[selectedLinguistTeam?.label || ''] ?? []}
                components={{
                  NoRowsOverlay: () => NoList('No matching results found'),
                  NoResultsOverlay: () => NoList('No matching results found'),
                }}
                columns={getProJobAssignColumns(
                  false,
                  false,
                  false,
                  assignProMode,
                  addRoundMode,
                  addProsMode,
                  jobStatusList || [],

                  selectionModel[selectedLinguistTeam?.label || ''],
                  setSelectionModel,
                  selectedLinguistTeam?.label || '',
                  setSelectedRows,
                  // detail?.pros,
                  rows[selectedLinguistTeam?.label || ''] ?? [],
                )}
                checkboxSelection={!assignProMode}
                selectionModel={
                  selectionModel[selectedLinguistTeam?.label || ''] || []
                }
                isRowSelectable={row => {
                  return (
                    !Object.entries(selectionModel)
                      .filter(([key]) => key !== selectedLinguistTeam?.label)
                      .map(([, value]) => value)
                      .flat()
                      .includes(row.row.userId) &&
                    !jobAssign
                      .filter(job =>
                        job.pros.every(pro => pro.assignmentStatus !== 70300),
                      )
                      .flatMap(job => job.pros.map(pro => pro.userId))
                      .includes(row.row.userId)
                  )
                }}
                onSelectionModelChange={handleSelectionModelChange}
                keepNonExistentRowsSelected
                getRowId={row => row.userId}
                pagination
                paginationMode='server'
                page={filter.skip}
                pageSize={filter.take}
                rowsPerPageOptions={[10, 25, 50]}
                rowCount={proList.totalCount || 0}
                loading={loading}
                onPageChange={(n: number) => {
                  setFilter({ ...filter, skip: n })
                  setActiveFilter({
                    ...activeFilter,
                    skip: n * activeFilter.take!,
                  })
                }}
                onPageSizeChange={(n: number) => {
                  setFilter({ ...filter, take: n })
                  setActiveFilter({ ...activeFilter, take: n })
                }}
                hideFooterSelectedRowCount
              />
            </Box>
          ) : null}
        </Box>
      )}
    </>
  )
}

export default AssignPro

const CustomBtn = styled(Button)<{ isFocus: boolean }>`
  width: 145px;
  height: 36px;
  color: ${({ isFocus }) => (isFocus ? '#4C4E64' : '#8d8e9a')};
  background: ${({ isFocus }) => (isFocus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
