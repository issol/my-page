import { Box, Card, CardHeader, Switch, Typography } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import useModal from '@src/hooks/useModal'

import { getProAppliedRolesColumns } from '@src/shared/const/columns/pro-applied-roles'
import {
  ProAppliedRolesFilterType,
  ProAppliedRolesStatusHistoryType,
  ProAppliedRolesType,
} from '@src/types/pro/pro-applied-roles'
import { Dispatch, SetStateAction, useState } from 'react'
import { Loadable } from 'recoil'
import StatusHistoryModal from './modal/status-history-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import ReasonModal from './modal/reson-modal'
import TestGuidelineModal from './modal/test-guideline-modal'
import { NoList } from '@src/pages/components/no-list'
import { useMutation, useQueryClient } from 'react-query'
import { patchAppliedRole, patchTestStatus } from '@src/apis/onboarding.api'

type Props = {
  role: UserRoleType

  statusList: { value: number; label: string }[]
  auth: Loadable<{
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }>
  setSignNDA: Dispatch<SetStateAction<boolean>>
  setLanguage: Dispatch<SetStateAction<'ENG' | 'KOR'>>
  filters: ProAppliedRolesFilterType
  setFilters: Dispatch<SetStateAction<ProAppliedRolesFilterType>>
  seeOnlyActiveTests: boolean
  setSeeOnlyActiveTests: Dispatch<SetStateAction<boolean>>
  handleSeeOnlyActiveTests: (event: React.ChangeEvent<HTMLInputElement>) => void
  appliedRoles: {
    data: ProAppliedRolesType[]
    totalCount: number
  }
  appliedRolesLoading: boolean
}

