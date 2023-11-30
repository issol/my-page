import {
  Box,
  Button,
  Card,
  CardHeader,
  Switch,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import useModal from '@src/hooks/useModal'
import { useGetProAppliedRoles } from '@src/queries/pro-certification-test/applied-roles'

import { getProAppliedRolesColumns } from '@src/shared/const/columns/pro-applied-roles'
import {
  ProAppliedRolesFilterType,
  ProAppliedRolesType,
  ProAppliedRolesStatusHistoryType,
} from '@src/types/pro-certification-test/applied-roles'
import { Dispatch, SetStateAction, useState } from 'react'
import { Loadable } from 'recoil'
import StatusHistoryModal from './modal/status-history-modal'
import { useGetContract } from '@src/queries/contract/contract.query'
import {
  ContractDetailType,
  currentVersionType,
  getContractDetail,
} from '@src/apis/contract.api'
import NDASigned from './nda-signed'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import ReasonModal from './modal/reson-modal'
import TestGuidelineModal from './modal/test-guideline-modal'

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
}

const defaultFilters: ProAppliedRolesFilterType = {
  take: 10,
  skip: 0,
  isActive: '0',
}

const ProAppliedRoles = ({
  role,

  statusList,
  auth,
  setSignNDA,
  setLanguage,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(5)

  const [filters, setFilters] =
    useState<ProAppliedRolesFilterType>(defaultFilters)
  const [seeOnlyActiveTests, setSeeOnlyActiveTests] = useState(false)
  const handleSeeOnlyActiveTests = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const checked = event.target.checked
    setSeeOnlyActiveTests(checked)
    setFilters(prevState => ({
      ...prevState,
      isActive: checked ? '1' : '0',
    }))
  }

  const { data: appliedRoles, isLoading: appliedRolesLoading } =
    useGetProAppliedRoles(filters)

  const viewHistory = (history: ProAppliedRolesStatusHistoryType[]) => {
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
    if (!auth.getValue().user?.isSignedNDA) {
      openModal({
        type: 'BeforeStartTestModal',
        children: (
          <CustomModal
            soloButton
            onClick={() => {
              window.open(
                row.status === 'Basic test Ready' ||
                  row.status === 'Basic in progress'
                  ? row.basicTest?.testPaperFormLink
                  : row.status === 'Skill test Ready' ||
                    row.status === 'Skill in progress'
                  ? row.skillTest?.testPaperFormLink
                  : '',
                '_blank',
              )
              closeModal('BeforeStartTestModal')
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

  const onClickTestGuideLine = (row: ProAppliedRolesType) => {
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
    window.open(
      row.status === 'Basic test Ready' || row.status === 'Basic in progress'
        ? row.basicTest?.testPaperFormLink
        : row.status === 'Skill test Ready' ||
          row.status === 'Skill in progress'
        ? row.skillTest?.testPaperFormLink
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
            //TODO : API call (applied roles query invalidate)
            closeModal('SubmitModal')
          }}
          rightButtonText='Submit'
        />
      ),
    })
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
              overflowX: 'scroll',
              '& .MuiDataGrid-row:hover': {
                backgroundColor: 'inherit',
              },
              maxHeight: '451px',
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
            )}
            pagination
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
