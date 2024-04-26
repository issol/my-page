import { Box } from '@mui/material'
import ProListFilters from './list/filters'
import { SyntheticEvent, useCallback, useEffect, useState } from 'react'
import {
  ProFilterType,
  ProListFilterType,
  ProListType,
} from '@src/types/pro/list'
import { useForm } from 'react-hook-form'
import { useQueryClient } from 'react-query'
import { RoleSelectType, SelectType } from '@src/types/onboarding/list'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { JobList } from '@src/shared/const/job/jobs'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import ProList from './list/list'
import { useGetProList } from '@src/queries/pro/pro-list.query'
import { getProListColumns } from '@src/shared/const/columns/pro-list'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { authState } from '@src/states/auth'
import FilePreviewDownloadModal from '@src/pages/components/pro-detail-modal/modal/file-preview-download-modal'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import useModal from '@src/hooks/useModal'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'
import { DataGridProProps } from '@mui/x-data-grid-pro'

const defaultValues: ProFilterType = {
  // jobType: [],
  timezone: [],
  role: [],
  source: [],
  target: [],
  experience: [],
  status: [],
  clientId: [],
  search: '',
}

const defaultFilters: ProListFilterType = {
  // jobType: [],
  role: [],
  source: [],
  target: [],
  experience: [],
  status: [],
  clientId: [],
  timezone: [],
  take: 500,
  skip: 0,
}

const ProsList = () => {
  const queryClient = useQueryClient()
  const languageList = getGloLanguage()
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const auth = useRecoilValueLoadable(authState)

  const { openModal, closeModal } = useModal()
  const savedFilter: ProFilterType | null = getUserFilters(FilterKey.PRO_LIST)
    ? JSON.parse(getUserFilters(FilterKey.PRO_LIST)!)
    : null

  const [proListPage, setProListPage] = useState<number>(0)
  const [proListPageSize, setProListPageSize] = useState<number>(500)
  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )
  const [expanded, setExpanded] = useState<string | false>('panel1')

  const [idOrder, setIdOrder] = useState(true)
  const [dateOrder, setDateOrder] = useState(true)
  const [isHoverId, setIsHoverId] = useState(false)
  const [isDateHoverId, setIsDateHoverId] = useState(false)
  const [isSorting, setIsSorting] = useState<boolean>(false)
  const [rows, setRows] = useState<ProListType[]>([])

  const [filters, setFilters] = useState<ProListFilterType | null>(null)

  const [defaultFilter, setDefaultFilter] =
    useState<ProFilterType>(defaultValues)

  const { data: proList, isLoading } = useGetProList(filters)

  const { control, handleSubmit, trigger, reset } = useForm<ProFilterType>({
    defaultValues: defaultFilter,
    mode: 'onSubmit',
  })

  const [timezoneList, setTimezoneList] = useState<
    {
      id: number
      code: string
      label: string
      pinned: boolean
    }[]
  >([])

  const onClickResetButton = () => {
    setRoleOptions(OnboardingListRolePair)
    setJobTypeOptions(JobList)
    reset(defaultValues)

    setFilters(defaultFilters)
    saveUserFilters(FilterKey.PRO_LIST, {
      ...defaultValues,
    })
  }

  const handleFilterStateChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  const onSubmit = (data: ProFilterType) => {
    const {
      // jobType,
      role,
      source,
      target,
      experience,
      status,
      clientId,
      search,
    } = data

    saveUserFilters(FilterKey.PRO_LIST, data)
    setDefaultFilter(data)

    const filter = {
      // jobType: jobType.map(value => value.value),
      role: role.map(value => value.value),
      source: source.map(value => value.value),
      target: target.map(value => value.value),
      status: status.map(value => value.value),
      experience: experience.map(value => value.value),
      clientId: clientId.map(value => value.clientId),
      search: search,
      take: proListPageSize,
      skip: proListPageSize * proListPage,
      sortId: 'DESC',
      // sortDate: 'DESC',
    }

    setFilters(filter)
    // queryClient.invalidateQueries(['pro-list', filter])
  }

  const onClickFile = (
    file: {
      id: number
      url: string
      filePath: string
      fileName: string
      fileExtension: string
    },
    fileType: string,
  ) => {
    getDownloadUrlforCommon(fileType, file.filePath).then(res => {
      file.url = res.url
      openModal({
        type: 'FilePreviewDownloadModal',
        children: (
          <FilePreviewDownloadModal
            onClose={() => closeModal('FilePreviewDownloadModal')}
            docs={[file]}
          />
        ),
      })
    })
  }

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
    console.log('timezoneList', timezoneList.length)
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

  useEffect(() => {
    queryClient.invalidateQueries(['pro-list'])
    queryClient.invalidateQueries(['pro-overview'])
  }, [])

  useEffect(() => {
    if (savedFilter) {
      const {
        // jobType,
        timezone,
        role,
        source,
        target,
        experience,
        status,
        clientId,
        search,
        sortId,
        sortDate,
      } = savedFilter

      const filter = {
        // jobType: jobType.map(value => value.value),
        timezone: timezone.map(value => value.id),
        role: role.map(value => value.value),
        source: source.map(value => value.value),
        target: target.map(value => value.value),
        status: status.map(value => value.value),
        experience: experience.map(value => value.value),
        clientId: clientId.map(value => value.clientId),
        search: search,
        take: proListPageSize,
        skip: proListPageSize * proListPage,
        sortId: sortId,
        sortDate: sortDate,
      }

      if (JSON.stringify(defaultFilter) !== JSON.stringify(savedFilter)) {
        setDefaultFilter(savedFilter)
        setFilters(filter)
        reset(savedFilter)
      }
      if (JSON.stringify(filters) !== JSON.stringify(filter)) {
        setFilters(filter)
      }
    } else {
      setFilters(defaultFilters)
    }
  }, [savedFilter])

  useEffect(() => {
    if (proList && proList.data) {
      setRows(prev => prev.concat(proList.data))
    }
  }, [proList])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%' }}>
        <ProListFilters
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          trigger={trigger}
          setJobTypeOptions={setJobTypeOptions}
          setRoleOptions={setRoleOptions}
          jobTypeOptions={jobTypeOptions}
          roleOptions={roleOptions}
          languageList={languageList}
          onClickResetButton={onClickResetButton}
          handleFilterStateChange={handleFilterStateChange}
          expanded={expanded}
          proListCount={proList?.totalCount ?? 0}
          timezoneList={timezoneList}
          setTimezoneList={setTimezoneList}
          timezone={timezone.getValue()}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <ProList
          proListPage={proListPage}
          setProListPage={setProListPage}
          proListPageSize={proListPageSize}
          setProListPageSize={setProListPageSize}
          proList={rows}
          proListCount={proList?.totalCount!}
          setFilters={setFilters}
          columns={getProListColumns(
            auth,
            timezone,
            setIsHoverId,
            isHoverId,
            idOrder,
            setIdOrder,
            setFilters,
            setIsSorting,
            filters!,
            setIsDateHoverId,
            isDateHoverId,
            dateOrder,
            setDateOrder,
            defaultFilter,
            onClickFile,
          )}
          isLoading={Boolean(isLoading || isSorting)}
        />
      </Box>
    </Box>
  )
  {
  }
}

export default ProsList
