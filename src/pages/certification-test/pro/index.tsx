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

const ProCertificationTest = () => {
  const auth = useRecoilValueLoadable(authState)
  const role = getCurrentRole()
  const [signNDA, setSignNDA] = useState(false)
  const [language, setLanguage] = useState<'ENG' | 'KOR'>('ENG')

  const { data: ndaData, isLoading } = useGetProContract({
    type: 'NDA',
    language: language,
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
      {signNDA && ndaData && !isLoading ? (
        <NDASigned
          nda={ndaData!}
          language={language}
          setLanguage={setLanguage}
          setSignNDA={setSignNDA}
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
                    setLanguage('ENG')
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
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Suspense>
              <ProAppliedRoles
                role={role!}
                statusList={statusList}
                auth={auth}
                setSignNDA={setSignNDA}
                setLanguage={setLanguage}
              />
            </Suspense>
            <Suspense>
              <ProCertificationTests />
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
