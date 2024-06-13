import { Box, Card, styled, Typography } from '@mui/material'
import { MemberChip, PermissionChip } from '@src/@core/components/chips/chips'

import { RoleType } from '@src/context/types'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { Fragment, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import Contracts from './contracts'
import { Resolver, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { managerProfileSchema } from '@src/types/schema/profile.schema'
import {
  ManagerInfo,
  ManagerUserInfoType,
  ProUserInfoType,
} from '@src/types/sign/personalInfoTypes'
import useModal from '@src/hooks/useModal'

import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import SimpleAlertModal from 'src/pages/[companyName]/client/components/modals/simple-alert-modal'

import { useMutation } from 'react-query'
import {
  updateClientUserInfo,
  updateConsumerUserInfo,
  updateManagerUserInfo,
} from '@src/apis/user.api'
import useAuth from '@src/hooks/useAuth'
import { useGetProfile } from '@src/queries/userInfo/userInfo-query'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'
import { roleState } from '@src/states/permission'
import { useRouter } from 'next/router'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'

const MyAccount = () => {
  const router = useRouter()
  const auth = useAuth()
  const setAuth = useAuth()
  const [contractsEdit, setContractsEdit] = useState(false)

  function getProfileImg(role: RoleType) {
    return `/images/signup/role-${role.toLowerCase()}.png`
  }

  const { openModal, closeModal } = useModal()

  const userAuth = useRecoilValueLoadable(authState)

  const { data: userInfo, refetch } = useGetProfile(
    userAuth.getValue().user?.id! ?? 0,
  )
  const role = useRecoilValueLoadable(roleState)

  const getCurrentUserRole = () => {
    if (role.state === 'hasValue' && role.getValue()) {
      return role.getValue()[0].name
    }
    return ''
  }

  useEffect(() => {
    if (userInfo && !userInfo.firstName) {
      openModal({
        type: 'UpdatePersonalInformation',
        children: (
          <SimpleAlertModal
            message='Please update your personal information first.'
            onClose={() => closeModal('UpdatePersonalInformation')}
            vary={'info'}
          />
        ),
      })
    }
  }, [])
  const saveUserInfoMutation = useMutation(
    (
      data: (ManagerUserInfoType | ContactPersonType | ProUserInfoType) & {
        userId: number
      },
    ) =>
      ['LPM', 'TAD', 'ACCOUNT_MANAGER'].includes(getCurrentUserRole())
        ? updateManagerUserInfo({
            ...(data as ManagerUserInfoType & { userId: number }),
            company: 'GloZ',
          })
        : getCurrentUserRole() === 'CLIENT'
          ? updateClientUserInfo({
              ...(data as ContactPersonType & { userId: number }),
              clientId: userAuth.getValue().company?.clientId!,
              companyId: userAuth.getValue().company?.companyId!,
            })
          : updateConsumerUserInfo(
              data as ProUserInfoType & { userId: number },
            ),
    {
      onSuccess: () => {
        setContractsEdit(false)
        closeModal('SaveMyAccountModal')
        refetch()
        const { userId, email, accessToken } = router.query
        const accessTokenAsString: string = accessToken as string
        /* @ts-ignore */
        setAuth.updateUserInfo({
          userId: Number(userInfo?.id),
          email: userInfo?.email!,
          accessToken: accessTokenAsString,
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
    resolver: yupResolver(managerProfileSchema) as Resolver<ManagerInfo>,
  })

  useEffect(() => {
    if (userInfo) {
      reset({
        firstName: userInfo.firstName,
        lastName: userInfo.lastName,
        middleName: userInfo.middleName,
        email: userInfo.email,
        telephone: userInfo.telephone,
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
        telephone: data.telephone,
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
      {saveUserInfoMutation.isLoading ? <OverlaySpinner /> : null}
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
                  {role.state === 'hasValue' && role.getValue() && (
                    <Box sx={{ display: 'flex', gap: '8px' }}>
                      {role.getValue().map(value => {
                        return (
                          <Fragment key={uuidv4()}>
                            {MemberChip(value.name)}
                          </Fragment>
                        )
                      })}
                      {PermissionChip(role.getValue()[0]?.type)}
                    </Box>
                  )}
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