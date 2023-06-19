import { Box, Button, Card, Typography, styled } from '@mui/material'
import { MemberChip, PermissionChip } from '@src/@core/components/chips/chips'
import { AuthContext } from '@src/context/AuthContext'
import { RoleType } from '@src/context/types'
import { useAppSelector } from '@src/hooks/useRedux'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { Fragment, useContext, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Contracts from './contracts'

const MyAccount = () => {
  const [contractsEdit, setContractsEdit] = useState(false)

  function getProfileImg(role: RoleType) {
    return `/images/signup/role-${role.toLowerCase()}.png`
  }

  const { user } = useContext(AuthContext)
  const role = useAppSelector(state => state.userAccess.role)

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <DesignedCard>
        <Card sx={{ padding: '24px' }}>
          <Box sx={{ position: 'relative', display: 'flex', gap: '30px' }}>
            <Card>
              <img width={110} height={110} src={getProfileImg('TAD')} alt='' />
            </Card>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '30px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',

                  gap: '10px',
                }}
              >
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: '16px' }}
                >
                  <Typography variant='h5'>
                    {getLegalName({
                      firstName: user?.firstName,
                      lastName: user?.lastName,
                      middleName: user?.middleName,
                    })}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: '8px' }}>
                    {role.map(value => {
                      return (
                        <Fragment key={uuidv4()}>
                          {MemberChip(value.name)}
                        </Fragment>
                      )
                    })}
                    {PermissionChip(role[0].type)}
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                  }}
                >
                  <Typography variant='body2'>
                    {user?.department ?? '-'} |&nbsp;
                  </Typography>
                  <Typography variant='body2'>
                    {user?.jobTitle ?? '-'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Card>
      </DesignedCard>

      <Contracts
        edit={contractsEdit}
        setEdit={setContractsEdit}
        userInfo={user!}
      />
    </Box>
  )
}

export default MyAccount

const DesignedCard = styled(Card)`
  position: relative;

  :before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 0.88),
        rgba(255, 255, 255, 0.88)
      ),
      #72e128;
  }
`

MyAccount.acl = {
  subject: 'my_account',
  action: 'read',
}
