import { Box, Card, Typography } from '@mui/material'
import {
  ProCertificationTestFilterType,
  ProCertificationTestListType,
} from '@src/types/pro/pro-certification-test'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import Filter from './filter'
import {
  AddRolePayloadType,
  RoleSelectType,
  SelectType,
} from '@src/types/onboarding/list'
import { OnboardingListRolePair } from '@src/shared/const/role/roles'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { JobList } from '@src/shared/const/job/jobs'
import CertificationTestList from './list'
import { useGetProCertificationTestList } from '@src/queries/pro/pro-certification-tests'
import useModal from '@src/hooks/useModal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { ProAppliedRolesType } from '@src/types/pro/pro-applied-roles'
import AlertModal from '@src/@core/components/common-modal/alert-modal'
import InformationModal from '@src/@core/components/common-modal/information-modal'
import { getIsProBasicTestPassed } from '@src/apis/pro/pro-certification-tests'
import { Loadable } from 'recoil'
import { ClientUserType, UserDataType } from '@src/context/types'
import { useMutation, useQueryClient } from 'react-query'
import {
  addCreateProAppliedRole,
  addCreatedAppliedRole,
} from '@src/apis/onboarding.api'

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
  source: [],
  target: [],
}

type Props = {
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>
  appliedRoles: ProAppliedRolesType[]
}

