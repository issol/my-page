'use client'

import { Box, ButtonGroup, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'
import BlankLayout from '@src/@core/layouts/BlankLayout'
import BlankLayoutWithAppBar from '@src/@core/layouts/BlankLayoutWithAppBar'
import OpenLayout from '@src/@core/layouts/OpenLayout'
import UserLayout from '@src/layouts/UserLayout'
import { useGetJobOpeningList } from '@src/queries/pro/pro-job-openings'
import { getUserDataFromBrowser } from '@src/shared/auth/storage'
import { authState } from '@src/states/auth'
import { JobOpeningListFilterType } from '@src/types/pro/pro-job-openings'
import { ReactNode, Suspense, useEffect, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import Filter from './filter'
import { RoleSelectType, SelectType } from '@src/types/onboarding/list'
import { JobList } from '@src/shared/const/job/jobs'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { useForm } from 'react-hook-form'
import List from './list'
import {
  addDays,
  format,
  subDays,
  subHours,
  subMinutes,
  subMonths,
} from 'date-fns'

export type FilterType = {
  jobType: Array<{ label: string; value: string }>
  role: Array<{ label: string; value: string; jobType: string[] }>
  sourceLanguage: Array<{ label: string; value: string }>
  targetLanguage: Array<{ label: string; value: string }>
  dueDate: Array<{ label: string; value: string }>
  postedDate: Array<{ label: string; value: string }>
  experience: Array<{ label: string; value: string }>
}

const defaultValues: FilterType = {
  jobType: [],
  role: [],
  sourceLanguage: [],
  targetLanguage: [],
  dueDate: [],
  postedDate: [],
  experience: [],
}

const JobOpenings = () => {
  const auth = useRecoilValueLoadable(authState)

  const defaultFilter: JobOpeningListFilterType = {
    company: auth.getValue()?.user?.company ?? '',
    jobType: [],
    role: [],
    skip: 0,
    take: 10,
    source: [],
    target: [],
    dueDate: [],
    postedDate: [],
    yearsOfExperience: [],
  }
  const [filters, setFilters] =
    useState<JobOpeningListFilterType>(defaultFilter)
  const languageList = getGloLanguage()

  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const { data: jobOpenings, isLoading } = useGetJobOpeningList(filters)

  const onReset = () => {
    reset(defaultValues)
    setFilters(defaultFilter)
    setJobTypeOptions(JobList)
    setRoleOptions(OnboardingListRolePair)
  }

  const formatDueDateForFilter = (
    date: {
      label: string
      value: string
    }[],
  ) => {
    return date
      .map(item => {
        const now = new Date()
        let from, to

        switch (item.value) {
          case '0':
            to = format(now, 'yyyy-MM-dd HH:mm:ss')
            break
          case '2':
            from = format(now, 'yyyy-MM-dd HH:mm:ss')
            to = format(addDays(now, 2), 'yyyy-MM-dd HH:mm:ss')
            break
          case '3':
            from = format(now, 'yyyy-MM-dd HH:mm:ss')
            to = format(addDays(now, 6), 'yyyy-MM-dd HH:mm:ss')
            break
          case '9':
            from = format(now, 'yyyy-MM-dd HH:mm:ss')
            to = format(addDays(now, 7), 'yyyy-MM-dd HH:mm:ss')
            break
          case '10':
            from = format(now, 'yyyy-MM-dd HH:mm:ss')
            to = format(addDays(now, 14), 'yyyy-MM-dd HH:mm:ss')
            break
          case '11':
            from = format(addDays(now, 14), 'yyyy-MM-dd HH:mm:ss')
            break
        }

        return {
          ...(from !== undefined && { from }),
          ...(to !== undefined && { to }),
        }
      })
      .filter(item => item.from || item.to)
  }

  const formatPostedDateForFilter = (
    date: {
      label: string
      value: string
    }[],
  ) => {
    return date.map(item => {
      const now = new Date()
      let from,
        to = format(subMinutes(now, 1), 'yyyy-MM-dd HH:mm:ss')

      switch (item.value) {
        case '0':
          from = format(subHours(now, 24), 'yyyy-MM-dd HH:mm:ss')
          break
        case '2':
          from = format(subHours(now, 48), 'yyyy-MM-dd HH:mm:ss')
          break
        case '3':
          from = format(subDays(now, 7), 'yyyy-MM-dd HH:mm:ss')
          break
        case '9':
          from = format(subDays(now, 14), 'yyyy-MM-dd HH:mm:ss')
          break
        case '10':
          from = format(subMonths(now, 1), 'yyyy-MM-dd HH:mm:ss')
          break
      }

      return { from, to }
    })
  }

  const onSubmit = (data: FilterType) => {
    const {
      jobType,
      role,
      sourceLanguage,
      targetLanguage,
      dueDate,
      postedDate,
      experience,
    } = data

    const filter: JobOpeningListFilterType = {
      company: auth.getValue()?.user?.company ?? '',
      jobType: jobType.map(item => item.value),
      role: role.map(item => item.value),
      source: sourceLanguage.map(item => item.value),
      target: targetLanguage.map(item => item.value),
      dueDate: formatDueDateForFilter(dueDate),
      postedDate: formatPostedDateForFilter(postedDate),
      yearsOfExperience: experience.map(item => item.value),
      skip: 0,
      take: 10,
    }

    console.log(filter)

    setFilters(filter)
  }

  return (
    <Box display='flex' flexDirection='column' gap='24px'>
      <Box
        display='flex'
        width={'100%'}
        alignItems='center'
        justifyContent='space-between'
        padding='10px 0'
      >
        <PageHeader
          title={<Typography variant='h5'>Job openings</Typography>}
        />
      </Box>
      <Filter
        control={control}
        handleSubmit={handleSubmit}
        onReset={onReset}
        listCount={jobOpenings?.totalCount ?? 0}
        onSubmit={onSubmit}
        trigger={trigger}
        setJobTypeOptions={setJobTypeOptions}
        setRoleOptions={setRoleOptions}
        jobTypeOptions={jobTypeOptions}
        roleOptions={roleOptions}
        languageList={languageList}
      />
      <List
        list={jobOpenings?.data ?? []}
        listCount={jobOpenings?.totalCount ?? 0}
        page={page}
        setPage={setPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        setFilters={setFilters}
        isLoading={isLoading}
      />
    </Box>
  )
}

export default JobOpenings

JobOpenings.guestGuard = true
JobOpenings.getLayout = function getLayout(page: ReactNode) {
  return <UserLayout>{page}</UserLayout>
}
