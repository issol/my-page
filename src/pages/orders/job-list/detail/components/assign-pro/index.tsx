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
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from 'react'
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

type Props = {
  jobInfo: JobType
  jobAssign: JobAssignProRequestsType[]
  serviceTypeList: Array<{ value: number; label: string }>
  clientList: Array<{ clientId: number; name: string }>
  selectedRows: {
    [key: string]: {
      data: ProListType[]
      isPrivate?: boolean
      isPrioritized?: boolean
    }
  }
  setSelectedRows: Dispatch<
    SetStateAction<{
      [key: string]: {
        data: ProListType[]
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

  proList: { data: Array<ProListType>; totalCount: number }
  setPastLinguistTeam: Dispatch<
    SetStateAction<{
      value: number
      label: string
    } | null>
  >
  pastLinguistTeam: { value: number; label: string } | null
  filter: LinguistTeamProListFilterType
  setFilter: Dispatch<SetStateAction<LinguistTeamProListFilterType>>
  setActiveFilter: Dispatch<SetStateAction<LinguistTeamProListFilterType>>
  activeFilter: LinguistTeamProListFilterType
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
}: Props) => {
  const { openModal, closeModal } = useModal()
  console.log(selectionModel, 'test')
  console.log(selectedRows, 'test')

  const [detailAnchorEl, setDetailAnchorEl] =
    useState<HTMLButtonElement | null>(null)

  const [listAnchorEl, setListAnchorEl] = useState<HTMLButtonElement | null>(
    null,
  )
  const auth = useRecoilValueLoadable(authState)
  const timezoneList = useRecoilValueLoadable(timezoneSelector)

  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState<{ [key: string]: Array<ProListType> }>({})
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

  const handleDetailClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setDetailAnchorEl(event.currentTarget)
  }

  const handleDetailClose = () => {
    setDetailAnchorEl(null)
  }

  const handleListClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setListAnchorEl(event.currentTarget)
  }

  const handleListClose = () => {
    setListAnchorEl(null)
  }

  const handleAssign = () => {
    closeModal('AssignProModal')
  }

  const handleCancelRequest = () => {
    closeModal('CancelRequestProModal')
  }

  const handleReAssign = () => {
    closeModal('ReAssignProModal')
  }

  const onClickAssign = (row: JobRequestsProType) => {
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
            handleAssign()
          }}
          onClose={() => closeModal('AssignProModal')}
          rightButtonText='Assign'
          vary='successful'
        />
      ),
    })
  }

  const onClickCancel = (row: JobRequestsProType) => {
    openModal({
      type: 'CancelRequestProModal',
      children: (
        <CustomModalV2
          title='Cancel request?'
          subtitle={
            'Are you sure you want to cancel the job request of this Pro?'
          }
          onClick={() => {
            handleCancelRequest()
          }}
          onClose={() => closeModal('CancelRequestProModal')}
          rightButtonText='Cancel request'
          leftButtonText='No'
          vary='error-alert'
        />
      ),
    })
  }

  const onClickReAssign = (row: JobRequestsProType) => {
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

  const onClickMessage = (row: JobRequestsProType) => {
    openModal({
      type: 'AssignProMessageModal',
      children: (
        <Message
          jobId={jobInfo.id}
          info={row}
          onClose={() => closeModal('AssignProMessageModal')}
        />
      ),
    })
  }

  const onReset = () => {
    setServiceTypeFormList(ServiceTypeList)
    setCategoryList(CategoryList)
    setFilter({
      category: [],
      serviceTypeId: [],
      clientId: [],
      sourceLanguage: [],
      targetLanguage: [],
      genre: [],
      search: '',
      skip: 0,
      take: 10,
    })
    setActiveFilter({
      category: [],
      serviceTypeId: [],
      clientId: [],
      sourceLanguage: [],
      targetLanguage: [],
      genre: [],
      search: '',
      skip: 0,
      take: 10,
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
      console.log(proList.data)

      const selectedPros =
        proList.data.filter(pro => selectionModel.includes(pro.userId)) ?? []

      setSelectedRows(prev => {
        // detail.isPrioritized가 false이면 selectionModel의 순서에 따라 정렬합니다.
        selectedPros.sort(
          (a, b) =>
            selectionModel.indexOf(a.userId) - selectionModel.indexOf(b.userId),
        )

        // 기존 데이터와 새로운 데이터를 합칩니다.
        const newData = [...selectedPros]

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
          [selectedLinguistTeam?.label || '']: proList.data,
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
            <Button
              variant='outlined'
              color='secondary'
              sx={{
                borderRadius: '100px',
                border: '1px solid #8D8E9A',
                color: '#8D8E9A',
              }}
              // TODO 새로운 페이지 추가 액션
              onClick={() => setAddRoundMode(true)}
              // onClick={() => setRound(assign.round)}
            >
              + Round{jobAssign.length + 1}
            </Button>
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
                {selectedAssign?.type === 'relay'
                  ? 'Relay request'
                  : selectedAssign?.type === 'bulkAuto'
                    ? 'Bulk request - First come first served'
                    : selectedAssign?.type === 'bulkManual'
                      ? 'Bulk request - Manual assign'
                      : '-'}{' '}
                ({selectedAssign?.pros.length ?? 0})
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
                  {selectedAssign.pros.some(
                    pro => pro.assignmentStatus === 70300,
                  ) ? null : (
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
                          setAddProsMode(true)
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
                  {selectedAssign.pros.some(
                    pro => pro.assignmentStatus === 70300,
                  ) ? null : (
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
                  {selectedAssign.type === 'relay' ? (
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

          <Box sx={{ height: '100%' }}>
            <DataGrid
              // autoHeight
              sx={{
                height: 'calc(75vh - 100px)',
              }}
              rows={selectedAssign?.pros || []}
              columns={getProJobAssignColumnsForRequest(
                auth,
                timezoneList.getValue(),
                selectedAssign?.pros || [],
                detailAnchorEl,
                handleDetailClick,
                handleDetailClose,
                onClickAssign,
                onClickCancel,
                onClickReAssign,
                onClickMessage,
              )}
              keepNonExistentRowsSelected
              getRowId={row => row.userId}
              hideFooterSelectedRowCount
              hideFooter
            />
          </Box>
        </Box>
      ) : (
        <Box sx={{ height: '100%' }}>
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
                $focus={menu === 'linguistTeam'}
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
                $focus={menu === 'pro'}
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
                    checked={activeFilter.hide === '1'}
                    onChange={e =>
                      setActiveFilter({
                        ...activeFilter,
                        hide: e.target.checked ? '1' : '0',
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
                                sourceLanguage: item.map(i => i.value),
                              })
                            }}
                            value={languageList.filter(value =>
                              filter.sourceLanguage?.includes(value.value),
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
                                targetLanguage: item.map(i => i.value),
                              })
                            }}
                            value={languageList.filter(value =>
                              filter.targetLanguage?.includes(value.value),
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
                                  serviceTypeId: serviceTypeId.map(
                                    value => value.value,
                                  ),
                                })
                                setCategoryList(_.uniqBy(arr, 'value'))
                              } else {
                                setFilter({
                                  ...filter,
                                  serviceTypeId: [],
                                })
                                setCategoryList(CategoryList)
                              }
                            }}
                            value={
                              serviceTypeFormList.filter(value =>
                                serviceTypeList
                                  .filter(item =>
                                    filter.serviceTypeId?.includes(item.value),
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
                              filter?.clientId?.includes(client.clientId),
                            )}
                            onChange={(e, v) =>
                              setFilter({
                                ...filter,
                                clientId: v.map(i => i.clientId),
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
                                label='Area of expertise'
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
                  console.log('hi')

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

const CustomBtn = styled(Button)<{ $focus: boolean }>`
  width: 145px;
  height: 36px;
  color: ${({ $focus }) => ($focus ? '#4C4E64' : '#8d8e9a')};
  background: ${({ $focus }) => ($focus ? 'rgba(102, 108, 255, 0.08)' : '')};
`
