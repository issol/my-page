import { useState } from 'react'

// ** style components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from '@mui/material'
import { Icon } from '@iconify/react'

// ** components
import InvoiceDetailCard from './invoice-detail-card'
import InvoiceAmount from './invoice-amount'
import InvoiceJobList from './job-list'
import JobDetail from './job-detail'

// ** types
import {
  InvoicePayableDetailType,
  InvoicePayableJobType,
  PayableFormType,
  PayablePatchType,
} from '@src/types/invoice/payable.type'

// ** hooks
import useModal from '@src/hooks/useModal'
import ModalWithButtonName from 'src/pages/[companyName]/client/components/modals/modal-with-button-name'

// ** apis
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { UseMutationResult, useMutation, useQueryClient } from 'react-query'

import { toast } from 'react-hot-toast'

// ** contexts
import { deleteInvoicePayableJobs } from '@src/apis/invoice/payable.api'
import { ClientUserType, UserDataType, UserRoleType } from '@src/context/types'
import { getCurrentRole } from '@src/shared/auth/storage'

type Props = {
  payableId: number
  isUpdatable: boolean
  updateMutation: UseMutationResult<any, unknown, PayablePatchType, unknown>
  data: InvoicePayableDetailType | undefined
  jobList: {
    count: number
    totalCount: number
    data: InvoicePayableJobType[]
  }
  statusList: Array<{
    label: string
    value: number
  }>
  auth: {
    user: UserDataType | null
    company: ClientUserType | null | undefined
    loading: boolean
  }
  editInfo: boolean
  setEditInfo: (n: boolean) => void
  isDeletable: boolean
  onClickDelete?: () => void
  isAccountInfoUpdatable: boolean
  onMarkAsPaidClick?: () => void
}
export default function InvoiceInfo({
  payableId,
  isUpdatable,
  data,
  updateMutation,
  jobList,
  statusList,
  auth,
  editInfo,
  setEditInfo,
  isDeletable,
  onClickDelete,
  isAccountInfoUpdatable,
  onMarkAsPaidClick,
}: Props) {
  const queryClient = useQueryClient()

  const currentRole = getCurrentRole()

  const { openModal, closeModal } = useModal()

  // const [editInfo, setEditInfo] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState<Array<number>>([])

  const { data: priceUnitsList } = useGetAllClientPriceList()

  const removeJobsMutation = useMutation(
    () => deleteInvoicePayableJobs(payableId, selectedJobs),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: 'invoice/payable/detail/jobs',
        })
      },
      onError: () => {
        toast.error(
          'Something went wrong while uploading files. Please try again.',
          {
            position: 'bottom-left',
          },
        )
      },
    },
  )

  function deleteJobs() {
    if (selectedJobs.length) {
      removeJobsMutation.mutate()
    }
  }

  function onRemoveJobs() {
    openModal({
      type: 'removeJobs',
      children: (
        <ModalWithButtonName
          message='Are you sure you want to remove the selected job(s) from this invoice? Job(s) will not be deleted.'
          rightButtonName='Remove'
          onClose={() => closeModal('removeJobs')}
          iconType='error'
          onClick={deleteJobs}
        />
      ),
    })
  }

  function onRowClick(id: number) {
    openModal({
      type: 'jobDetail',
      children: (
        <Box
          sx={{
            maxWidth: '1180px',
            width: '100%',
            background: '#ffffff',
            boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
            borderRadius: '10px',
          }}
        >
          <Box sx={{ padding: '50px 60px' }}>
            <JobDetail
              id={id}
              onClose={onClose}
              priceUnitsList={priceUnitsList || []}
            />
          </Box>
        </Box>
      ),
    })

    function onClose() {
      closeModal('jobDetail')
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <CardContent sx={{ padding: '24px' }}>
            <InvoiceDetailCard
              isUpdatable={isUpdatable}
              data={data}
              updatePayable={updateMutation}
              editInfo={editInfo}
              setEditInfo={setEditInfo}
              statusList={statusList!}
            />
          </CardContent>
        </Card>
      </Grid>
      {editInfo ? null : (
        <Grid item xs={12}>
          <InvoiceAmount data={data} />
        </Grid>
      )}
      {editInfo ? null : (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={
                <Box
                  display='flex'
                  alignItems='center'
                  justifyContent='space-between'
                >
                  <Typography variant='h6'>
                    Jobs ({jobList.data?.length ?? 0})
                  </Typography>
                  {currentRole && currentRole.name === 'PRO' ? null : (
                    <Button
                      size='small'
                      variant='contained'
                      disabled={!selectedJobs.length || !isUpdatable}
                      startIcon={<Icon icon='mdi:trash-outline' />}
                      onClick={onRemoveJobs}
                    >
                      Remove
                    </Button>
                  )}
                </Box>
              }
            />
            <InvoiceJobList
              data={jobList}
              currency={data?.currency}
              isUpdatable={isUpdatable}
              selectedJobs={selectedJobs}
              setSelectedJobs={setSelectedJobs}
              onRowClick={onRowClick}
              auth={auth!}
            />
          </Card>
        </Grid>
      )}
      {!isDeletable || editInfo ? null : (
        <Grid item xs={4}>
          <Card sx={{ padding: '20px', width: '100%' }}>
            <Button
              variant='outlined'
              fullWidth
              color='error'
              size='large'
              onClick={() => onClickDelete && onClickDelete()}
              disabled={
                ![40000, 40100, 40200, 40400].includes(data?.invoiceStatus!)
              }
            >
              Delete this invoice
            </Button>
          </Card>
        </Grid>
      )}
      {!isAccountInfoUpdatable || editInfo ? null : (
        <Grid item xs={4}>
          <Card sx={{ padding: '20px', width: '100%' }}>
            <Button
              variant='contained'
              fullWidth
              size='large'
              disabled={
                // !isUpdatable ||
                ![40000, 40200, 40400].includes(data?.invoiceStatus!)
              }
              onClick={() => onMarkAsPaidClick && onMarkAsPaidClick()}
            >
              Mark as paid
            </Button>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}