const ProAppliedRoles = ({
  role,
  statusList,
  auth,
  setSignNDA,
  setLanguage,
  setFilters,
  seeOnlyActiveTests,
  handleSeeOnlyActiveTests,
  appliedRoles,
  appliedRolesLoading,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const queryClient = useQueryClient()

  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)

  const patchTestStatusMutation = useMutation(
    (value: { id: number; status: string }) =>
      patchTestStatus(value.id, value.status),
    {
      onSuccess: (data, variables) => {
        // queryClient.invalidateQueries(`applied-role-${userInfo?.userId}`)
        // queryClient.invalidateQueries(`certified-role-${userInfo?.userId}`)
        queryClient.invalidateQueries(['Applied-roles'])
      },
    },
  )

  const replyAssignedMutation = useMutation(
    (value: { id: number; reply: string }) =>
      patchAppliedRole(value.id, value.reply),
    {
      onSuccess: (data, variables) => {
        // queryClient.invalidateQueries(`applied-role-${userInfo?.userId}`)
        // queryClient.invalidateQueries(`certified-role-${userInfo?.userId}`)
        queryClient.invalidateQueries(['Applied-roles'])
      },
    },
  )
  const viewHistory = (history: ProAppliedRolesStatusHistoryType[] | null) => {
    openModal({
      type: 'ViewHistoryModal',
      children: (
        <StatusHistoryModal
          onClose={() => closeModal('ViewHistoryModal')}
          history={history}
          statusList={statusList}
          auth={auth}
        />
      ),
    })
  }

  const onClickStartTest = (row: ProAppliedRolesType) => {
    if (auth.getValue().user?.isSignToNDA) {
      openModal({
        type: 'BeforeStartTestModal',
        children: (
          <CustomModal
            soloButton
            onClick={() => {
              patchTestStatusMutation.mutate(
                {
                  id: row.id,
                  status:
                    row.status === 'Basic test Ready'
                      ? 'Basic in progress'
                      : 'Skill in progress',
                },
                {
                  onSuccess: () => {
                    window.open(
                      row.status === 'Basic test Ready' ||
                        row.status === 'Basic in progress'
                        ? row.basicTest?.testPaperFormUrl
                        : row.status === 'Skill test Ready' ||
                            row.status === 'Skill in progress'
                          ? row.skillTest?.testPaperFormUrl
                          : '',
                      '_blank',
                    )
                    closeModal('BeforeStartTestModal')
                  },
                },
              )

              //TODO : API call (applied roles query invalidate)
            }}
            vary='guideline-info'
            rightButtonText='Okay'
            onClose={() => closeModal('BeforeStartTestModal')}
            title={
              <>
                Please make sure to check the guidelines before starting the
                test.
                <br />
                <br />
                This message is shown only once before the examination begins.
              </>
            }
          />
        ),
      })
    } else {
      openModal({
        type: 'StartTestModal',
        children: (
          <CustomModal
            onClose={() => closeModal('StartTestModal')}
            vary='info'
            onClick={() => {
              if (row.sourceLanguage === 'ko' || row.targetLanguage === 'ko') {
                setLanguage('KOR')
              } else {
                setLanguage('ENG')
              }
              setSignNDA(true)
              closeModal('StartTestModal')
            }}
            title='In order to proceed, agreement to the Non-Disclosure Agreement (NDA) is required.'
            rightButtonText='Sign NDA'
            leftButtonText='Later'
          />
        ),
      })
    }
  }

  const onClickReason = (row: ProAppliedRolesType) => {
    if (
      (row.status === 'Rejected by TAD' || row.status === 'Paused') &&
      row.reason === null
    )
      return
    else {
      openModal({
        type: 'ReasonModal',
        children: (
          <ReasonModal
            onClose={() => closeModal('ReasonModal')}
            vary={row.status === 'Basic failed' ? 'error' : 'question-info'}
            row={row}
            timezone={auth.getValue().user?.timezone!}
          />
        ),
      })
    }
  }

  const onClickTestGuideLine = (row: ProAppliedRolesType) => {
    if (!auth.getValue().user?.isSignToNDA) {
      openModal({
        type: 'TestGuideLineNDAModal',
        children: (
          <CustomModal
            onClose={() => closeModal('TestGuideLineNDAModal')}
            vary='info'
            onClick={() => {
              if (row.sourceLanguage === 'ko' || row.targetLanguage === 'ko') {
                setLanguage('KOR')
              } else {
                setLanguage('ENG')
              }
              setSignNDA(true)
              closeModal('TestGuideLineNDAModal')
            }}
            title='In order to proceed, agreement to the Non-Disclosure Agreement (NDA) is required.'
            rightButtonText='Sign NDA'
            leftButtonText='Later'
          />
        ),
      })
      return
    }

    openModal({
      type: 'TestGuidelineModal',
      children: (
        <TestGuidelineModal
          onClose={() => closeModal('TestGuidelineModal')}
          guideline={row.testGuideline}
        />
      ),
    })
  }

  const onClickResume = (row: ProAppliedRolesType) => {
    //TODO Status 별로 업데이트 체크
    window.open(
      row.status === 'Basic test Ready' || row.status === 'Basic in progress'
        ? row.basicTest?.testPaperFormUrl
        : row.status === 'Skill test Ready' ||
            row.status === 'Skill in progress'
          ? row.skillTest?.testPaperFormUrl
          : '',
      '_blank',
    )
  }

  const onClickSubmit = (row: ProAppliedRolesType) => {
    openModal({
      type: 'SubmitModal',
      children: (
        <CustomModal
          vary='question-info'
          onClose={() => closeModal('SubmitModal')}
          title={
            <>
              This will notify TAD that the test has been completed.
              <br />
              <br />
              Please click the "Submit" button only if you have finished the
              Google Form test.
            </>
          }
          onClick={() => {
            patchTestStatusMutation.mutate(
              {
                id: row.id,
                status:
                  row.status === 'Basic in progress'
                    ? 'Basic submitted'
                    : 'Skill submitted',
              },
              {
                onSuccess: () => {
                  closeModal('SubmitModal')
                },
              },
            )
          }}
          rightButtonText='Submit'
        />
      ),
    })
  }

  const onClickDecline = (row: ProAppliedRolesType) => {
    openModal({
      type: 'DeclineModal',
      children: (
        <CustomModal
          vary='error'
          onClose={() => closeModal('DeclineModal')}
          title={
            row.status === 'Test assigned'
              ? 'Are you sure you want to decline the test offer from TAD?'
              : 'Are you sure you want to decline the role offer from TAD?'
          }
          onClick={() => {
            //TODO : API call (applied roles query invalidate), status 별 분기
            replyAssignedMutation.mutate({
              id: row.id,
              reply:
                row.status === 'Test assigned'
                  ? 'decline_test_pro'
                  : 'decline_role_pro',
            })

            // patchTestStatusMutation.mutate(
            //   {
            //     id: row.id,
            //     status:
            //       row.status === 'Test assigned'
            //         ? 'Test declined'
            //         : 'Role declined',
            //   },
            //   {
            //     onSuccess: () => {
            //       closeModal('DeclineModal')
            //     },
            //   },
            // )
          }}
          rightButtonText='Decline'
        />
      ),
    })
  }

  const onClickAccept = (row: ProAppliedRolesType) => {
    if (row.status === 'Test assigned') {
      openModal({
        type: 'AcceptModal',
        children: (
          <CustomModal
            vary='successful'
            onClose={() => closeModal('AcceptModal')}
            title={
              'Would you like to accept the test offer from TAD and proceed with the test procedure?'
            }
            onClick={() => {
              //TODO : API call (applied roles query invalidate)
              replyAssignedMutation.mutate({
                id: row.id,
                reply: 'assign_test_pro',
              })

              // patchTestStatusMutation.mutate(
              //   {
              //     id: row.id,
              //     status: 'Basic test Ready',
              //   },
              //   {
              //     onSuccess: () => {
              //       closeModal('AcceptModal')
              //     },
              //   },
              // )
            }}
            rightButtonText='Accept'
          />
        ),
      })
    } else {
      if (auth.getValue().user?.isSignToNDA) {
        openModal({
          type: 'AcceptModal',
          children: (
            <CustomModal
              vary='successful'
              onClose={() => closeModal('AcceptModal')}
              title={'Would you like to accept the role offer from TAD?'}
              onClick={() => {
                //TODO : API call (applied roles query invalidate)
                replyAssignedMutation
                  .mutateAsync({
                    id: row.id,
                    reply: 'assign_role_pro',
                  })
                  .then(() => {
                    closeModal('AcceptModal')
                  })
              }}
              rightButtonText='Accept'
            />
          ),
        })
      } else {
        openModal({
          type: 'SignedNDAModal',
          children: (
            <CustomModal
              onClose={() => closeModal('SignedNDAModal')}
              vary='info'
              onClick={() => {
                if (
                  row.sourceLanguage === 'ko' ||
                  row.targetLanguage === 'ko'
                ) {
                  setLanguage('KOR')
                } else {
                  setLanguage('ENG')
                }
                setSignNDA(true)
                closeModal('SignedNDAModal')
              }}
              title='In order to proceed, agreement to the Non-Disclosure Agreement (NDA) is required.'
              rightButtonText='Sign NDA'
              leftButtonText='Later'
            />
          ),
        })
      }
    }
  }

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Box display='flex' justifyContent='space-between'>
              <Typography variant='h6'>
                Applied roles ({appliedRoles?.totalCount ?? 0})
              </Typography>
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography variant='body2' fontSize={16}>
                  Show only my active tests
                </Typography>
                <Switch
                  checked={seeOnlyActiveTests}
                  onChange={handleSeeOnlyActiveTests}
                />
              </Box>
            </Box>
          }
          sx={{
            pb: 4,
            '& .MuiCardHeader-title': { letterSpacing: '.15px' },
          }}
        />
        <Box
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
          }}
        >
          <DataGrid
            sx={{
              overflow: 'scroll',
              overflowY: 'scroll',
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'inherit',
              },
              '& .MuiDataGrid-virtualScroller': {
                overflow: 'scroll !important',
                height: '270px !important',
              },
              maxHeight: '451px',
              minHeight: '375px',
            }}
            components={{
              NoRowsOverlay: () => NoList('There is no applied role.'),
              NoResultsOverlay: () => NoList('There is no applied role.'),
            }}
            autoHeight
            rows={appliedRoles?.data ?? []}
            rowCount={appliedRoles?.totalCount ?? 0}
            loading={appliedRolesLoading}
            columns={getProAppliedRolesColumns(
              statusList,
              role,
              auth,
              viewHistory,
              onClickStartTest,
              onClickReason,
              onClickTestGuideLine,
              onClickResume,
              onClickSubmit,
              onClickDecline,
              onClickAccept,
            )}
            pagination
            paginationMode='server'
            page={page}
            pageSize={rowsPerPage}
            // paginationMode='server'
            onPageChange={(newPage: number) => {
              setFilters!((prevState: ProAppliedRolesFilterType) => ({
                ...prevState,
                skip: newPage * rowsPerPage!,
              }))
              setPage!(newPage)
            }}
            onPageSizeChange={(newPageSize: number) => {
              setFilters!((prevState: ProAppliedRolesFilterType) => ({
                ...prevState,
                take: newPageSize,
              }))
              setRowsPerPage!(newPageSize)
            }}
            rowsPerPageOptions={[5, 10, 25]}
            disableSelectionOnClick
          />
        </Box>
      </Card>
    </>
  )
}

export default ProAppliedRoles
