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
} from 'src/apis/company/company-members.api'

import { ModalContext } from 'src/context/ModalContext'
import DeclineSignUpRequestModal from '../components/modal/decline-signup-request-modal'
import ApproveSignUpRequestModal from '../components/modal/approve-signup-request.modal'
import toast from 'react-hot-toast'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import SignUpRequests from '../components/sign-up-requests'
import MemberList from '../components/member-list'
import {
  MembersType,
  RequestPayloadType,
  SignUpRequestsType,
} from 'src/types/company/members'

import { AbilityContext } from 'src/layouts/components/acl/Can'
import { useAppSelector } from 'src/hooks/useRedux'
import { getCurrentRole } from '@src/shared/auth/storage'

const RoleArray = ['TAD', 'LPM']
const Members = () => {
  const isClient = getCurrentRole()?.name === 'CLIENT'

  const ability = useContext(AbilityContext)
  const { data: signUpRequests, isError } = useGetSignUpRequests(
    ability.can('update', 'permission_request'),
  )
  const { data: members, refetch } = useGetMembers(
    ability.can('read', 'members'),
  )

  const userAccess = useAppSelector(state => state.userAccess)
  const hasGeneralPermission = () => {
    let flag = false
    userAccess.role.map(item => {
      if (
        (item.name === 'LPM' ||
          item.name === 'TAD' ||
          item.name === 'CLIENT') &&
        item.type === 'General'
      )
        flag = true
    })
    return flag
  }

  const [requestsPage, setRequestsPage] = useState<number>(0)
  const [membersPage, setMembersPage] = useState<number>(0)
  const [requestsPageSize, setRequestsPageSize] = useState<number>(10)
  const [membersPageSize, setMembersPageSize] = useState<number>(10)
  const [user, setUser] = useState<SignUpRequestsType[]>([])
  const [memberList, setMemberList] = useState<MembersType[]>([])

  const { setModal } = useContext(ModalContext)

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
        queryClient.invalidateQueries('signup-requests')
        queryClient.invalidateQueries('members')
        toast.dismiss()
      },
    })
  }

  const undoDecline = (user: SignUpRequestsType) => {
    undoRequestActionMutation.mutate(user, {
      onSuccess: () => {
        queryClient.invalidateQueries('signup-requests')
        toast.dismiss()
      },
    })
  }

  const undoApprove = (user: SignUpRequestsType) => {
    // console.log(user)

    undoRequestActionMutation.mutate(user, {
      onSuccess: () => {
        queryClient.invalidateQueries('signup-requests')
        queryClient.invalidateQueries('members')
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
          queryClient.invalidateQueries('signup-requests')
          queryClient.invalidateQueries('members')
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
          queryClient.invalidateQueries('signup-requests')
          queryClient.invalidateQueries('members')
        },
      },
    )
  }

  const handleApproveSignUpRequest = (user: SignUpRequestsType) => {
    setModal(
      <ApproveSignUpRequestModal
        approveSignUpRequest={approveSignUpRequest}
        user={user}
        message={
          isClient
            ? 'Are you sure to approve the registration request for this account'
            : 'Are you sure to approve the sign up request for this account?'
        }
      />,
    )
  }

  const handleDeclineSignUpRequest = (user: SignUpRequestsType) => {
    setModal(
      <DeclineSignUpRequestModal
        declineSignUpRequest={declineSignUpRequest}
        user={user}
        message={
          isClient
            ? 'Are you sure to decline the sign up request for this account?'
            : ''
        }
        onClose={() => setModal(null)}
      />,
    )
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
