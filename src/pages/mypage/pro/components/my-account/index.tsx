import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material'
import { UserDataType } from '@src/context/types'
import { Fragment, useState } from 'react'
import styled from 'styled-components'
import ChangePasswordForm from './change-password-form'
import useModal from '@src/hooks/useModal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import { useMutation } from 'react-query'
import {
  changePassword,
  deleteAccount,
  getIsDeletableAccount,
} from '@src/apis/user.api'
import { toast } from 'react-hot-toast'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import DeleteAccount from './delete-account'
import AccountDeleteFailedModal from './account-delete-fail-modal'
import { useRouter } from 'next/router'

type Props = {
  user: UserDataType
}
export default function MyAccount({ user }: Props) {
  const router = useRouter()
  const { openModal, closeModal } = useModal()

  const [changePw, setChangePw] = useState(false)
  const [deleteAc, setDeleteAc] = useState(false)

  const updatePw = useMutation(
    ({ currPw, newPw }: { currPw: string; newPw: string }) =>
      changePassword(currPw, newPw),
    {
      onSuccess: () => {
        openModal({
          type: 'success',
          children: (
            <SimpleAlertModal
              message='Your password has been successfully reset.'
              onClose={() => {
                closeModal('success')
                setChangePw(false)
              }}
            />
          ),
        })
      },
      onError: () => onError(),
    },
  )

  function discardPwChange() {
    openModal({
      type: 'discardPw',
      children: (
        <DiscardModal
          title='Are you sure to discard all changes?'
          onClose={() => closeModal('discardPw')}
          onClick={() => {
            closeModal('discardPw')
            setChangePw(false)
          }}
        />
      ),
    })
  }

  function onPasswordReset(currPw: string, newPw: string) {
    updatePw.mutate({ currPw, newPw })
  }

  const deleteAccountMutation = useMutation(
    ({ reasonCode, text }: { reasonCode: number; text: string }) =>
      deleteAccount(reasonCode, text),
    {
      onSuccess: () => {
        router.push('/finish/delete-account')
      },
      onError: () => onError(),
    },
  )

  function onDeleteAccount(reasonCode: number, text: string) {
    deleteAccountMutation.mutate({ reasonCode, text })
  }

  function cannotDeleteAccount(e: { message: string }) {
    const errorData = JSON.parse(e.message)
    openModal({
      type: 'deleteFailed',
      children: (
        <AccountDeleteFailedModal
          onClose={() => closeModal('deleteFailed')}
          reason={errorData}
        />
      ),
    })
  }

  function onError() {
    toast.error(
      'Something went wrong while uploading files. Please try again.',
      {
        position: 'bottom-left',
      },
    )
  }

  return (
    <Card sx={{ padding: '24px' }}>
      <Grid container spacing={6}>
        {changePw ? (
          <Grid item xs={12}>
            <ChangePasswordForm
              user={user!}
              onCancel={discardPwChange}
              onReset={onPasswordReset}
            />
          </Grid>
        ) : deleteAc ? (
          <Grid item xs={12}>
            <DeleteAccount
              onCancel={() => setDeleteAc(false)}
              onDelete={onDeleteAccount}
            />
          </Grid>
        ) : (
          <Fragment>
            <Grid item xs={12}>
              <Typography variant='h6'>Account information</Typography>
            </Grid>
            <Grid item xs={12}>
              <BorderBox display='flex' flexDirection='column' gap='24px'>
                <LabelContainer>
                  <Typography fontWeight={600}>Sign-up date</Typography>
                  <Typography variant='body2'>
                    04/03/2023 (GMT+09:00) Korean Standard Time - Seoul
                  </Typography>
                </LabelContainer>
                <LabelContainer>
                  <Typography fontWeight={600}>Password</Typography>
                  {user?.fromSNS !== null ? (
                    <img
                      src={`/images/logos/${user?.fromSNS?.toLowerCase()}.png`}
                      alt='linked in'
                      width='24px'
                      height='24px'
                    />
                  ) : (
                    <Button
                      variant='outlined'
                      size='small'
                      sx={{ width: '160px' }}
                      onClick={() => setChangePw(true)}
                    >
                      Change password
                    </Button>
                  )}
                </LabelContainer>
              </BorderBox>
            </Grid>
            <Grid item xs={12} display='flex' justifyContent='flex-end'>
              <Button
                sx={{ padding: 0, textDecoration: 'underline' }}
                color='secondary'
                onClick={() =>
                  getIsDeletableAccount()
                    .then(() => {
                      setDeleteAc(true)
                    })
                    .catch(e => {
                      cannotDeleteAccount(e)
                    })
                }
              >
                Delete account
              </Button>
            </Grid>
          </Fragment>
        )}
      </Grid>
    </Card>
  )
}

const BorderBox = styled(Box)`
  padding: 20px;
  border-radius: 10px;
  border: 1px solid rgba(76, 78, 100, 0.12);
`
const LabelContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 5fr;
`
