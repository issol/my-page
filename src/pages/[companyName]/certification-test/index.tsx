import { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Grid } from '@mui/material'

import { RoleSelectType } from '@src/types/onboarding/list'
import { SelectType } from '@src/types/onboarding/list'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { JobList } from '@src/shared/const/job/jobs'
import {
  TestMaterialFilterPayloadType,
  TestMaterialFilterType,
} from '@src/types/certification-test/list'
import { useForm } from 'react-hook-form'
import TestMaterialList from './components/list/list'
import { useGetTestMaterialList } from '@src/queries/certification-test/ceritification-test-list.query'
import TestMaterialFilters from './components/list/filters'
import { useRouter } from 'next/router'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { useRecoilValueLoadable, useSetRecoilState } from 'recoil'
import { authState } from '@src/states/auth'
import { useQueryClient } from 'react-query'
import { timezoneSelector } from '@src/states/permission'
import {
  FilterKey,
  getUserFilters,
  saveUserFilters,
} from '@src/shared/filter-storage'

const defaultValues: TestMaterialFilterType = {
  testType: [],
  jobType: [],
  role: [],
  source: [],
  target: [],
}

const initialFilter: TestMaterialFilterPayloadType = {
  jobType: [],
  testType: [],
  role: [],
  source: [],
  target: [],
  take: 10,
  skip: 0,
  userCompany: 'GloZ',
  sort: 'desc',
}

const CertificationTest = () => {
  const router = useRouter()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const savedFilter: TestMaterialFilterType | null = getUserFilters(
    FilterKey.CERTIFICATION_LIST,
  )
    ? JSON.parse(getUserFilters(FilterKey.CERTIFICATION_LIST)!)
    : null

  const [defaultFilter, setDefaultFilter] =
    useState<TestMaterialFilterType>(defaultValues)

  const queryClient = useQueryClient()

  const [testMaterialListPage, setTestMaterialListPage] = useState<number>(0)

  const [testMaterialListPageSize, setTestMaterialListPageSize] =
    useState<number>(10)

  const [filters, setFilters] = useState<TestMaterialFilterPayloadType | null>(
    null,
  )

  const { data: testMaterialList } = useGetTestMaterialList(filters)

  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )

  const [expanded, setExpanded] = useState<string | false>('panel1')

  const languageList = getGloLanguage()

  const {
    control,
    handleSubmit,
    trigger,
    reset,
    getValues: getFilterValues,
  } = useForm<TestMaterialFilterType>({
    defaultValues: defaultFilter,
    mode: 'onSubmit',
  })

  const onClickResetButton = () => {
    setRoleOptions(OnboardingListRolePair)
    setJobTypeOptions(JobList)
    reset({
      ...defaultValues,
    })

    setFilters({
      ...initialFilter,
    })
    saveUserFilters(FilterKey.CERTIFICATION_LIST, { ...initialFilter })
  }

  const onSubmit = (data: TestMaterialFilterType) => {
    const { jobType, role, source, target, testType } = data

    const filter = {
      testType: testType.map(value =>
        value.label === 'Basic test' ? 'basic' : 'skill',
      ),
      jobType: jobType.map(value => value.value),
      role: role.map(value => value.value),
      source: source.map(value => value.value),
      target: target.map(value => value.value),
      userCompany: 'GloZ',
      take: testMaterialListPageSize,
      skip: testMaterialListPageSize * testMaterialListPage,
      sort: 'desc',
    }
    saveUserFilters(FilterKey.CERTIFICATION_LIST, data)
    setDefaultFilter(data)
    setFilters(filter)
    queryClient.invalidateQueries(['test-material-list', filter])
  }

  const handleFilterStateChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }

  useEffect(() => {
    queryClient.invalidateQueries(['test-material-list'])
    queryClient.invalidateQueries(['test-detail'])
  }, [])

  useEffect(() => {
    if (savedFilter) {
      const { jobType, role, source, target, testType } = savedFilter

      const filter = {
        testType: testType.map(value =>
          value.label === 'Basic test' ? 'basic' : 'skill',
        ),
        jobType: jobType.map(value => value.value),
        role: role.map(value => value.value),
        source: source.map(value => value.value),
        target: target.map(value => value.value),
        userCompany: 'GloZ',
        take: testMaterialListPageSize,
        skip: testMaterialListPageSize * testMaterialListPage,
        sort: 'desc',
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
    <>
      {auth.state === 'hasValue' && (
        <Grid container spacing={6}>
          <TestMaterialFilters
            control={control}
            handleSubmit={handleSubmit}
            onSubmit={onSubmit}
            onClickResetButton={onClickResetButton}
            trigger={trigger}
            setJobTypeOptions={setJobTypeOptions}
            setRoleOptions={setRoleOptions}
            jobTypeOptions={jobTypeOptions}
            roleOptions={roleOptions}
            languageList={languageList}
            handleFilterStateChange={handleFilterStateChange}
            expanded={expanded}
            getValues={getFilterValues}
          />
          <TestMaterialList
            testMaterialList={testMaterialList!}
            testMaterialListPage={testMaterialListPage}
            setTestMaterialListPage={setTestMaterialListPage}
            testMaterialListPageSize={testMaterialListPageSize}
            setTestMaterialListPageSize={setTestMaterialListPageSize}
            setFilters={setFilters}
            router={router}
            user={auth.getValue().user!}
            timezoneList={timezone.getValue()}
          />
        </Grid>
      )}
    </>
  )
}

export default CertificationTest

CertificationTest.acl = {
  action: 'read',
  subject: 'certification_test',
}
