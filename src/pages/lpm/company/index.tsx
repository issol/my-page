import { Suspense, useEffect, useState, useContext } from 'react'
import { useMutation, useQueryClient } from 'react-query'

import {
  useGetMembers,
  useGetSignUpRequests,
} from 'src/queries/company/company-query'
import {
  approveMembers,
  deleteSignUpRequests,
  undoMembers,
  undoSignUpRequest,
} from 'src/apis/company.api'

import { ModalContext } from 'src/context/ModalContext'
import DeclineSignUpRequestModal from './components/modal/decline-signup-request-modal'
import ApproveSignUpRequestModal from './components/modal/approve-signup-request.modal'
import toast from 'react-hot-toast'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import SignUpRequests from './components/sign-up-requests'
import MemberList from './components/member-list'
import { MembersType, SignUpRequestsType } from 'src/types/company/members'

const RoleArray = ['TAD', 'LPM']
const LpmCompany = () => {
  const { data: signUpRequests } = useGetSignUpRequests()
  const { data: members } = useGetMembers()
  const [requestsPage, setRequestsPage] = useState<number>(0)
  const [membersPage, setMembersPage] = useState<number>(0)
  const [requestsPageSize, setRequestsPageSize] = useState<number>(10)
  const [membersPageSize, setMembersPageSize] = useState<number>(10)
  const [user, setUser] = useState<SignUpRequestsType[]>(signUpRequests)
  const [memberList, setMemberList] = useState<MembersType[]>(members)

  const { setModal } = useContext(ModalContext)

  const queryClient = useQueryClient()

  const declineSignUpRequestMutation = useMutation(
    (id: number) => deleteSignUpRequests(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('signup-requests')
      },
    },
  )

  const undoRequestActionMutation = useMutation((user: SignUpRequestsType) =>
    undoSignUpRequest(user),
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
        role:
          value.id === user.id
            ? value.role.filter(char => char !== role)
            : value.role,
      })),
    )
  }

  const handleAddRole = (role: string, user: SignUpRequestsType) => {
    setUser(prevState =>
      prevState.map(value => ({
        ...value,
        role: value.id === user.id ? RoleArray : value.role,
      })),
    )
  }

  const undoDecline = (user: SignUpRequestsType) => {
    undoRequestActionMutation.mutate(user, {
      onSuccess: () => {
        queryClient.invalidateQueries('signup-requests')
        toast.dismiss()
      },
    })
  }

  const undoApprove = (user: MembersType) => {
    console.log(user)

    undoMemberActionMutation.mutate(user, {
      onSuccess: () => {
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
            {action === 'decline'
              ? `Declined successfully`
              : `Approve successfully`}
            <Button
              onClick={() => {
                undoDecline(user)
                action === 'approve' && member && undoApprove(member)
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
    declineSignUpRequestMutation.mutate(user.id, {
      onSuccess: () => {
        queryClient.invalidateQueries('signup-requests')
        displayUndoToast(user, 'decline', undefined)
      },
    })
  }

  const approveSignUpRequest = (user: SignUpRequestsType) => {
    const index = members.length
    console.log(index)

    declineSignUpRequestMutation.mutate(user.id, {
      onSuccess: () => {
        queryClient.invalidateQueries('signup-requests')
        addMemberAfterApproveMutation.mutate(
          {
            id: index + 1,
            firstName: 'Minkyu',
            middleName: 'hi',
            lastName: 'Kim',
            role: user.role,
            email: user.email,
            permission: user.permission,
            jobTitle: 'Frontend Developer',
            createdAt: new Date().getTime(),
          },
          {
            onSuccess: (data, variables) => {
              console.log(variables)

              queryClient.invalidateQueries('members')
              displayUndoToast(user, 'approve', variables)
            },
          },
        )
      },
    })
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

  useEffect(() => {
    setUser(signUpRequests)
  }, [signUpRequests])

  useEffect(() => {
    setMemberList(members)
  }, [members])

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Suspense>
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
        />
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

export default LpmCompany

LpmCompany.acl = {
  action: 'company-read',
  subject: 'LPM',
}
