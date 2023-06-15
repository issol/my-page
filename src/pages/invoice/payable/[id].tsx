import { MouseEvent, useContext, useEffect, useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Tab,
  Typography,
} from '@mui/material'
import styled from 'styled-components'
import { DataGrid, GridColumns } from '@mui/x-data-grid'

import { AbilityContext } from '@src/layouts/components/acl/Can'

import { useRouter } from 'next/router'
import InvoiceInfo from './components/detail/invoice-info'
import { useAppDispatch, useAppSelector } from '@src/hooks/useRedux'
import useModal from '@src/hooks/useModal'
import { AuthContext } from '@src/context/AuthContext'
import { setInvoicePayableIsReady } from '@src/store/invoice-payable'
import { InvoicePayableDownloadData } from '@src/types/invoice/payable.type'
import { setInvoicePayable } from '@src/store/invoice-payable'
import { setInvoicePayableLang } from '@src/store/invoice-payable'
import DownloadQuotesModal from '@src/pages/quotes/detail/components/pdf-download/download-qoutes-modal'
import { invoice_payable } from '@src/shared/const/permission-class'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'

type MenuType = 'info' | 'history'

export default function PayableDetail() {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const { id } = router.query

  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)
  const User = new invoice_payable(user?.id!)

  const isUpdatable = ability.can('update', User)
  const isDeletable = ability.can('delete', User)
  const isAccountManager = ability.can('read', 'account_manage')

  // ** store
  const dispatch = useAppDispatch()
  const invoicePayable = useAppSelector(state => state.invoicePayable)

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('info')

  useEffect(() => {
    if (menuQuery && ['info', 'history'].includes(menuQuery)) {
      setMenu(menuQuery)
    }
  }, [menuQuery])

  useEffect(() => {
    router.replace(`/invoice/payable/${id}?menu=${menu}`)
  }, [menu, id])

  //TODO: 실데이터로 교체하기
  const data = {
    corporationId: '123123',
  }

  // ** Download pdf
  const onClickPreview = (lang: 'EN' | 'KO') => {
    makePdfData(lang)
    closeModal('PreviewModal')
  }

  function handlePrint() {
    closeModal('DownloadQuotesModal')
    router.push('/quotes/print')
  }

  function onClickDelete() {
    //TODO: mutation 붙이기
    openModal({
      type: 'deleteInvoice',
      children: (
        <DeleteConfirmModal
          message='Are you sure you want to delete this invoice?'
          onClose={() => closeModal('deleteInvoice')}
          onDelete={() => console.log()}
        />
      ),
    })
  }

  useEffect(() => {
    if (invoicePayable.isReady && invoicePayable.invoicePayableData) {
      openModal({
        type: 'PreviewModal',
        isCloseable: false,
        children: (
          <Box
            sx={{
              width: '789px',
              height: '95vh',
              overflow: 'scroll',
              background: '#ffffff',
              boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
              paddingBottom: '24px',
            }}
          >
            <div className='page'>
              {/* <PrintQuotePage
                data={invoicePayable.invoicePayableData}
                type='preview'
                user={user!}
                lang={invoicePayable.lang}
              /> */}
            </div>

            <Box display='flex' justifyContent='center' gap='10px'>
              <Button
                variant='outlined'
                sx={{ width: 226 }}
                onClick={() => closeModal('PreviewModal')}
              >
                Close
              </Button>
              <Button
                variant='contained'
                sx={{ width: 226 }}
                onClick={() => {
                  handlePrint()
                  closeModal('PreviewModal')
                }}
              >
                Download
              </Button>
            </Box>
          </Box>
        ),
      })
    }
  }, [invoicePayable.isReady])

  const onDownloadInvoiceClick = () => {
    openModal({
      type: 'DownloadQuotesModal',
      children: (
        <DownloadQuotesModal
          onClose={() => {
            closeModal('DownloadQuotesModal')
            dispatch(setInvoicePayableIsReady(null))
          }}
          onClick={onClickPreview}
        />
      ),
    })
  }

  function makePdfData(lang: 'EN' | 'KO') {
    // const pm = team?.find(value => value.position === 'projectManager')
    // const res: InvoicePayableDownloadData = {
    // }
    // dispatch(setInvoicePayableLang(lang))
    // dispatch(setInvoicePayable(res))
  }

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
            <IconButton>
              <Icon
                icon='mdi:chevron-left'
                onClick={() => router.push('/invoice/payable/')}
              />
            </IconButton>
            <img
              src={'/images/icons/invoice/coin.png'}
              width={50}
              height={50}
              alt='invoice detail'
            />
            <Typography variant='h5'>{data.corporationId}</Typography>
          </Box>
          <Box display='flex' alignItems='center' gap='18px'>
            <Button
              onClick={onDownloadInvoiceClick}
              variant='outlined'
              startIcon={<Icon icon='ic:baseline-download' />}
            >
              Download invoice
            </Button>
            {isUpdatable ? (
              <Button variant='contained'>Confirm invoice</Button>
            ) : null}
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
            <CustomTap
              value='info'
              label='Invoice info'
              iconPosition='start'
              icon={<Icon icon='iconoir:large-suitcase' fontSize={'18px'} />}
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTap
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
              <InvoiceInfo />
            </Suspense>
          </TabPanel>
          {/* Version history */}
          <TabPanel value='history' sx={{ pt: '24px' }}>
            <Card>
              <CardContent sx={{ padding: '24px' }}></CardContent>
            </Card>
          </TabPanel>
        </TabContext>
      </Grid>
      {!isDeletable ? null : (
        <Grid item xs={4}>
          <Card sx={{ marginLeft: '12px' }}>
            <CardContent>
              <Button
                variant='outlined'
                fullWidth
                color='error'
                size='large'
                onClick={onClickDelete}
              >
                Delete this invoice
              </Button>
            </CardContent>
          </Card>
        </Grid>
      )}
    </Grid>
  )
}

PayableDetail.acl = {
  subject: 'invoice_payable',
  action: 'read',
}

const CustomTap = styled(Tab)`
  text-transform: none;
  padding: 0px 27px;
  display: flex;
  gap: 1px;
`
