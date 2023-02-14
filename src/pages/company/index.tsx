import { Suspense, useEffect, useState, useContext } from 'react'
import { useMutation, useQueryClient } from 'react-query'

import {
  useGetMembers,
  useGetSignUpRequests,
} from 'src/queries/company/company-query'
import {
  approveMembers,
  requestAction,
  undoMembers,
  undoRequest,
} from 'src/apis/company.api'

import { ModalContext } from 'src/context/ModalContext'
import DeclineSignUpRequestModal from './components/modal/decline-signup-request-modal'
import ApproveSignUpRequestModal from './components/modal/approve-signup-request.modal'
import toast from 'react-hot-toast'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import SignUpRequests from './components/sign-up-requests'
import MemberList from './components/member-list'
import {
  MembersType,
  RequestPayloadType,
  SignUpRequestsType,
} from 'src/types/company/members'

import { AbilityContext } from 'src/layouts/components/acl/Can'

const RoleArray = ['TAD', 'LPM']
const Company = () => {
  const ability = useContext(AbilityContext)
  const { data: signUpRequests, isError } = useGetSignUpRequests(
    ability.can('update', 'permission_request'),
  )
  const { data: members } = useGetMembers(
    ability.can('update', 'permission_request'),
  )

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

  const undoMemberActionMutation = useMutation(
    (user: MembersType) => undoMembers(user),
    {
      onSuccess: data => {
        console.log('undo members')
      },
    },
  )

  const addMemberAfterApproveMutation = useMutation((user: MembersType) =>
    approveMembers(user),
  )
  const handleDeleteRole = (role: string, user: SignUpRequestsType) => {
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

  const handleAddRole = (role: string, user: SignUpRequestsType) => {
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
    console.log(user)

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
      />,
    )
  }

  const handleDeclineSignUpRequest = (user: SignUpRequestsType) => {
    setModal(
      <DeclineSignUpRequestModal
        declineSignUpRequest={declineSignUpRequest}
        user={user}
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
        {user && user.length ? (
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
        />
      </Suspense>
    </Box>
  )
}

export default Company

// ** TODO : 렐과 상의 후 변경
Company.acl = {
  action: 'read',
  subject: 'members',
}