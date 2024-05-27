import { Grid, IconButton, Tooltip, Typography } from '@mui/material'

import PageHeader from '@src/@core/components/page-header'
import OnboardingDashboard from './components/list/dashboard'
import Filters from './components/list/filters'
import OnboardingList from './components/list/list'
import { SyntheticEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { JobList } from '@src/shared/const/job/jobs'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import {
  FilterType,
  OnboardingFilterType,
  OnboardingListCellType,
  OnboardingListType,
  RoleSelectType,
  SelectType,
} from '@src/types/onboarding/list'
import {
  useGetOnboardingProList,
  useGetOnboardingStatistic,
  useGetStatistic,
} from '@src/queries/onboarding/onboarding-query'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { GridColumns } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import LegalNameEmail, {
  LegalName,
} from './components/list/list-item/legalname-email'
import JobTypeRole from '../components/job-type-role-chips'
import TestStatus from './components/list/list-item/test-status'
import Icon from '@src/@core/components/icon'
import { useQueryClient } from 'react-query'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'
import JobTypeRoleChips from '../components/job-type-role-chips/role-chip'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { timezoneSelector } from '@src/states/permission'
import { timeZoneFormatter } from '@src/shared/helpers/timezone.helper'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import ListResume from '../pro/list/list/list-resume'
import FilePreviewDownloadModal from '../components/pro-detail-modal/modal/file-preview-download-modal'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import useModal from '@src/hooks/useModal'
import { useRouter } from 'next/router'
import { v4 as uuidv4 } from 'uuid'
import { GridColDef } from '@mui/x-data-grid-pro'
import _ from 'lodash'
import { getOnboardingProList } from '@src/apis/onboarding.api'

import { getTimezonePin } from '@src/shared/auth/storage'

const defaultValues: FilterType = {
  jobType: [],
  role: [],
  source: [],
  target: [],
  experience: [],
  testStatus: [],
  timezones: [],
  search: '',
  order: 'desc',
}

const initialFilter: OnboardingFilterType = {
  jobType: [],
  role: [],
  source: [],
  target: [],
  experience: [],
  testStatus: [],
  take: 500,
  skip: 0,
  order: 'desc',
}

export default function Onboarding() {
  const queryClient = useQueryClient()
  const savedFilter: FilterType | null = getUserFilters(
    FilterKey.ONBOARDING_LIST,
  )
    ? JSON.parse(getUserFilters(FilterKey.ONBOARDING_LIST)!)
    : null

  const [defaultFilter, setDefaultFilter] = useState<FilterType>(defaultValues)
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [rows, setRows] = useState<OnboardingListType[]>([])

  const { openModal, closeModal } = useModal()

  const [onboardingListPage, setOnboardingListPage] = useState<number>(0)
  const [onboardingListPageSize, setOnboardingListPageSize] =
    useState<number>(500)
  const [filters, setFilters] = useState<OnboardingFilterType | null>(null)
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  // const { data: onboardingProList, isLoading } =
  //   useGetOnboardingProList(filters)

  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )
  const [timezoneList, setTimezoneList] = useState<
    {
      id: number
      code: string
      label: string
      pinned: boolean
    }[]
  >([])
  const [idOrder, setIdOrder] = useState(true)
  const [isHoverId, setIsHoverId] = useState(false)

  const [expanded, setExpanded] = useState<string | false>('panel1')

  const languageList = getGloLanguage()

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues: defaultFilter,
    mode: 'onSubmit',
  })

  const onClickResetButton = () => {
    setRoleOptions(OnboardingListRolePair)
    setJobTypeOptions(JobList)
    reset(defaultValues)

    setFilters(initialFilter)
    saveUserFilters(FilterKey.ONBOARDING_LIST, { ...defaultValues })
  }

  const onSubmit = (data: FilterType) => {
    const {
      jobType,
      role,
      source,
      target,
      experience,
      testStatus,
      timezones,
      search,
    } = data

    saveUserFilters(FilterKey.ONBOARDING_LIST, data)
    setDefaultFilter(data)

    const filter = {
      jobType: jobType.map(value => value.value),
      role: role.map(value => value.value),
      source: source.map(value => value.value),
      target: target.map(value => value.value),
      testStatus: testStatus.map(value => value.value),
      experience: experience.map(value => value.value),
      timezones: timezones.map(value => value.label),
      search: search,
      take: onboardingListPageSize,
      skip: onboardingListPageSize * onboardingListPage,
      order: 'desc',
    }

    // console.log(filter)

    setFilters(filter)

    // queryClient.invalidateQueries(['onboarding-pro-list', filter])

    // console.log(data)
  }

  const handleFilterStateChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
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
      file.url = res
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

  const handleRowClick = (id: number) => {
    router.push(`/onboarding/detail/${id}`)
  }

  const columns: GridColDef[] = [
    {
      flex: 0.0567,
      field: 'id',
      minWidth: 120,
      headerName: 'No.',
      disableColumnMenu: true,
      hideSortIcons: true,
      sortable: false,
      renderHeader: () => (
        <Box
          onMouseOver={() => setIsHoverId(true)}
          onMouseLeave={() => setIsHoverId(false)}
          sx={{
            display: 'flex',
            minWidth: 120,
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Box>No.</Box>
          {isHoverId ? (
            <IconButton>
              <Icon
                icon={`mdi:${idOrder ? 'arrow-up' : 'arrow-down'}`}
                fontSize={18}
                onClick={() => {
                  setIdOrder(!idOrder)
                  saveUserFilters(FilterKey.ONBOARDING_LIST, {
                    ...defaultFilter,
                    order: idOrder ? 'asc' : 'desc',
                  })
                  setFilters(prevState => ({
                    ...prevState!,
                    order: idOrder ? 'asc' : 'desc',
                  }))
                }}
              />
            </IconButton>
          ) : null}
        </Box>
      ),
    },
    {
      flex: 0.1135,
      minWidth: 240,
      field: 'name',
      headerName: 'Legal name',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      cellClassName: 'highlight-cell',
      renderHeader: () => <Box>Legal name</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return (
          <LegalName
            row={{
              isOnboarded: row.isOnboarded,
              isActive: row.isActive,
              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
            }}
          />
        )
      },
    },
    {
      flex: 0.1135,
      minWidth: 240,
      field: 'email',
      headerName: 'Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Email</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return (
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {row.email}
          </Typography>
        )
      },
    },
    {
      flex: 0.0686,
      minWidth: 145,
      field: 'resume',
      headerName: 'Resume',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Resume</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return (
          <ListResume
            resume={row.resume}
            onClickFile={onClickFile}
          ></ListResume>
        )
      },
    },
    {
      flex: 0.1891,
      minWidth: 400,
      field: 'applicationInformation',
      headerName: 'Application information',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Application information</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        // 리턴받은 jobInfo를 createdAt 기준으로 내림차순 정렬, 나중에 백엔드에 정렬된 데이터를 달라고 요구해도 될듯
        row.jobInfo.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })

        // 필터에 Source, Target, jobType, role, testStatus가 있는 경우 매칭되는 jobInfo를 jobInfo의 0번째 인덱스로 이동시킴
        // 리스트에서 Job type/Role, Language Pair, Test status를 볼수있게 처리
        const sourceFilters = filters?.source || []
        const targetFilters = filters?.target || []
        const jobTypeFilters = filters?.jobType || []
        const roleFilters = filters?.role || []
        const testStatusFilters = filters?.testStatus || []

        row.jobInfo.some((value, idx) => {
          const source = value.source || ''
          const target = value.target || ''
          const jobType = value.jobType || ''
          const role = value.role || ''
          const testStatus = value.testStatus || ''
          if (
            (sourceFilters.length === 0 || sourceFilters.includes(source)) &&
            (targetFilters.length === 0 || targetFilters.includes(target)) &&
            (jobTypeFilters.length === 0 || jobTypeFilters.includes(jobType)) &&
            (roleFilters.length === 0 || roleFilters.includes(role)) &&
            (testStatusFilters.length === 0 ||
              testStatusFilters.includes(testStatus))
          ) {
            const dummy = row.jobInfo[idx]
            for (let i = idx; i > 0; i--) {
              row.jobInfo[i] = row.jobInfo[i - 1]
            }
            row.jobInfo[0] = dummy
            return true
          }
          return false
        })
        const jobInfo = row.jobInfo.map(value => ({
          jobType: value.jobType,
          role: value.role,
          source: value.source,
          target: value.target,
          testStatus: value.testStatus,
        }))
        return (
          <Tooltip
            title={
              jobInfo.length > 0 ? (
                <ul style={{ paddingLeft: '16px' }}>
                  {jobInfo.map(value => {
                    return (
                      <li key={uuidv4()}>
                        <span style={{ fontWeight: 600 }}>
                          {value.source?.toUpperCase()} &rarr;{' '}
                          {value.target?.toUpperCase()}&nbsp;
                        </span>
                        / {value.role} / {value.testStatus}
                      </li>
                    )
                  })}
                </ul>
              ) : null
            }
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Typography
                variant='body2'
                fontWeight={600}
                sx={{ color: '#4C4E64' }}
              >
                {jobInfo[0].source?.toUpperCase()} &rarr;{' '}
                {jobInfo[0].target?.toUpperCase()}
              </Typography>
              <JobTypeRoleChips
                jobType={jobInfo[0].jobType}
                role={jobInfo[0].role}
                visibleChip={'role'}
              />
              <TestStatus testStatus={[jobInfo[0].testStatus]} />
            </Box>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.156,
      minWidth: 330,
      field: 'role',
      headerName: 'Roles',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Roles</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        // 리턴받은 jobInfo를 createdAt 기준으로 내림차순 정렬, 나중에 백엔드에 정렬된 데이터를 달라고 요구해도 될듯
        row.jobInfo.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })

        // 필터에 Source, Target, jobType, role, testStatus가 있는 경우 매칭되는 jobInfo를 jobInfo의 0번째 인덱스로 이동시킴
        // 리스트에서 Job type/Role, Language Pair, Test status를 볼수있게 처리
        const sourceFilters = filters?.source || []
        const targetFilters = filters?.target || []
        const jobTypeFilters = filters?.jobType || []
        const roleFilters = filters?.role || []
        const testStatusFilters = filters?.testStatus || []

        row.jobInfo.some((value, idx) => {
          const source = value.source || ''
          const target = value.target || ''
          const jobType = value.jobType || ''
          const role = value.role || ''
          const testStatus = value.testStatus || ''
          if (
            (sourceFilters.length === 0 || sourceFilters.includes(source)) &&
            (targetFilters.length === 0 || targetFilters.includes(target)) &&
            (jobTypeFilters.length === 0 || jobTypeFilters.includes(jobType)) &&
            (roleFilters.length === 0 || roleFilters.includes(role)) &&
            (testStatusFilters.length === 0 ||
              testStatusFilters.includes(testStatus))
          ) {
            const dummy = row.jobInfo[idx]
            for (let i = idx; i > 0; i--) {
              row.jobInfo[i] = row.jobInfo[i - 1]
            }
            row.jobInfo[0] = dummy
            return true
          }
          return false
        })
        const uniqueRole = _.uniqBy(row.jobInfo, 'role')
        return <JobTypeRole jobInfo={uniqueRole} visibleType='role' />
      },
    },
    {
      flex: 0.0898,
      minWidth: 190,
      field: 'experience',
      headerName: 'Years of experience',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Years of experience</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return (
          <Typography
            variant='body2'
            fontWeight={400}
            sx={{ color: '#4C4E64' }}
          >
            {row.experience ?? '-'}
          </Typography>
        )
      },
    },
    {
      flex: 0.0946,
      minWidth: 200,
      field: 'timezone',
      headerName: `Pro's timezone`,
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Pro's timezone</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return (
          <Tooltip
            title={timeZoneFormatter(row.timezone, timezone.getValue()) || '-'}
          >
            <Typography
              variant='body2'
              fontWeight={400}
              sx={{
                color: '#4C4E64',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {timeZoneFormatter(row.timezone, timezone.getValue()) || '-'}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.1182,
      field: 'enrollment',
      minWidth: 250,
      headerName: 'Date of Enrollment',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Date of Enrollment</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return (
          <Box>
            {convertTimeToTimezone(
              row.createdAt,
              auth.getValue().user?.timezone,
              timezone.getValue(),
            )}
          </Box>
        )
      },
    },
  ]

  useEffect(() => {
    queryClient.invalidateQueries(['onboarding-pro-list'])
    queryClient.invalidateQueries(['onboarding-pro-details'])
  }, [])

  useEffect(() => {
    let mounted = true
    if (savedFilter) {
      const {
        jobType,
        role,
        source,
        target,
        experience,
        testStatus,
        search,
        timezones,
      } = savedFilter

      const filter = {
        jobType: jobType.map(value => value.value),
        role: role.map(value => value.value),
        source: source.map(value => value.value),
        target: target.map(value => value.value),
        testStatus: testStatus.map(value => value.value),
        experience: experience.map(value => value.value),
        timezones: timezones.map(value => value.label),
        search: search,
        take: 500,
        skip: 0,
        // take: onboardingListPageSize,
        // skip: onboardingListPageSize * onboardingListPage,
        order: 'desc',
      }

      if (JSON.stringify(defaultFilter) !== JSON.stringify(savedFilter)) {
        setDefaultFilter(savedFilter)

        reset(savedFilter)
      }
      if (JSON.stringify(filters) !== JSON.stringify(filter)) {
        setFilters(filter)
      }
    } else {
      setFilters(initialFilter)
    }
    return () => {
      mounted = false
    }
  }, [savedFilter])

  const loadTimezonePin = ():
    | {
        id: number
        code: string
        label: string
        pinned: boolean
      }[]
    | null => {
    const storedOptions = getTimezonePin()
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

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (filters) {
        setLoading(true)
        const rows = await getOnboardingProList(filters!)
        console.log(rows)

        if (mounted) {
          setLoading(false)
          setRows(rows.data ?? [])
          setTotalCount(rows.totalCount)
        }
      }
    })()
    return () => {
      mounted = false
    }
  }, [filters])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ width: '100%' }}>
        <Filters
          onboardingProListCount={totalCount}
          control={control}
          handleSubmit={handleSubmit}
          onSubmit={onSubmit}
          trigger={trigger}
          setJobTypeOptions={setJobTypeOptions}
          setRoleOptions={setRoleOptions}
          jobTypeOptions={jobTypeOptions}
          roleOptions={roleOptions}
          languageList={languageList}
          timezoneList={timezoneList}
          setTimezoneList={setTimezoneList}
          timezone={timezone.getValue()}
          onClickResetButton={onClickResetButton}
          handleFilterStateChange={handleFilterStateChange}
          expanded={expanded}
        />
      </Box>
      <Box sx={{ width: '100%' }}>
        <OnboardingList
          onboardingProListCount={totalCount}
          onboardingProList={rows || []}
          onboardingListPage={onboardingListPage}
          setOnboardingListPage={setOnboardingListPage}
          onboardingListPageSize={onboardingListPageSize}
          setOnboardingListPageSize={setOnboardingListPageSize}
          columns={columns}
          setFilters={setFilters}
          isLoading={loading}
          handleRowClick={handleRowClick}
          setRows={setRows}
          filters={filters!}
          setLoading={setLoading}
        />
      </Box>
    </Box>
  )
}

Onboarding.acl = {
  action: 'read',
  subject: 'onboarding',
}
