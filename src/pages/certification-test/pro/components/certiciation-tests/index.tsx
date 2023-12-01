import { Box, Card } from '@mui/material'
import {
  ProCertificationTestFilterType,
  ProCertificationTestListType,
} from '@src/types/pro-certification-test/certification-test'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import Filter from './filter'
import { RoleSelectType, SelectType } from '@src/types/onboarding/list'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { JobList } from '@src/shared/const/job/jobs'
import CertificationTestList from './list'
import { useGetProCertificationTestList } from '@src/queries/pro-certification-test/certification-tests'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'

export type FilterType = {
  jobType: Array<{ label: string; value: string }>
  role: Array<{ label: string; value: string; jobType: string[] }>
  sourceLanguage: Array<{ label: string; value: string }>
  targetLanguage: Array<{ label: string; value: string }>
}

const defaultValues: FilterType = {
  jobType: [],
  role: [],
  sourceLanguage: [],
  targetLanguage: [],
}

const defaultFilter: ProCertificationTestFilterType = {
  jobType: [],
  role: [],
  skip: 0,
  take: 10,
  sourceLanguage: [],
  targetLanguage: [],
}

const ProCertificationTests = () => {
  const { openModal, closeModal } = useModal()
  const [filters, setFilters] =
    useState<ProCertificationTestFilterType>(defaultFilter)

  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )

  const { data: certificationTestList, isLoading } =
    useGetProCertificationTestList(filters)

  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const languageList = getGloLanguage()

  const { control, handleSubmit, trigger, reset } = useForm<FilterType>({
    defaultValues,
    mode: 'onSubmit',
  })

  const onReset = () => {
    reset(defaultValues)
    setFilters(defaultFilter)
  }

  const onSubmit = (data: FilterType) => {
    const { jobType, role, sourceLanguage, targetLanguage } = data

    const filter: ProCertificationTestFilterType = {
      jobType: jobType.map(item => item.value),
      role: role.map(item => item.value),
      sourceLanguage: sourceLanguage.map(item => item.value),
      targetLanguage: targetLanguage.map(item => item.value),
      skip: 0,
      take: 10,
    }
    setFilters(filter)
  }

  const onClickApply = (data: ProCertificationTestListType) => {
    openModal({
      type: 'ApplyModal',
      children: (
        <CustomModal
          onClose={() => closeModal('ApplyModal')}
          onClick={() => closeModal('ApplyModal')}
          title='Are you sure you want to apply for'
          vary='successful'
          rightButtonText='Apply'
        />
      ),
    })
  }

  return (
    <Card>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Filter
          control={control}
          handleSubmit={handleSubmit}
          onReset={onReset}
          listCount={certificationTestList?.totalCount ?? 0}
          onSubmit={onSubmit}
          trigger={trigger}
          setJobTypeOptions={setJobTypeOptions}
          setRoleOptions={setRoleOptions}
          jobTypeOptions={jobTypeOptions}
          roleOptions={roleOptions}
          languageList={languageList}
        />
        <Suspense>
          <CertificationTestList
            list={certificationTestList?.data ?? []}
            listCount={certificationTestList?.totalCount ?? 0}
            page={page}
            setPage={setPage}
            rowsPerPage={rowsPerPage}
            setRowsPerPage={setRowsPerPage}
            setFilters={setFilters}
            isLoading={isLoading}
            onClickApply={onClickApply}
          />
        </Suspense>
      </Box>
    </Card>
  )
}

export default ProCertificationTests
