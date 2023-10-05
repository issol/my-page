import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Tab,
  Typography,
} from '@mui/material'
import useModal from '@src/hooks/useModal'
import { authState } from '@src/states/auth'
import { useRouter } from 'next/router'
import { Suspense, MouseEvent, useState } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import styled from 'styled-components'
import InvoiceInfo from '../../payable/components/detail/invoice-info'
import {
  useGetPayableDetail,
  useGetPayableJobList,
} from '@src/queries/invoice/payable.query'
import { useMutation, useQueryClient } from 'react-query'
import { PayableFormType } from '@src/types/invoice/payable.type'
import { updateInvoicePayable } from '@src/apis/invoice/payable.api'
import toast from 'react-hot-toast'
import { getCurrentRole } from '@src/shared/auth/storage'

type MenuType = 'info' | 'history'

const ProInvoiceDetail = () => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const { id } = router.query

  const auth = useRecoilValueLoadable(authState)

  const queryClient = useQueryClient()

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('info')

  const { data } = useGetPayableDetail(Number(id))
  const { data: jobList } = useGetPayableJobList(Number(id))

  const updateMutation = useMutation(
    (form: PayableFormType) => updateInvoicePayable(Number(id), form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/detail' })
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Box
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          sx={{ background: '#ffffff', padding: '20px', borderRadius: '6px' }}
        >
          <Box display='flex' alignItems='center' gap='4px'>
            <IconButton onClick={() => router.push('/invoice/payable/')}>
              <Icon icon='mdi:chevron-left' />
            </IconButton>
            <img
              src={'/images/icons/invoice/coin.png'}
              width={50}
              height={50}
              alt='invoice detail'
            />
            <Typography variant='h5'>{data?.corporationId}</Typography>
          </Box>
          <Box display='flex' alignItems='center' gap='18px'>
            <Button
              // onClick={onDownloadInvoiceClick}
              variant='outlined'
              startIcon={<Icon icon='ic:baseline-download' />}
            >
              Download invoice
            </Button>
          </Box>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <TabContext value={menu}>
          <TabList
            onChange={(e, v) => setMenu(v)}
            aria-label='Quote detail Tab menu'
            style={{ borderBottom: '1px solid rgba(76, 78, 100, 0.12)' }}
          >
            <CustomTab
              value='info'
              label='Invoice info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTab
              value='history'
              label='Version history'
              iconPosition='start'
              icon={<Icon icon='pajamas:earth' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
          </TabList>
          {/* Invoice info */}
          <TabPanel value='info' sx={{ pt: '24px' }}>
            <Suspense>
              <InvoiceInfo
                payableId={Number(id)}
                isUpdatable={false}
                updateMutation={updateMutation}
                data={data}
                jobList={jobList || { count: 0, totalCount: 0, data: [] }}
              />
            </Suspense>
          </TabPanel>
          {/* Version history */}
          <TabPanel value='history' sx={{ pt: '24px' }}>
            <Card>
              <Suspense>
                {/* <PayableHistory
                  isUpdatable={isUpdatable || false}
                  invoiceId={Number(id)}
                  invoiceCorporationId={data?.corporationId!}
                /> */}
              </Suspense>
            </Card>
          </TabPanel>
        </TabContext>
      </Grid>
    </Grid>
  )
}

export default ProInvoiceDetail

ProInvoiceDetail.acl = {
  subject: 'invoice_pro',
  action: 'read',
}

const CustomTab = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