const ProCertificationTests = ({ auth, appliedRoles }: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()
  const [filters, setFilters] =
    useState<ProCertificationTestFilterType>(defaultFilter)

  const [jobTypeOptions, setJobTypeOptions] = useState<SelectType[]>(JobList)
  const [roleOptions, setRoleOptions] = useState<RoleSelectType[]>(
    OnboardingListRolePair,
  )

  const applyTestMutation = useMutation(
    (jobInfo: AddRolePayloadType[]) => addCreateProAppliedRole(jobInfo),
    {
      onSuccess: (data, variables) => {
        closeModal('ApplyBasicPassedModal')
        queryClient.invalidateQueries(['Applied-roles'])
        queryClient.invalidateQueries(['CertificationTest-list'])
        // queryClient.invalidateQueries(['pro-overview'])
      },
    },
  )

  const { data: certificationTestList, isLoading } =
    useGetProCertificationTestList(
      filters,
      auth.getValue()?.user?.userId!,
      auth.getValue().user?.company!,
    )

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
    setJobTypeOptions(JobList)
    setRoleOptions(OnboardingListRolePair)
  }

  const onSubmit = (data: FilterType) => {
    const { jobType, role, sourceLanguage, targetLanguage } = data

    const filter: ProCertificationTestFilterType = {
      jobType: jobType.map(item => item.value),
      role: role.map(item => item.value),
      source: sourceLanguage.map(item => item.value),
      target: targetLanguage.map(item => item.value),
      skip: 0,
      take: 10,
    }
    setFilters(filter)
  }

  const onClickApply = (data: ProCertificationTestListType) => {
    const validAppliedRoles = appliedRoles.filter(
      value =>
        value.status === 'Awaiting approval' ||
        value.status === 'Basic test Ready' ||
        value.status === 'Skill test Ready' ||
        value.status === 'Basic in progress' ||
        value.status === 'Basic submitted' ||
        value.status === 'Basic passed' ||
        value.status === 'Skill in progress' ||
        value.status === 'Skill submitted' ||
        value.status === 'Paused' ||
        value.status === 'Test assigned' ||
        value.status === 'Role assigned',
    )

    if (validAppliedRoles.length >= 10) {
      openModal({
        type: 'ExceedModal',
        children: (
          <CustomModal
            onClose={() => closeModal('ExceedModal')}
            title={
              <>
                The maximum number of tests you can apply for at once is 10.
                <br />
                <br />
                Please apply again after completing the other tests.
              </>
            }
            vary='error'
            noButton
            rightButtonText=''
            onClick={() => closeModal('ExceedModal')}
            closeButton
          />
        ),
      })
    } else {
      if (!data.basicTest.isExist) {
        openModal({
          type: 'NoBasicApplyModal',
          children: (
            <CustomModal
              //TODO API 연결
              onClick={() => {
                applyTestMutation.mutate(
                  [
                    {
                      userId: auth.getValue().user?.userId!,
                      userCompany: auth.getValue().user?.company!,
                      jobType: data.jobType,
                      role: data.role,
                      source: data.source,
                      target: data.target,
                    },
                  ],
                  {
                    onSuccess: () => {
                      closeModal('NoBasicApplyModal')
                    },
                  },
                )
              }}
              onClose={() => closeModal('NoBasicApplyModal')}
              title={
                <>
                  Are you sure you want to apply for
                  <br />
                  <br />
                  <Typography
                    component={'span'}
                    variant='body2'
                    fontWeight={600}
                    fontSize={16}
                  >
                    {data.jobType} / {data.role}
                  </Typography>
                  <br />
                  <Typography
                    component={'span'}
                    variant='body2'
                    fontWeight={600}
                    fontSize={16}
                  >
                    {data.source.toUpperCase()} &rarr;{' '}
                    {data.target.toUpperCase()}&nbsp; role?
                  </Typography>
                  <br />
                  <br />
                  <Typography
                    component={'span'}
                    variant='subtitle2'
                    color='#666CFF'
                    fontSize={14}
                    fontWeight={500}
                  >
                    The role only requires a skill test.
                  </Typography>
                </>
              }
              rightButtonText='Apply'
              vary='successful'
            />
          ),
        })
      } else {
        getIsProBasicTestPassed(
          data.target,
          auth.getValue().user?.userId!,
        ).then(res => {
          if (res) {
            openModal({
              type: 'ApplyModal',
              children: (
                <CustomModal
                  //TODO API 연결
                  onClick={() => {
                    applyTestMutation.mutate(
                      [
                        {
                          userId: auth.getValue().user?.userId!,
                          userCompany: auth.getValue().user?.company!,
                          jobType: data.jobType,
                          role: data.role,
                          source: data.source,
                          target: data.target,
                        },
                      ],
                      {
                        onSuccess: () => {
                          closeModal('ApplyModal')
                        },
                      },
                    )
                  }}
                  onClose={() => closeModal('ApplyModal')}
                  title={
                    <>
                      Are you sure you want to apply for
                      <br />
                      <br />
                      <Typography
                        component={'span'}
                        variant='body2'
                        fontWeight={600}
                        fontSize={16}
                      >
                        {data.jobType} / {data.role}
                      </Typography>
                      <br />
                      <Typography
                        component={'span'}
                        variant='body2'
                        fontWeight={600}
                        fontSize={16}
                      >
                        {data.source.toUpperCase()} &rarr;{' '}
                        {data.target.toUpperCase()}&nbsp; role?
                      </Typography>
                      {res ? (
                        <>
                          <br />
                          <br />
                          <Typography
                            component={'span'}
                            variant='subtitle2'
                            color='#666CFF'
                            fontSize={14}
                            fontWeight={500}
                          >
                            The basic test will be waived for you considering
                            your previous test record.
                          </Typography>
                        </>
                      ) : null}
                    </>
                  }
                  rightButtonText='Apply'
                  vary='successful'
                />
              ),
            })
          } else {
            openModal({
              type: 'NoBasicApplyModal',
              children: (
                <CustomModal
                  //TODO API 연결
                  onClick={() => {
                    applyTestMutation.mutate(
                      [
                        {
                          userId: auth.getValue().user?.userId!,
                          userCompany: auth.getValue().user?.company!,
                          jobType: data.jobType,
                          role: data.role,
                          source: data.source,
                          target: data.target,
                        },
                      ],
                      {
                        onSuccess: () => {
                          closeModal('NoBasicApplyModal')
                        },
                      },
                    )
                  }}
                  onClose={() => closeModal('NoBasicApplyModal')}
                  title={
                    <>
                      Are you sure you want to apply for
                      <br />
                      <br />
                      <Typography
                        component={'span'}
                        variant='body2'
                        fontWeight={600}
                        fontSize={16}
                      >
                        {data.jobType} / {data.role}
                      </Typography>
                      <br />
                      <Typography
                        component={'span'}
                        variant='body2'
                        fontWeight={600}
                        fontSize={16}
                      >
                        {data.source.toUpperCase()} &rarr;{' '}
                        {data.target.toUpperCase()}&nbsp; role?
                      </Typography>
                    </>
                  }
                  rightButtonText='Apply'
                  vary='successful'
                />
              ),
            })
          }
        })
      }
    }
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
