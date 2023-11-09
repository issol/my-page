import { Icon } from '@iconify/react'

import Tabs from '@mui/material/Tabs'
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
import { Suspense, MouseEvent, useState, useEffect } from 'react'
import { useRecoilValueLoadable } from 'recoil'
import styled from 'styled-components'
import InvoiceInfo from '../../payable/components/detail/invoice-info'
import {
  useGetPayableDetail,
  useGetPayableJobList,
} from '@src/queries/invoice/payable.query'
import { useMutation, useQueryClient } from 'react-query'
import {
  InvoicePayableDetailType,
  InvoicePayableDownloadData,
  PayableFormType,
} from '@src/types/invoice/payable.type'
import { updateInvoicePayable } from '@src/apis/invoice/payable.api'
import toast from 'react-hot-toast'
import { getCurrentRole } from '@src/shared/auth/storage'
import {
  setInvoicePayable,
  setInvoicePayableIsReady,
  setInvoicePayableLang,
} from '@src/store/invoice-payable'
import { useAppDispatch, useAppSelector } from '@src/hooks/useRedux'
import PrintInvoicePayablePreview from '../../payable/components/detail/components/pdf-download/invoice-payable-preview'
import DownloadQuotesModal from '@src/pages/quotes/detail/components/pdf-download/download-qoutes-modal'
import SelectTemplateLanguageModal from '@src/@core/components/common-modal/select-template-language-modal'
import { current } from '@reduxjs/toolkit'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import PayableHistory from '../../payable/components/detail/version-history'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import { useGetStatusList } from '@src/queries/common.query'

type MenuType = 'info' | 'history'

const ProInvoiceDetail = () => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const { id } = router.query

  const auth = useRecoilValueLoadable(authState)
  const currentRole = getCurrentRole()
  const dispatch = useAppDispatch()
  const invoicePayable = useAppSelector(state => state.invoicePayable)
  const { data: statusList } = useGetStatusList('InvoicePayable')

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

  const onClickPreview = (lang: 'EN' | 'KO') => {
    makePdfData(lang)
    closeModal('PreviewModal')
  }

  function handlePrint() {
    closeModal('DownloadInvoiceModal')
    router.push('/invoice/payable/print')
  }

  const onDownloadInvoiceClick = () => {
    openModal({
      type: 'DownloadInvoiceModal',
      children: (
        <SelectTemplateLanguageModal
          onClose={() => closeModal('DownloadInvoiceModal')}
          onClick={onClickPreview}
          page={'invoice'}
        />
      ),
    })
  }

  function makePdfData(lang: 'EN' | 'KO') {
    const { user } = auth.getValue()
    if (data && currentRole) {
      const res: InvoicePayableDownloadData = {
        invoiceId: data.id,
        adminCompanyName: 'GloZ',
        companyAddress:
          lang === 'EN'
            ? '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010'
            : '서울특별시 금천구 가산디지털1로 204, 903호 (가산 반도아이비밸리) 08502',
        corporationId: data.corporationId,
        invoicedAt: data.invoicedAt,
        payDueAt: data.payDueAt,
        payDueTimezone: data.payDueTimezone,
        paidAt: data.paidAt,
        paidDateTimezone: data.paidDateTimezone,
        pro: {
          name: getLegalName({
            firstName: user?.firstName,
            lastName: user?.lastName,
            middleName: user?.middleName,
          }),
          email: user?.email ?? '-',
          mobile: user?.mobilePhone,
          address: {
            detailAddress: '31-1',
            baseAddress: 'Hangang-daero',
            city: 'Yongsan-gu',
            state: 'Seoul',
            zipCode: '02148',
          },
        },
        jobList: jobList?.data || [],
        subtotal: data.subtotal,
        tax: data.tax,
        totalPrice: data.totalPrice,
        taxRate: data.taxRate,
        currency: data.currency,
      }
      dispatch(setInvoicePayable(res))
      dispatch(setInvoicePayableLang(lang))
      // dispatch(setInvoicePayableIsReady(true))
    }
  }

  useEffect(() => {
    if (menuQuery && ['info', 'history'].includes(menuQuery)) {
      setMenu(menuQuery)
    }
  }, [menuQuery])

  useEffect(() => {
    if (!router.isReady) return
    router.replace(`/invoice/pro/detail/${id}?menu=${menu}`)
  }, [menu, id])

  useEffect(() => {
    if (
      invoicePayable.isReady &&
      invoicePayable.invoicePayableData &&
      auth.state === 'hasValue' &&
      auth.getValue().user
    ) {
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
              <PrintInvoicePayablePreview
                data={invoicePayable.invoicePayableData}
                type='preview'
                user={auth.getValue().user!}
                lang={invoicePayable.lang}
              />
            </div>

            <Box display='flex' justifyContent='center' gap='10px'>
              <Button
                variant='outlined'
                sx={{ width: 226 }}
                onClick={() => {
                  closeModal('PreviewModal')
                  dispatch(setInvoicePayableIsReady(false))
                }}
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
            <IconButton onClick={() => router.push('/invoice/pro/')}>
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
              onClick={onDownloadInvoiceClick}
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
            style={{
              borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
            }}
          >
            <CustomTab
              value='info'
              label='Invoice info'
              iconPosition='start'
              icon={
                <Icon icon='material-symbols:receipt-long' fontSize={'18px'} />
              }
              onClick={(e: MouseEvent<HTMLElement>) => e.preventDefault()}
            />
            <CustomTab
              value='history'
              label='Version history'
              iconPosition='start'
              icon={<Icon icon='ic:outline-history' fontSize={'18px'} />}
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
                data={data as InvoicePayableDetailType}
                jobList={jobList || { count: 0, totalCount: 0, data: [] }}
                statusList={statusList!}
                auth={auth.getValue()}
                editInfo={false}
                setEditInfo={() => null}
              />
            </Suspense>
          </TabPanel>
          {/* Version history */}
          <TabPanel value='history' sx={{ pt: '24px' }}>
            <Card>
              <Suspense>
                <PayableHistory
                  isUpdatable={false}
                  invoiceId={Number(id)}
                  invoiceCorporationId={data?.corporationId!}
                  statusList={statusList!}
                />
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

  display: flex;

  gap: 1px;
`
