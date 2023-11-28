import { Box, Typography } from '@mui/material'
import PageHeader from '@src/@core/components/page-header'
import { authState } from '@src/states/auth'
import React, { Suspense, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import ProAppliedRoles from './components/applied-roles'
import { getCurrentRole } from '@src/shared/auth/storage'
import { useGetProAppliedRoles } from '@src/queries/pro-certification-test/applied-roles'
import {
  ProAppliedRolesFilterType,
  ProAppliedRolesStatusHistoryType,
} from '@src/types/pro-certification-test/applied-roles'
import useModal from '@src/hooks/useModal'
import StatusHistoryModal from './components/modal/status-history-modal'
import ProCertificationTests from './components/certiciation-tests'

const ProCertificationTest = () => {
  const auth = useRecoilValueLoadable(authState)
  const role = getCurrentRole()

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
    <Box display='flex' flexDirection='column'>
      <Box
        display='flex'
        width={'100%'}
        alignItems='center'
        justifyContent='space-between'
        padding='10px 0 24px'
      >
        <PageHeader
          title={<Typography variant='h5'>Certification test</Typography>}
        />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <Suspense>
          <ProAppliedRoles role={role!} statusList={statusList} auth={auth} />
        </Suspense>
        <Suspense>
          <ProCertificationTests />
        </Suspense>
      </Box>
    </Box>
  )
}

export default ProCertificationTest

ProCertificationTest.acl = {
  action: 'read',
  subject: 'pro_certification_test',
}
