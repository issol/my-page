import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from '@mui/material'
import { getValue } from '@mui/system'
import {
  DataGrid,
  GridCallbackDetails,
  GridRowsProp,
  GridSelectionModel,
} from '@mui/x-data-grid'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import useModal from '@src/hooks/useModal'
import { NoList } from '@src/pages/components/no-list'
import { useGetClientList } from '@src/queries/client.query'
import { useGetSimpleClientList } from '@src/queries/common.query'
import { useGetProList } from '@src/queries/pro/pro-list.query'
import { getLinguistTeamProColumns } from '@src/shared/const/columns/linguist-team'
import { ExperiencedYearsForFilter } from '@src/shared/const/experienced-years'
import { JobList } from '@src/shared/const/job/jobs'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { timezoneSelector } from '@src/states/permission'
import { RoleSelectType, SelectType } from '@src/types/onboarding/list'
import {
  LinguistTeamFormType,
  LinguistTeamProListFilterType,
} from '@src/types/pro/linguist-team'
import { ProListFilterType, ProListType } from '@src/types/pro/list'
import _ from 'lodash'
import { useEffect, useMemo, useState } from 'react'
import { UseFormGetValues } from 'react-hook-form'
import { useRecoilValueLoadable } from 'recoil'
import PushPinIcon from '@mui/icons-material/PushPin'

type Props = {
  onClose: () => void
  getValues: UseFormGetValues<LinguistTeamFormType>
  onClickSelectPro: (proList: ProListType[]) => void
}

export const initialFilter: LinguistTeamProListFilterType = {
  clientId: [],
  jobType: [],
  role: [],
  source: [],
  target: [],
  experience: [],
  timezone: [],
  search: '',
  skip: 0,
  take: 8,
}

