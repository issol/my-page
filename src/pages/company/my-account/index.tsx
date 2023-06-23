import { Box, Button, Card, Typography, styled } from '@mui/material'
import { MemberChip, PermissionChip } from '@src/@core/components/chips/chips'
import { AuthContext } from '@src/context/AuthContext'
import { RoleType } from '@src/context/types'
import { useAppSelector } from '@src/hooks/useRedux'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { Fragment, useContext, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Contracts from './contracts'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { managerProfileSchema } from '@src/types/schema/profile.schema'
import { ManagerInfo } from '@src/types/sign/personalInfoTypes'
import useModal from '@src/hooks/useModal'

import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'

const MyAccount = () => {
  const [contractsEdit, setContractsEdit] = useState(false)

  function getProfileImg(role: RoleType) {
    return `/images/signup/role-${role.toLowerCase()}.png`
  }

  const { openModal, closeModal } = useModal()

  const { user } = useContext(AuthContext)
  const role = useAppSelector(state => state.userAccess.role)
  console.log(role)

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ManagerInfo>({
    mode: 'onChange',
    resolver: yupResolver(managerProfileSchema),
  })

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        email: user.email,
        phone: user.phone,
        department: user.department,
        jobTitle: user.jobTitle,
        fax: user.fax,
        mobile: user.mobile,
        timezone: user.timezone,
      })
    }
  }, [user])

  const handleSaveInfo = () => {
    const data = getValues()
    // TODO API 연결

    setContractsEdit(false)
    closeModal('SaveMyAccountModal')
  }

  const handleCancelInfo = () => {
    setContractsEdit(false)
    closeModal('CancelMyAccountModal')
    reset()
  }

  const onClickSave = () => {
    openModal({
      type: 'SaveMyAccountModal',
      children: (
        <EditSaveModal
          onClose={() => closeModal('SaveMyAccountModal')}
          onClick={handleSaveInfo}
        />
      ),
    })
  }

  const onClickCancel = () => {
    openModal({
      type: 'CancelMyAccountModal',
      children: (
        <DiscardModal
          title='Are you sure to discard all changes?'
          onClose={() => closeModal('CancelMyAccountModal')}
          onClick={handleCancelInfo}
        />
      ),
    })
  }

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
                    {PermissionChip(role[0]?.type)}
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
        control={control}
        userInfo={user!}
        watch={watch}
        errors={errors}
        isValid={isValid}
        reset={reset}
        onClickSave={onClickSave}
        onClickCancel={onClickCancel}
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
