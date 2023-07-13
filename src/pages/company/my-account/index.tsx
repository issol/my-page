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
import {
  ManagerInfo,
  ManagerUserInfoType,
} from '@src/types/sign/personalInfoTypes'
import useModal from '@src/hooks/useModal'

import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import { useMutation } from 'react-query'
import { getUserInfo, updateManagerUserInfo } from 'src/apis/user.api'
import { useAuth } from '@src/hooks/useAuth'
import { useGetProfile } from '@src/queries/userInfo/userInfo-query'

const MyAccount = () => {
  const auth = useAuth()
  const [contractsEdit, setContractsEdit] = useState(false)

  function getProfileImg(role: RoleType) {
    return `/images/signup/role-${role.toLowerCase()}.png`
  }

  const { openModal, closeModal } = useModal()

  const { user } = useContext(AuthContext)
  const { data: userInfo, refetch } = useGetProfile(user?.id! ?? 0)
  const role = useAppSelector(state => state.userAccess.role)

  const saveUserInfoMutation = useMutation(
    (data: ManagerUserInfoType & { userId: number }) =>
      updateManagerUserInfo({ ...data, company: 'GloZ' }),
    {
      onSuccess: () => {
        setContractsEdit(false)
        closeModal('SaveMyAccountModal')
        refetch()
        /* @ts-ignore */
        auth.updateUserInfo({
          userId: Number(userInfo?.id),
          email: userInfo?.email!,
        })
      },
    },
  )

  const {
    control,

    getValues,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<ManagerInfo>({
    mode: 'onChange',
    resolver: yupResolver(managerProfileSchema),
  })

  useEffect(() => {
    if (userInfo) {
      reset({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        middleName: userInfo.middleName,
        email: userInfo.email,
        telePhone: userInfo.telePhone,
        department: userInfo.department,
        jobTitle: userInfo.jobTitle,
        fax: userInfo.fax,
        mobilePhone: userInfo.mobilePhone,
        timezone: userInfo.timezone,
      })
    }
  }, [userInfo])

  const handleSaveInfo = () => {
    const data = getValues()

    const finalData: ManagerUserInfoType & { userId: number } = {
      userId: userInfo?.userId ?? 0,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      country: data.timezone.label,
      extraData: {
        timezone: data.timezone,
        jobTitle: data.jobTitle,
        mobilePhone: data.mobilePhone,
        telePhone: data.telePhone,
        department: data.department,
        fax: data.fax,
      },
    }
    saveUserInfoMutation.mutate(finalData)
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
                      firstName: userInfo?.firstName,
                      lastName: userInfo?.lastName,
                      middleName: userInfo?.middleName,
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
                    {userInfo?.department ?? '-'} |&nbsp;
                  </Typography>
                  <Typography variant='body2'>
                    {userInfo?.jobTitle ?? '-'}
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
        userInfo={userInfo!}
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