const SelectProModal = ({ onClose, getValues, onClickSelectPro }: Props) => {
  const { openModal, closeModal } = useModal()
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [exposedModal, setExposedModal] = useState(false)
  const [filter, setFilter] = useState<LinguistTeamProListFilterType>({
    jobType: [],
    role: [],
    source: getValues('sourceLanguage') ? [getValues('sourceLanguage')] : [],
    target: getValues('targetLanguage') ? [getValues('targetLanguage')] : [],
    experience: [],
    status: [],
    clientId: getValues('clientId') ? [getValues('clientId')] : [],
    timezone: [],
    take: 8,
    skip: 0,
  })

  const [activeFilter, setActiveFilter] =
    useState<LinguistTeamProListFilterType>({
      jobType: [],
      role: [],
      source: getValues('sourceLanguage') ? [getValues('sourceLanguage')] : [],
      target: getValues('targetLanguage') ? [getValues('targetLanguage')] : [],
      experience: [],
      status: [],
      clientId: getValues('clientId') ? [getValues('clientId')] : [],
      timezone: [],
      take: 8,
      skip: 0,
    })

  const [timezoneList, setTimezoneList] = useState<
    {
      id: number
      code: string
      label: string
      pinned: boolean
    }[]
  >([])

  const loadTimezonePin = ():
    | {
        id: number
        code: string
        label: string
        pinned: boolean
      }[]
    | null => {
    const storedOptions = localStorage.getItem('timezonePinnedOptions')
    return storedOptions ? JSON.parse(storedOptions) : null
  }

  useEffect(() => {
    if (timezoneList.length !== 0) return
    const zoneList = timezone.getValue()
    const loadTimezonePinned = loadTimezonePin()
    const filteredTimezone = zoneList.map((list, idx) => {
      return {
        id: idx,
        code: list.timezoneCode,
        label: list.timezone,
        pinned:
          loadTimezonePinned && loadTimezonePinned.length > 0
            ? loadTimezonePinned[idx].pinned
            : false,
      }
    })
    setTimezoneList(filteredTimezone)
  }, [timezone])

  const { data: proList, isLoading } = useGetProList(activeFilter)
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])
  const [rows, setRows] = useState<ProListType[]>([])
  const [pagedRows, setPagedRows] = useState<ProListType[]>([])

  const languageList = getGloLanguage()
  const { data: clientList } = useGetSimpleClientList()
  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )

  const handleSelectionModelChange = (
    selectionModel: GridSelectionModel,
    details: GridCallbackDetails<any>,
  ) => {
    console.log(details)

    setSelectionModel(selectionModel)
  }

  const onReset = () => {
    setFilter(initialFilter)
    setActiveFilter(initialFilter)
    setSelectionModel([])
    setJobTypeOptions(JobList)
    setRoleOptions(OnboardingListRolePair)
  }

  const onSearch = () => {
    setActiveFilter({
      ...filter,
      skip: filter.skip * activeFilter.take,
      take: activeFilter.take,
    })
  }

  const handlePin = (option: {
    id: number
    code: string
    label: string
    pinned: boolean
  }) => {
    const newOptions = timezoneList.map(opt =>
      opt.label === option.label ? { ...opt, pinned: !opt.pinned } : opt,
    )
    setTimezoneList(newOptions)
    localStorage.setItem('timezonePinnedOptions', JSON.stringify(newOptions))
  }

  const sortedOptions = timezoneList.sort((a, b) => {
    if (a.pinned === b.pinned) return a.id - b.id // 핀 상태가 같으면 원래 순서 유지
    return b.pinned ? 1 : -1 // 핀 상태에 따라 정렬
  })

  const lastPinnedIndex = timezoneList.reduce(
    (lastIndex, option, index) => (option.pinned ? index : lastIndex),
    -1,
  )

  const setWarningLanguagePair = (
    type: 'source' | 'target',
    value: string | null,
  ) => {
    if (value === null) {
      setFilter({
        ...filter,
        [type]: [],
      })
    } else {
      if (
        ((type === 'source' && getValues('sourceLanguage') !== value) ||
          (type === 'target' && getValues('targetLanguage') !== value)) &&
        !exposedModal
      ) {
        openModal({
          type: 'LanguagePairInconsistencyModal',
          children: (
            <CustomModalV2
              vary='error-alert'
              title='Language pair inconsistency'
              subtitle='The Linguist team information you have set does not match the language pair you are trying to change. Proceed?'
              rightButtonText='Proceed'
              onClose={() => closeModal('LanguagePairInconsistencyModal')}
              onClick={() => {
                closeModal('LanguagePairInconsistencyModal')
                setExposedModal(true)
                setFilter({
                  ...filter,
                  [type]: value ? [value] : [],
                })
              }}
            />
          ),
        })
      } else {
        setFilter({
          ...filter,
          [type]: value ? [value] : [],
        })
      }
    }
  }

  useEffect(() => {
    if (proList) {
      const prosValues = getValues('pros').map(value => value.userId)
      setSelectionModel(
        prev =>
          Array.from(new Set([...prev, ...prosValues])) as GridSelectionModel,
      )
      setRows(proList.data)
      setPagedRows(prev => [
        ...prev,
        ...proList.data.filter(
          pro => !prev.some(prevPro => prevPro.userId === pro.userId),
        ),
      ])

      // const filteredProList = proList.data.filter(pro =>
      //   prosValues.some(proValue => pro.userId !== proValue),
      // )
    }
  }, [proList])

  return (
    <Box
      sx={{
        maxWidth: '1210px',
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '20px 20px 20px 20px',
        }}
      >
        <Typography fontSize={20} fontWeight={600}>
          Pros {proList?.totalCount ? `(${proList?.totalCount})` : 0}
        </Typography>

        <IconButton
          // sx={{ position: 'absolute', top: '10px', right: '10px' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton>

        {/* <Button
          variant='contained'
          startIcon={<Icon icon='mdi:check' />}
          onClick={onClose}
        >
          Select
        </Button> */}
      </Box>
      <Divider sx={{ margin: '0 !important' }} />
      <Grid
        container
        xs={12}
        spacing={6}
        rowSpacing={4}
        sx={{ padding: '20px' }}
      >
        <Grid item xs={6} md={4} lg={3}>
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
                <TextField {...params} autoComplete='off' label='Client' />
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
        <Grid item xs={6} md={4} lg={3}>
          <Box className='filterFormSoloAutoComplete'>
            <Autocomplete
              fullWidth
              options={_.uniqBy(languageList, 'value')}
              getOptionLabel={option => option.label}
              value={
                languageList.find(
                  (item: { value: string; label: GloLanguageEnum }) =>
                    filter.source && filter.source[0] === item.value,
                ) ?? null
              }
              onChange={(e, v) => {
                // setFilter({
                //   ...filter,
                //   source: v ? [v.value] : [],
                // })
                setWarningLanguagePair('source', v ? v.value : null)
              }}
              renderInput={params => <TextField {...params} label='Source' />}
            />
          </Box>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Box className='filterFormSoloAutoComplete'>
            <Autocomplete
              fullWidth
              options={_.uniqBy(languageList, 'value')}
              getOptionLabel={option => option.label}
              value={
                languageList.find(
                  (item: { value: string; label: GloLanguageEnum }) =>
                    filter.target && filter.target[0] === item.value,
                ) ?? null
              }
              onChange={(e, v) => {
                // setFilter({
                //   ...filter,
                //   target: v ? [v.value] : [],
                // })
                setWarningLanguagePair('target', v ? v.value : null)
              }}
              renderInput={params => <TextField {...params} label='Target' />}
            />
          </Box>
        </Grid>

        <Grid item xs={6} md={4} lg={3}>
          <Box className='filterFormAutoComplete'>
            <Autocomplete
              multiple
              fullWidth
              isOptionEqualToValue={(option, newValue) => {
                return option.value === newValue.value
              }}
              onChange={(
                event,
                item: {
                  label: string
                  value: string
                  jobType: string[]
                }[],
              ) => {
                setFilter({
                  ...filter,
                  role: item.map(i => i.value),
                })

                if (item.length) {
                  const arr: {
                    label: string
                    value: string
                  }[] = []

                  item.map((data, idx) => {
                    data.jobType.map(value => {
                      const jobType = JobList.filter(
                        data => data.value === value,
                      )
                      arr.push(...jobType)
                    })
                  })
                  setJobTypeOptions(_.uniqBy(arr, 'value'))
                } else {
                  setJobTypeOptions(JobList)
                }
              }}
              value={roleOptions.filter(role =>
                filter.role?.includes(role.value),
              )}
              disableCloseOnSelect
              limitTags={1}
              options={roleOptions}
              id='role'
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField {...params} autoComplete='off' label='Role' />
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
        <Grid item xs={6} md={4} lg={3}>
          <Box className='filterFormAutoComplete'>
            <Autocomplete
              multiple
              fullWidth
              // onClose={() => {
              //   setInputStyle(false)
              // }}
              // onOpen={() => {
              //   setInputStyle(true)
              // }}
              onChange={(event, item) => {
                setFilter({
                  ...filter,
                  timezone: item.map(value => value.label),
                })
              }}
              value={sortedOptions.filter(value =>
                filter.timezone?.includes(value.label),
              )}
              // options={timezoneList.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0))}
              options={sortedOptions}
              isOptionEqualToValue={(option, newValue) => {
                return option.id === newValue.id
              }}
              disableCloseOnSelect
              limitTags={1}
              id='timezone'
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
                  label={`Pro's timezone`}
                />
              )}
              renderOption={(props, option, state) => (
                <Box
                  component='li'
                  {...props}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom:
                      state.index === lastPinnedIndex
                        ? '1px solid #E9EAEC'
                        : 'none',
                  }}
                >
                  <Checkbox checked={state.selected} sx={{ mr: 2 }} />
                  <Typography
                    noWrap
                    sx={{
                      maxWidth: 300,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {/* {option.label} */}
                    {timeZoneFormatter(option, timezone.getValue())}
                  </Typography>
                  <IconButton
                    onClick={event => {
                      event.stopPropagation() // 드롭다운이 닫히는 것 방지
                      handlePin(option)
                    }}
                    size='small'
                    style={{
                      color: option.pinned ? '#FFAF66' : undefined,
                    }}
                  >
                    <PushPinIcon />
                  </IconButton>
                </Box>
              )}
            />
            {/* <Autocomplete
              multiple
              fullWidth
              isOptionEqualToValue={(option, newValue) => {
                return option.value === newValue.value
              }}
              onChange={(event, item) => {
                setFilter({
                  ...filter,
                  jobType: item.map(i => i.value),
                })

                if (item.length) {
                  const arr: {
                    label: string
                    value: string
                    jobType: string[]
                  }[] = []
                  item.map((data, idx) => {
                    const jobTypeValue = data?.value

                    const res = OnboardingListRolePair.filter(value =>
                      value.jobType.includes(jobTypeValue),
                    )

                    arr.push(...res)
                  })
                  setRoleOptions(arr)
                } else {
                  setRoleOptions(OnboardingListRolePair)
                }
              }}
              value={jobTypeOptions.filter(jobType =>
                filter.jobType?.includes(jobType.value),
              )}
              disableCloseOnSelect
              limitTags={1}
              options={jobTypeOptions}
              id='jobType'
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField {...params} autoComplete='off' label='Job type' />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} sx={{ mr: 2 }} />
                  {option.label}
                </li>
              )}
            /> */}
          </Box>
        </Grid>
        <Grid item xs={6} md={4} lg={3}>
          <Box className='filterFormAutoComplete'>
            <Autocomplete
              autoHighlight
              fullWidth
              multiple
              limitTags={1}
              options={ExperiencedYearsForFilter}
              value={ExperiencedYearsForFilter.filter(value =>
                filter.experience?.includes(value.value),
              )}
              onChange={(e, v) =>
                setFilter({
                  ...filter,
                  experience: v.map(i => i.value),
                })
              }
              // filterSelectedOptions
              id='yearsOfExperience'
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
                  label='Years of experience'
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
        <Grid item xs={4}>
          <FormControl fullWidth className='filterFormControl'>
            <InputLabel>Search team</InputLabel>
            <OutlinedInput
              label='Search team'
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
              onChange={e => setFilter({ ...filter, search: e.target.value })}
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
        <Grid item xs={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '46px',
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
        </Grid>
      </Grid>
      <Box>
        <DataGrid
          autoHeight
          sx={{ minHeight: '482px' }}
          rows={rows || []}
          components={{
            NoRowsOverlay: () => NoList('There are no pros'),
            NoResultsOverlay: () => NoList('There are no pros'),
          }}
          columns={getLinguistTeamProColumns(false, true, 'detail', timezone)}
          checkboxSelection
          selectionModel={selectionModel}
          onSelectionModelChange={handleSelectionModelChange}
          keepNonExistentRowsSelected
          getRowId={row => row.userId}
          pagination
          paginationMode='server'
          pageSize={filter.take}
          rowsPerPageOptions={[5, 10, 25, 50]}
          page={filter.skip}
          rowCount={proList?.totalCount || 0}
          loading={isLoading}
          onPageChange={(n: number) => {
            setFilter({ ...filter, skip: n })
            setActiveFilter({ ...activeFilter, skip: n * activeFilter.take! })
          }}
          onPageSizeChange={(n: number) => {
            setFilter({ ...filter, take: n })
            setActiveFilter({ ...activeFilter, take: n })
          }}
          // setProListPageSize(newPageSize)

          hideFooterSelectedRowCount
        />
      </Box>
      <Box sx={{ padding: '32px 20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant='contained'
            startIcon={<Icon icon='mdi:check' />}
            disabled={!selectionModel.length}
            onClick={() => {
              console.log(selectionModel)

              onClickSelectPro(
                pagedRows.filter(pro => selectionModel.includes(pro.userId)) ||
                  [],
              )
              onClose()
            }}
          >
            Select ({selectionModel.length ?? 0})
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SelectProModal
