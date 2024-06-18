import { Suspense, useEffect, useState, useContext } from 'react'
import { useMutation, useQueryClient } from 'react-query'

import {
  useGetMembers,
  useGetSignUpRequests,
} from '@src/queries/company/company-members'
import {
  deleteMember,
  patchMember,
  requestAction,
  undoRequest,
} from '@src/apis/company/company-members.api'

import toast from 'react-hot-toast'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import SignUpRequests from '../components/sign-up-requests'
import MemberList from '../components/member-list'
import {
  MembersType,
  RequestPayloadType,
  SignUpRequestsType,
} from '@src/types/company/members'

import { AbilityContext } from '@src/layouts/components/acl/Can'

import { getCurrentRole } from '@src/shared/auth/storage'
import { roleState } from '@src/states/permission'
import { useRecoilValueLoadable } from 'recoil'

import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { Typography } from '@mui/material'
import useModal from '@src/hooks/useModal'
import { useGetSeats } from '@src/queries/company/company-seats.query'
import { assignSeat, deleteSeat } from '@src/apis/company/company-seats.api'

const RoleArray = ['TAD', 'LPM']
const Members = () => {
  const isClient = getCurrentRole()?.name === 'CLIENT'
  const { openModal, closeModal } = useModal()

  const ability = useContext(AbilityContext)
  const { data: signUpRequests, isError } = useGetSignUpRequests(
    ability.can('update', 'permission_request'),
  )
  const { data: members, refetch } = useGetMembers(
    ability.can('read', 'members'),
  )
  const { data: seats, refetch: refetchSeats } = useGetSeats()

  const role = useRecoilValueLoadable(roleState)
  const hasGeneralPermission = () => {
    let flag = false
    if (role.state === 'hasValue' && role.getValue()) {
      role.getValue().map(item => {
        if (
          (item.name === 'LPM' ||
            item.name === 'TAD' ||
            item.name === 'CLIENT') &&
          item.type === 'General'
        )
          flag = true
      })
    }
    return flag
  }

  const [requestsPage, setRequestsPage] = useState<number>(0)
  const [membersPage, setMembersPage] = useState<number>(0)
  const [requestsPageSize, setRequestsPageSize] = useState<number>(10)
  const [membersPageSize, setMembersPageSize] = useState<number>(10)
  const [user, setUser] = useState<SignUpRequestsType[]>([])
  const [memberList, setMemberList] = useState<MembersType[]>([])

  const queryClient = useQueryClient()

  const requestActionMutation = useMutation(
    (value: RequestPayloadType) => requestAction(value.payload),
    {
      onSuccess: (data, variables) => {
        displayUndoToast(variables.user, variables.payload.reply)
      },
    },
  )

  const undoRequestActionMutation = useMutation((user: SignUpRequestsType) =>
    undoRequest({ rId: user.rId, reply: 'no_reply' }),
  )
  const patchMemberMutation = useMutation(
    (data: { userId: number; permissionGroups: string[] }) => patchMember(data),
    {
      onSuccess: data => {
        refetch()
      },
    },
  )

  const deleteMemberMutation = useMutation(
    (userId: number) => deleteMember(userId),
    {
      onSuccess: data => {
        refetch()
      },
    },
  )

  const assignSeatMutation = useMutation(
    (userId: number) => assignSeat(userId),
    {
      onSuccess: data => {
        refetchSeats()
      },
    },
  )

  const deleteSeatMutation = useMutation(
    (userId: number) => deleteSeat(userId),
    {
      onSuccess: data => {
        refetchSeats()
      },
    },
  )

  const invalidateMemberQueries = () => {
    queryClient.invalidateQueries('signup-requests')
    queryClient.invalidateQueries('members')
    queryClient.invalidateQueries('seats')
  }

  const handleDeleteRole = (
    role: string,
    user: {
      id: number
      roles: string[]
    },
  ) => {
    setUser(prevState =>
      prevState.map(value => ({
        ...value,
        roles:
          value.id === user.id
            ? value.roles.filter(char => char !== role)
            : value.roles,
      })),
    )
  }

  const handleAddRole = (
    role: string,
    user: {
      id: number
      roles: string[]
    },
  ) => {
    setUser(prevState =>
      prevState.map(value => ({
        ...value,
        roles: value.id === user.id ? RoleArray : value.roles,
      })),
    )
  }

  const undoAction = (user: SignUpRequestsType, reply: string) => {
    undoRequestActionMutation.mutate(user, {
      onSuccess: () => {
        invalidateMemberQueries()
        toast.dismiss()
      },
    })
  }

  const undoDecline = (user: SignUpRequestsType) => {
    undoRequestActionMutation.mutate(user, {
      onSuccess: () => {
        invalidateMemberQueries()
        toast.dismiss()
      },
    })
  }

  const undoApprove = (user: SignUpRequestsType) => {
    // console.log(user)

    undoRequestActionMutation.mutate(user, {
      onSuccess: () => {
        invalidateMemberQueries()
        toast.dismiss()
      },
    })
  }

  const displayUndoToast = (
    user: SignUpRequestsType,
    action: string,
    member?: MembersType,
  ) => {
    const myPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        // setSelectedUser(undefined)
        resolve('foo')
      }, 5000)
    })

    return toast.promise(
      myPromise,
      {
        loading: (
          <div>
            {action === 'reject'
              ? `Declined successfully`
              : `Approve successfully`}
            <Button
              onClick={() => {
                undoAction(user, action)
              }}
            >
              Undo
            </Button>
          </div>
        ),
        success: <></>,
        error: 'Error when fetching',
      },
      {
        position: 'top-center',
        style: {
          borderRadius: '8px',
          marginTop: '24px',
          height: '49px',
          background: '#333',
          color: '#fff',
        },
        loading: {
          icon: '',
        },
        success: {
          duration: 0,
          style: {
            display: 'none',
          },
        },
      },
    )
  }

  const declineSignUpRequest = (user: SignUpRequestsType) => {
    requestActionMutation.mutate(
      {
        payload: {
          rId: user.rId,
          reply: 'reject',
          roles: user.roles,
        },
        user: user,
      },
      {
        onSuccess: () => {
          invalidateMemberQueries()
        },
      },
    )
  }

  const approveSignUpRequest = (user: SignUpRequestsType) => {
    requestActionMutation.mutate(
      {
        payload: {
          rId: user.rId,
          reply: 'accept',
          roles: user.roles,
        },
        user: user,
      },
      {
        onSuccess: () => {
          invalidateMemberQueries()
        },
      },
    )
  }

  const handleAssignSeat = (userId: number) => {
    assignSeatMutation.mutate(userId,
      {
        onSuccess: () => {
          invalidateMemberQueries()
        },
      },
    )
  }

  const handleDeleteSeat = (userId: number) => {
    deleteSeatMutation.mutate(userId,
      {
        onSuccess: () => {
          invalidateMemberQueries()
        },
      },
    )
  }

  const handleApproveSignUpRequest = (user: SignUpRequestsType) => {
    openModal({
      type: 'approveSignUpRequestModal',
      children: (
        <CustomModal
          vary='successful'
          onClick={() => {
            closeModal('approveSignUpRequestModal')
            approveSignUpRequest(user)
          }}
          title={
            <>
              {isClient
                ? 'Are you sure to approve the sign-up request for this account?'
                : 'Are you sure to approve the sign up request for this account?'}
              <Typography variant='body2' fontWeight={600}>
                {user.email}
              </Typography>
            </>
          }
          onClose={() => closeModal('approveSignUpRequestModal')}
          rightButtonText='Approve'
        />
      ),
    })
  }

  const handleDeclineSignUpRequest = (user: SignUpRequestsType) => {
    openModal({
      type: 'declineSignUpRequestModal',
      children: (
        <CustomModal
          vary='error'
          onClick={() => {
            closeModal('declineSignUpRequestModal')
            declineSignUpRequest(user)
          }}
          title={
            <>
              {isClient
                ? 'Are you sure to decline the sign-up request for this account?'
                : 'Are you sure to decline the sign up request for this account?'}
              <Typography variant='body2' fontWeight={600}>
                {user.email}
              </Typography>
            </>
          }
          onClose={() => closeModal('declineSignUpRequestModal')}
          rightButtonText='Decline'
        />
      ),
    })
  }

  const checkPermission = () => {
    return ability.can('update', 'permission_request')
  }

  useEffect(() => {
    if (signUpRequests && !isError) {
      setUser(signUpRequests)
    }
  }, [signUpRequests, isError])

  useEffect(() => {
    members && setMemberList(members)
  }, [members])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Suspense>
        {user && user.length && !hasGeneralPermission() ? (
          <SignUpRequests
            data={user}
            requestsPage={requestsPage}
            requestsPageSize={requestsPageSize}
            setRequestsPage={setRequestsPage}
            setRequestsPageSize={setRequestsPageSize}
            handleDeleteRole={handleDeleteRole}
            handleAddRole={handleAddRole}
            handleDeclineSignUpRequest={handleDeclineSignUpRequest}
            handleApproveSignUpRequest={handleApproveSignUpRequest}
            checkPermission={checkPermission}
          />
        ) : null}

        <MemberList
          membersPage={membersPage}
          setMembersPage={setMembersPage}
          membersPageSize={membersPageSize}
          setMembersPageSize={setMembersPageSize}
          memberList={memberList}
          patchMemberMutation={patchMemberMutation}
          deleteMemberMutation={deleteMemberMutation}
          hasGeneralPermission={hasGeneralPermission()}
          seats={seats}
          handleAssignSeat={handleAssignSeat}
          handleDeleteSeat={handleDeleteSeat}
        />
      </Suspense>
    </Box>
  )
}

export default Members

Members.acl = {
  action: 'read',
  subject: 'members',
}
