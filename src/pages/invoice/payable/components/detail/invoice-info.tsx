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

// ** hooks
import useModal from '@src/hooks/useModal'
import ModalWithButtonName from '@src/pages/client/components/modals/modal-with-button-name'

// ** apis
import { deleteJob } from '@src/apis/job-detail.api'
import { useGetJobInfo, useGetJobPrices } from '@src/queries/order/job.query'
import { useGetAllClientPriceList } from '@src/queries/price-units.query'
import { useMutation } from 'react-query'

import { toast } from 'react-hot-toast'

// ** contexts
import { AuthContext } from '@src/context/AuthContext'
import { AbilityContext } from '@src/layouts/components/acl/Can'

// ** permission
import { invoice_payable } from '@src/shared/const/permission-class'

/* TODO:
 Jobs타이틀에 list총 갯수 표기하기
 Remove버튼, list의 checkbox는 퍼미션이 가능한 사람에게만 노출되도록 수정
 list에 fetched된 데이터 전달하기, 실데이터 표기하기
 delete invoice추가
*/

export default function InvoiceInfo() {
  const { openModal, closeModal } = useModal()

  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)
  const User = new invoice_payable(user?.id!)

  const isUpdatable = ability.can('update', User)

  const [editInfo, setEditInfo] = useState(false)
  const [selectedJobs, setSelectedJobs] = useState<Array<number>>([])

  const { data: priceUnitsList } = useGetAllClientPriceList()

  //TODO: deleteJob이 아닌 다른 api사용해야 하므로 함수 교체하기
  function deleteJobs() {
    const promises = selectedJobs.map(jobId => deleteJob(jobId))
    Promise.all(promises)
      .then(() => console.log('성공'))
      .catch(() => {
        toast.error(
          'Something went wrong while uploading files. Please try again.',
          {
            position: 'bottom-left',
          },
        )
      })
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
            <InvoiceDetailCard editInfo={editInfo} setEditInfo={setEditInfo} />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <InvoiceAmount />
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
                <Typography variant='h6'>Jobs</Typography>
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
