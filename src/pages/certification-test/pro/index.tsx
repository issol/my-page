import { Box, Button, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'
import { authState } from '@src/states/auth'
import React, { Suspense, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import ProAppliedRoles from './components/applied-roles'
import { getCurrentRole } from '@src/shared/auth/storage'
import {
  useGetProAppliedRoles,
  useGetProContract,
} from '@src/queries/pro-certification-test/applied-roles'
import {
  ProAppliedRolesFilterType,
  ProAppliedRolesStatusHistoryType,
} from '@src/types/pro-certification-test/applied-roles'
import useModal from '@src/hooks/useModal'
import StatusHistoryModal from './components/modal/status-history-modal'
import ProCertificationTests from './components/certiciation-tests'
import { useGetContract } from '@src/queries/contract/contract.query'
import NDASigned from './components/nda-signed'
import { currentVersionType } from '@src/apis/contract.api'
import Image from 'next/image'
import ContractSigned from './components/contract-signed'

const defaultFilters: ProAppliedRolesFilterType = {
  take: 10,
  skip: 0,
  isActive: '0',
}

const ProCertificationTest = () => {
  const auth = useRecoilValueLoadable(authState)
  const role = getCurrentRole()
  const [signNDA, setSignNDA] = useState(false)
  const [signContract, setSignContract] = useState(false)

  const [ndaLanguage, setNdaLanguage] = useState<'ENG' | 'KOR'>('ENG')
  const [privacyContractLanguage, setPrivacyContractLanguage] = useState<
    'ENG' | 'KOR'
  >('ENG')
  const [freelancerContractLanguage, setFreelancerContractLanguage] = useState<
    'ENG' | 'KOR'
  >('ENG')

  const [filters, setFilters] =
    useState<ProAppliedRolesFilterType>(defaultFilters)
  const [seeOnlyActiveTests, setSeeOnlyActiveTests] = useState(false)
  const handleSeeOnlyActiveTests = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked
    setSeeOnlyActiveTests(checked)
    setFilters(prevState => ({
      ...prevState,
      isActive: checked ? '1' : '0',
    }))
  }

  const { data: appliedRoles, isLoading: appliedRolesLoading } =
    useGetProAppliedRoles(filters, auth.getValue().user?.userId!)

  const { data: ndaData, isLoading: ndaLoading } = useGetProContract({
    type: 'NDA',
    language: ndaLanguage,
  })

  const { data: privacyContractData, isLoading: privacyContractLoading } =
    useGetProContract({
      type: 'PRIVACY',
      language: privacyContractLanguage,
    })

  const { data: freelancerContractData, isLoading: freelancerContractLoading } =
    useGetProContract({
      type: 'FREELANCER',
      language: freelancerContractLanguage,
    })

  const statusList = [
    { value: 50100, label: 'Awaiting approval' },
    { value: 50200, label: 'Test assigned' },
    { value: 50300, label: 'Role assigned' },
    { value: 50400, label: 'Rejected by TAD' },
    { value: 50500, label: 'Test declined' },
    { value: 50600, label: 'Role declined' },
    { value: 50700, label: 'Basic test Ready' },
    { value: 50800, label: 'Skill test Ready' },
    { value: 50900, label: 'Paused' },
    { value: 501000, label: 'Basic in progress' },
    { value: 501200, label: 'Basic submitted' },
    { value: 501400, label: 'Basic failed' },
    { value: 501500, label: 'Basic passed' },
    { value: 501600, label: 'Skill in progress' },
    { value: 501700, label: 'Skill submitted' },
    { value: 501800, label: 'Skill failed' },
    { value: 501900, label: 'Skill passed' },
    { value: 502000, label: 'Skill passed' },
    { value: 502100, label: 'Contract required' },
    { value: 502200, label: 'Certified' },
    { value: 502300, label: 'Test in preparation' },
  ]

  return (
    <Box display='flex' flexDirection='column' gap='24px'>
      {signNDA && ndaData && !ndaLoading ? (
        <NDASigned
          nda={ndaData!}
          language={ndaLanguage}
          setLanguage={setNdaLanguage}
          setSignNDA={setSignNDA}
          auth={auth}
        />
      ) : signContract &&
        privacyContractData &&
        !privacyContractLoading &&
        freelancerContractData &&
        !freelancerContractLoading ? (
        <ContractSigned
          privacyContract={privacyContractData!}
          freelancerContract={freelancerContractData!}
          privacyContractLanguage={privacyContractLanguage}
          setPrivacyContractLanguage={setPrivacyContractLanguage}
          freelancerContractLanguage={freelancerContractLanguage}
          setFreelancerContractLanguage={setFreelancerContractLanguage}
          setSignContract={setSignContract}
          auth={auth}
        />
      ) : (
        <>
          <Box
            display='flex'
            width={'100%'}
            alignItems='center'
            justifyContent='space-between'
            padding='10px 0'
          >
            <PageHeader
              title={<Typography variant='h5'>Certification test</Typography>}
            />
          </Box>
          {auth.getValue().user?.isSignedNDA ? null : (
            <Box
              sx={{
                border: '2px solid #666CFF',
                borderRadius: '10px',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                background: '#FFF',
              }}
            >
              <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Typography
                  variant='body1'
                  color='#666CFF'
                  fontSize={20}
                  fontWeight={500}
                >
                  NDA
                </Typography>
                <Typography variant='body1'>
                  You must sign an NDA to proceed test and apply to roles.
                </Typography>
              </Box>
              <Box>
                <Button
                  variant='contained'
                  onClick={() => {
                    setSignNDA(true)
                    setNdaLanguage('ENG')
                    // getContractDetail({ type: 'NDA', language: 'ENG' }).then(
                    //   res => {
                    //     setNDA(res.currentVersion)
                    //   },
                    // )
                  }}
                >
                  Sign NDA
                </Button>
              </Box>
            </Box>
          )}
          {auth.getValue().user?.isSignedContract ? null : (
            <Box
              sx={{
                border: '2px solid #666CFF',
                borderRadius: '10px',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                background: '#FFF',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  width: '92%',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mr: '40px',
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant='body1'
                    color='#666CFF'
                    fontSize={20}
                    fontWeight={500}
                  >
                    Congratulations on your first certified role(s) 🎉
                  </Typography>
                  <Typography variant='body1'>
                    It’s time to sign on contracts to proceed with actual jobs.
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Button
                    variant='contained'
                    sx={{ height: '40px' }}
                    onClick={() => {
                      setSignContract(true)
                      // setSignNDA(true)
                      // setLanguage('ENG')
                      // getContractDetail({ type: 'NDA', language: 'ENG' }).then(
                      //   res => {
                      //     setNDA(res.currentVersion)
                      //   },
                      // )
                    }}
                  >
                    Sign Contracts
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignContent: 'center' }}>
                <Image
                  src='/images/icons/certification-test-icons/skill-test-passed.svg'
                  width={106}
                  height={140}
                  alt='success'
                />
              </Box>
            </Box>
          )}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Suspense>
              <ProAppliedRoles
                role={role!}
                statusList={statusList}
                auth={auth}
                setSignNDA={setSignNDA}
                setLanguage={setNdaLanguage}
                filters={filters}
                setFilters={setFilters}
                seeOnlyActiveTests={seeOnlyActiveTests}
                setSeeOnlyActiveTests={setSeeOnlyActiveTests}
                handleSeeOnlyActiveTests={handleSeeOnlyActiveTests}
                appliedRoles={appliedRoles!}
                appliedRolesLoading={appliedRolesLoading}
              />
            </Suspense>
            <Suspense>
              <ProCertificationTests
                appliedRoles={appliedRoles!.data}
                auth={auth}
              />
            </Suspense>
          </Box>
        </>
      )}
    </Box>
  )
}

export default ProCertificationTest

ProCertificationTest.acl = {
  action: 'read',
  subject: 'pro_certification_test',
}
