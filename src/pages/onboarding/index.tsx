import { Grid, IconButton, Typography } from '@mui/material'

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
import LegalNameEmail from './components/list/list-item/legalname-email'
import JobTypeRole from '../components/job-type-role-chips'
import TestStatus from './components/list/list-item/test-status'
import Icon from '@src/@core/components/icon'
import { useQueryClient } from 'react-query'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'

const defaultValues: FilterType = {
  jobType: [],
  role: [],
  source: [],
  target: [],
  experience: [],
  testStatus: [],
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
  take: 10,
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

  const [onboardingListPage, setOnboardingListPage] = useState<number>(0)
  const [onboardingListPageSize, setOnboardingListPageSize] =
    useState<number>(10)
  const [filters, setFilters] = useState<OnboardingFilterType | null>(null)

  const { data: onboardingProList, isLoading } =
    useGetOnboardingProList(filters)

  const { data: totalStatistics } = useGetStatistic()
  const { data: onboardingStatistic } = useGetOnboardingStatistic()
  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )
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
    const { jobType, role, source, target, experience, testStatus, search } =
      data

    saveUserFilters(FilterKey.ONBOARDING_LIST, data)
    setDefaultFilter(data)

    const filter = {
      jobType: jobType.map(value => value.value),
      role: role.map(value => value.value),
      source: source.map(value => value.value),
      target: target.map(value => value.value),
      testStatus: testStatus.map(value => value.value),
      experience: experience.map(value => value.value),
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

  const columns: GridColumns<OnboardingListType> = [
    {
      flex: 0.1,
      field: 'id',
      minWidth: 80,
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
            minWidth: 80,
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
      flex: 0.25,
      minWidth: 200,
      field: 'name',
      headerName: 'Legal name / Email',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Legal name / Email</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return (
          <LegalNameEmail
            row={{
              isOnboarded: row.isOnboarded,
              isActive: row.isActive,

              firstName: row.firstName,
              middleName: row.middleName,
              lastName: row.lastName,
              email: row.email,
            }}
            link={`/onboarding/detail/${row.userId}`}
          />
        )
      },
    },
    {
      flex: 0.15,
      minWidth: 100,
      field: 'experience',
      headerName: 'Experience',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Experience</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return <Typography variant='body1'>{row.experience}</Typography>
      },
    },
    {
      flex: 0.4,
      minWidth: 180,
      field: 'jobInfo',
      headerName: 'Job type / Role',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Job type / Role</Box>,
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
        }))
        return <JobTypeRole jobInfo={jobInfo} />
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      field: 'languages',
      headerName: 'Language pair',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Language pair</Box>,
      renderCell: ({ row }: OnboardingListCellType) => (
        <Box>
          {!row.jobInfo.length ? (
            '-'
          ) : (
            <Box key={row.id}>
              <Typography variant='body1' sx={{ fontWeight: 600 }}>
                {row.jobInfo[0].source && row.jobInfo[0].target ? (
                  <>
                    {row.jobInfo[0].source.toUpperCase()} &rarr;{' '}
                    {row.jobInfo[0].target.toUpperCase()}
                  </>
                ) : (
                  '-'
                )}
              </Typography>
            </Box>
          )}
        </Box>
      ),
    },
    {
      flex: 0.17,
      field: 'age',
      minWidth: 80,
      headerName: 'testStatus',
      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => <Box>Test status</Box>,
      renderCell: ({ row }: OnboardingListCellType) => {
        return <TestStatus row={row} />
      },
    },
  ]

  useEffect(() => {
    queryClient.invalidateQueries(['onboarding-pro-list'])
    queryClient.invalidateQueries(['onboarding-pro-details'])
  }, [])

  useEffect(() => {
    if (savedFilter) {
      const { jobType, role, source, target, experience, testStatus, search } =
        savedFilter

      const filter = {
        jobType: jobType.map(value => value.value),
        role: role.map(value => value.value),
        source: source.map(value => value.value),
        target: target.map(value => value.value),
        testStatus: testStatus.map(value => value.value),
        experience: experience.map(value => value.value),
        search: search,
        take: onboardingListPageSize,
        skip: onboardingListPageSize * onboardingListPage,
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
  }, [savedFilter])

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Onboarding list</Typography>}
      />
      <OnboardingDashboard
        totalStatistics={totalStatistics!}
        onboardingStatistic={onboardingStatistic!}
      />
      <Filters
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
      />
      <OnboardingList
        onboardingProListCount={onboardingProList?.totalCount || 0}
        onboardingProList={onboardingProList?.data || []}
        onboardingListPage={onboardingListPage}
        setOnboardingListPage={setOnboardingListPage}
        onboardingListPageSize={onboardingListPageSize}
        setOnboardingListPageSize={setOnboardingListPageSize}
        columns={columns}
        setFilters={setFilters}
        isLoading={isLoading}
      />
    </Grid>
  )
}

Onboarding.acl = {
  action: 'read',
  subject: 'onboarding',
}
