import { MouseEvent, Suspense, useContext, useEffect, useState } from 'react'

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

// ** contexts
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { AuthContext } from '@src/context/AuthContext'

// ** hooks
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '@src/hooks/useRedux'
import useModal from '@src/hooks/useModal'

// ** components
import InvoiceInfo from './components/detail/invoice-info'
import DownloadQuotesModal from '@src/pages/quotes/detail/components/pdf-download/download-qoutes-modal'
import DeleteConfirmModal from '@src/pages/client/components/modals/delete-confirm-modal'
import PrintInvoicePayablePreview from './components/detail/components/pdf-download/invoice-payable-preview'

// ** store
import { setInvoicePayableIsReady } from '@src/store/invoice-payable'
import {
  InvoicePayableDownloadData,
  PayableFormType,
} from '@src/types/invoice/payable.type'
import { setInvoicePayable } from '@src/store/invoice-payable'
import { setInvoicePayableLang } from '@src/store/invoice-payable'

// ** apis
import {
  useCheckInvoicePayableEditable,
  useGetPayableDetail,
  useGetPayableJobList,
} from '@src/queries/invoice/payable.query'
import { useMutation, useQueryClient } from 'react-query'
import {
  deleteInvoicePayable,
  updateInvoicePayable,
} from '@src/apis/invoice/payable.api'
import { toast } from 'react-hot-toast'
import ErrorBoundary from '@src/@core/components/error/error-boundary'
import ErrorFallback from '@src/@core/components/error/error-fallback'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import PayableHistory from './components/detail/version-history'

type MenuType = 'info' | 'history'

/* TODO:
1. pdf기능 완성
2. version history
3. confirm invoice
*/
export default function PayableDetail() {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const { id } = router.query

  const { user } = useContext(AuthContext)
  const ability = useContext(AbilityContext)

  const queryClient = useQueryClient()

  const { data: isUpdatable } = useCheckInvoicePayableEditable(Number(id))
  const isAccountManager = ability.can('read', 'account_manage')

  // ** store
  const dispatch = useAppDispatch()
  const invoicePayable = useAppSelector(state => state.invoicePayable)

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('info')

  const { data } = useGetPayableDetail(Number(id))
  const { data: jobList } = useGetPayableJobList(Number(id))

  useEffect(() => {
    if (menuQuery && ['info', 'history'].includes(menuQuery)) {
      setMenu(menuQuery)
    }
  }, [menuQuery])

  useEffect(() => {
    if (!router.isReady) return
    router.replace(`/invoice/payable/${id}?menu=${menu}`)
  }, [menu, id])

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

  function onConfirmInvoice() {
    openModal({
      type: 'confirm',
      children: (
        <CustomModal
          vary='successful'
          title='Are you sure you want to confirm the invoice? It will be notified to Pro as well.'
          rightButtonText='Confirm'
          onClose={() => closeModal('confirm')}
          onClick={() => {
            updateMutation.mutate({
              invoiceConfirmedAt: Date(),
              invoiceConfirmTimezone: user?.timezone!,
            })
            closeModal('confirm')
          }}
        />
      ),
    })
  }

  // ** Download pdf
  const onClickPreview = (lang: 'EN' | 'KO') => {
    makePdfData(lang)
    closeModal('PreviewModal')
  }

  function handlePrint() {
    closeModal('DownloadQuotesModal')
    router.push('/invoice/payable/print')
  }

  const deleteMutation = useMutation((id: number) => deleteInvoicePayable(id), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'invoice/payable/list' })
      router.push('/invoice/payable/')
    },
    onError: () => {
      toast.error('Something went wrong. Please try again.', {
        position: 'bottom-left',
      })
    },
  })

  function onClickDelete() {
    openModal({
      type: 'deleteInvoice',
      children: (
        <DeleteConfirmModal
          message='Are you sure you want to delete this invoice?'
          onClose={() => closeModal('deleteInvoice')}
          onDelete={() => deleteMutation.mutate(Number(id))}
        />
      ),
    })
  }

  /* Open pdf download modal */
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
              <PrintInvoicePayablePreview
                data={invoicePayable.invoicePayableData}
                type='preview'
                user={user!}
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

  const onDownloadInvoiceClick = () => {
    openModal({
      type: 'DownloadQuotesModal',
      children: (
        <DownloadQuotesModal
          onClose={() => {
            closeModal('DownloadQuotesModal')
          }}
          onClick={onClickPreview}
        />
      ),
    })
  }

  //TODO: pdf다운 시, 다운받을 데이터를 서버에서 받을지, 아니면
  //추가로 필요한 데이터들을 모두 payable detail api로 리턴받을지 리샤에게 문의하기
  function makePdfData(lang: 'EN' | 'KO') {
    // if (data) {
    //   const res: InvoicePayableDownloadData = {
    //     invoiceId: data.id,
    //     adminCompanyName: 'GloZ',
    //     companyAddress:
    //       lang === 'EN'
    //         ? '3325 Wilshire Blvd Ste 626 Los Angeles CA 90010'
    //         : '서울특별시 강남구 영동대로 106길 11, 3층(삼성동, 현성빌딩)',
    //     corporationId: data.corporationId,
    //     invoicedAt: data.invoicedAt,
    //     payDueAt: data.payDueAt,
    //     payDueTimezone: data.payDueTimezone,
    //     paidAt: data.paidAt,
    //     paidDateTimezone: data.paidDateTimezone,
    //     pro: {
    //       email: data.pro.email,
    //       name: data.pro.name,
    //     },
    //   }
    //   dispatch(setInvoicePayable(res))
    //   dispatch(setInvoicePayableLang(lang))
    // }
    dispatch(setInvoicePayableLang(lang))
    dispatch(setInvoicePayableIsReady(true))
  }

  return (
    <ErrorBoundary FallbackComponent={<ErrorFallback />}>
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
                onClick={onDownloadInvoiceClick}
                variant='outlined'
                startIcon={<Icon icon='ic:baseline-download' />}
              >
                Download invoice
              </Button>
              {isUpdatable && data?.invoiceConfirmedAt === null ? (
                <Button variant='contained' onClick={onConfirmInvoice}>
                  Confirm invoice
                </Button>
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
                <InvoiceInfo
                  payableId={Number(id)}
                  isUpdatable={isUpdatable!}
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
                  <PayableHistory
                    isUpdatable={isUpdatable || false}
                    invoiceId={Number(id)}
                    invoiceCorporationId={data?.corporationId!}
                  />
                </Suspense>
              </Card>
            </TabPanel>
          </TabContext>
        </Grid>
        {!isUpdatable ? null : (
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
    </ErrorBoundary>
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
