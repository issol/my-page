import { SyntheticEvent, useState } from 'react'
import { Grid } from '@mui/material'
import { DefaultRolePair } from 'src/shared/const/onboarding'
import { RoleSelectType } from 'src/types/onboarding/list'
import { SelectType } from 'src/types/onboarding/list'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import { JobList } from 'src/shared/const/personalInfo'
import {
  TestMaterialFilterPayloadType,
  TestMaterialFilterType,
} from 'src/types/certification-test/list'
import { useForm } from 'react-hook-form'
import TestMaterialList from './components/list/list'
import { useGetTestMaterialList } from 'src/queries/certification-test/ceritification-test-list.query'
import TestMaterialFilters from './components/list/filters'
import { useRouter } from 'next/router'

const defaultValues: TestMaterialFilterType = {
  testType: [],
  jobType: [],
  role: [],
  source: [],
  target: [],
}

const CertificationTest = () => {
  const router = useRouter()
  const [testMaterialListPage, setTestMaterialListPage] = useState<number>(0)
  const [testMaterialListPageSize, setTestMaterialListPageSize] =
    useState<number>(10)

  const [filters, setFilters] = useState<TestMaterialFilterPayloadType>({
    jobType: [],
    testType: [],
    role: [],
    source: [],
    target: [],
    take: testMaterialListPageSize,
    skip: testMaterialListPageSize * testMaterialListPage,
    userCompany: 'GloZ',
  })

  const { data: testMaterialList } = useGetTestMaterialList(filters)

  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] =
    useState<RoleSelectType[]>(DefaultRolePair)

  const [expanded, setExpanded] = useState<string | false>('panel1')

  const languageList = getGloLanguage()

  const { control, handleSubmit, trigger, reset } =
    useForm<TestMaterialFilterType>({
      defaultValues,
      mode: 'onSubmit',
    })

  const onClickResetButton = () => {
    setRoleOptions(DefaultRolePair)
    setJobTypeOptions(JobList)
    reset({
      testType: [],
      jobType: [],
      role: [],
      source: [],
      target: [],
    })

    setFilters({
      testType: [],
      jobType: [],
      role: [],
      source: [],
      target: [],
      take: testMaterialListPageSize,
      skip: testMaterialListPageSize * testMaterialListPage,
      userCompany: 'GloZ',
    })
  }

  const onSubmit = (data: TestMaterialFilterType) => {
    const { jobType, role, source, target, testType } = data

    const filter = {
      testType: testType.map(value => value.label),
      jobType: jobType.map(value => value.value),
      role: role.map(value => value.value),
      source: source.map(value => value.value),
      target: target.map(value => value.value),
      userCompany: 'GloZ',
      take: testMaterialListPageSize,
      skip: testMaterialListPageSize * testMaterialListPage,
    }

    setFilters(filter)
  }

  const handleFilterStateChange =
    (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }
  return (
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
      />
      <TestMaterialList
        testMaterialList={testMaterialList!}
        testMaterialListPage={testMaterialListPage}
        setTestMaterialListPage={setTestMaterialListPage}
        testMaterialListPageSize={testMaterialListPageSize}
        setTestMaterialListPageSize={setTestMaterialListPageSize}
        setFilters={setFilters}
        router={router}
      />
    </Grid>
  )
}

export default CertificationTest

CertificationTest.acl = {
  action: 'read',
  subject: 'certification_test',
}
