import { useContext, useState } from 'react'

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
} from '@src/types/invoice/payable.type'

// ** hooks
import useModal from '@src/hooks/useModal'
import ModalWithButtonName from '@src/pages/client/components/modals/modal-with-button-name'

// ** apis
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { useMutation, useQueryClient } from 'react-query'

import { toast } from 'react-hot-toast'

// ** contexts
import { AuthContext } from '@src/context/AuthContext'
import { deleteInvoicePayableJobs } from '@src/apis/invoice/payable.api'

type Props = {
  payableId: number
  isUpdatable: boolean
  data: InvoicePayableDetailType | undefined
  jobList: {
    count: number
    totalCount: number
    data: InvoicePayableJobType[]
  }
}
export default function InvoiceInfo({
  payableId,
  isUpdatable,
  data,
  jobList,
}: Props) {
  const queryClient = useQueryClient()

  const { openModal, closeModal } = useModal()

  const [editInfo, setEditInfo] = useState(false)
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
        <Dialog open={true} onClose={onClose} maxWidth='lg'>
          <DialogContent>
            <JobDetail
              id={id}
              onClose={onClose}
              priceUnitsList={priceUnitsList || []}
            />
          </DialogContent>
        </Dialog>
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
              payableId={payableId}
              isUpdatable={isUpdatable}
              data={data}
              editInfo={editInfo}
              setEditInfo={setEditInfo}
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <InvoiceAmount data={data} />
      </Grid>
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
                <Button
                  size='small'
                  variant='contained'
                  disabled={!selectedJobs.length || !isUpdatable}
                  startIcon={<Icon icon='mdi:trash-outline' />}
                  onClick={onRemoveJobs}
                >
                  Remove
                </Button>
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
          />
        </Card>
      </Grid>
    </Grid>
  )
}
