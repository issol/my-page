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
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tab,
  Typography,
} from '@mui/material'
import { styled } from '@mui/system'
import { v4 as uuidv4 } from 'uuid'

// ** contexts
import { AbilityContext } from '@src/layouts/components/acl/Can'
import { useRecoilValueLoadable } from 'recoil'
import { authState } from '@src/states/auth'

// ** hooks
import { useRouter } from 'next/router'
import { useAppDispatch, useAppSelector } from '@src/hooks/useRedux'
import useModal from '@src/hooks/useModal'

// ** components
import InvoiceInfo from './components/detail/invoice-info'
import DownloadQuotesModal from 'src/pages/[companyName]/quotes/detail/components/pdf-download/download-qoutes-modal'
import DeleteConfirmModal from 'src/pages/[companyName]/client/components/modals/delete-confirm-modal'
import PrintInvoicePayablePreview from './components/detail/components/pdf-download/invoice-payable-preview'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import PayableHistory from './components/detail/version-history'

// ** store
import {
  setInvoicePayable,
  setInvoicePayableIsReady,
  setInvoicePayableLang,
} from '@src/store/invoice-payable'
import {
  InvoicePayableDetailType,
  InvoicePayableDownloadData,
  PayableFormType,
  PayablePatchType,
} from '@src/types/invoice/payable.type'

// ** apis
import {
  useCheckInvoicePayableEditable,
  useGetPayableDetail,
  useGetPayableJobList,
} from '@src/queries/invoice/payable.query'
import { useMutation, useQueryClient } from 'react-query'
import {
  deleteInvoicePayable,
  updateInvoicePaidStatus,
  updateInvoicePayable,
} from '@src/apis/invoice/payable.api'

import { toast } from 'react-hot-toast'
import { useGetStatusList } from '@src/queries/common.query'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import {
  account_manage,
  invoice_payable,
} from '@src/shared/const/permission-class'

import { fixDigit } from '@src/shared/helpers/price.helper'
import ModalWithDatePicker from 'src/pages/[companyName]/client/components/modals/modal-with-datepicker'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { InvoicePayableStatus } from '@src/types/common/status.type'
import Link from 'next/link'

type MenuType = 'info' | 'history'

export default function PayableDetail() {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const { id } = router.query

  const auth = useRecoilValueLoadable(authState)
  const ability = useContext(AbilityContext)

  const queryClient = useQueryClient()

  const { data: isUpdatable } = useCheckInvoicePayableEditable(Number(id))
  const User = new invoice_payable(auth.getValue().user?.id!)
  const AccountingTeam = new account_manage(auth.getValue().user?.id!)

  const isDeletable = ability.can('delete', User)
  const isAccountInfoUpdatable = ability.can('update', AccountingTeam)
  const { data: statusList } = useGetStatusList('InvoicePayable')

  // ** store
  const dispatch = useAppDispatch()
  const invoicePayable = useAppSelector(state => state.invoicePayable)

  const menuQuery = router.query.menu as MenuType
  const [menu, setMenu] = useState<MenuType>('info')

  const { data, isLoading: isPayableDetailLoading } = useGetPayableDetail(
    Number(id),
  )
  const { data: jobList } = useGetPayableJobList(Number(id))

  const [editInfo, setEditInfo] = useState(false)

  /* 케밥 메뉴 */
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const handleMenuClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

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
    (form: PayablePatchType) => updateInvoicePayable(Number(id), form),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/detail' })
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/list' })
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  const updateStatusMutation = useMutation(
    (data: { id: number; status: InvoicePayableStatus }) =>
      updateInvoicePayable(data.id, { invoiceStatus: data.status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/detail' })
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/list' })
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  function onCompleteRevisionInvoice() {
    if (auth.state === 'hasValue' && auth.getValue().user)
      openModal({
        type: 'CompleteRevisionModal',
        children: (
          <CustomModal
            vary='successful'
            title='Are you sure you want to complete revision? The revised information will be updated to Pro as well.'
            rightButtonText='Confirm'
            onClose={() => closeModal('CompleteRevisionModal')}
            onClick={() => {
              updateMutation.mutate({
                invoiceStatus: 40200,
              })
              closeModal('CompleteRevisionModal')
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

  function makePdfData(lang: 'EN' | 'KO') {
    if (data) {
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
        pro: data.pro,

        jobList: jobList?.data || [],
        subtotal: data.subtotal,
        tax: data.tax,
        totalPrice: data.totalPrice,
        taxRate: fixDigit(data?.taxRate, 2),
        currency: data.currency,
      }
      dispatch(setInvoicePayable(res))
      dispatch(setInvoicePayableLang(lang))
      // dispatch(setInvoicePayableIsReady(true))
    }
  }

  const updateInvoicePaidStatusMutation = useMutation(
    (data: {
      payableId: number
      paidAt: string
      paidDateTimezone: CountryType
    }) =>
      updateInvoicePaidStatus(
        data.payableId,
        data.paidAt,
        data.paidDateTimezone,
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/detail' })
        queryClient.invalidateQueries({ queryKey: 'invoice/payable/list' })
      },
      onError: () => {
        toast.error('Something went wrong. Please try again.', {
          position: 'bottom-left',
        })
      },
    },
  )

  const onChangeStatusToPaid = () => {
    openModal({
      type: 'changeStatus',
      children: (
        <ModalWithDatePicker
          title={`Mark as paid?`}
          message={`Are you sure you want to mark this invoice as paid? The payment date will be applied to the invoice.`}
          onClick={({
            paymentAt,
            paymentTimezone,
          }: {
            paymentAt: Date
            paymentTimezone: CountryType
          }) => {
            updateInvoicePaidStatusMutation.mutate({
              payableId: Number(id),
              paidAt: paymentAt.toISOString(),
              paidDateTimezone: paymentTimezone,
            })
          }}
          onClose={() => closeModal('changeStatus')}
          rightButtonName='Confirm'
          leftButtonName='Cancel'
          contactPersonTimezone={auth.getValue().user?.timezone ?? null}
        />
      ),
    })
  }

  return (
    <Grid container spacing={6}>
      {updateMutation.isLoading ||
      deleteMutation.isLoading ||
      updateInvoicePaidStatusMutation.isLoading ||
      isPayableDetailLoading ? (
        <OverlaySpinner />
      ) : null}
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
            {editInfo ? null : (
              <div>
                <IconButton
                  aria-label='more'
                  aria-haspopup='true'
                  onClick={handleMenuClick}
                >
                  <Icon icon='mdi:dots-vertical' />
                </IconButton>
                <Menu
                  elevation={8}
                  anchorEl={anchorEl}
                  id='customized-menu'
                  onClose={handleMenuClose}
                  open={Boolean(anchorEl)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  <MenuItem
                    sx={{
                      gap: 2,
                      '&:hover': {
                        background: 'inherit',
                        cursor: 'default',
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '10px',
                        alignITems: 'start',
                      }}
                    >
                      <Typography>Linked order :</Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        {data?.jobs?.data
                          .sort((a, b) => a.id - b.id)
                          .map(value => {
                            return (
                              <Link
                                key={uuidv4()}
                                href={`/orders/order-list/detail/${value?.id}`}
                                style={{ color: 'rgba(76, 78, 100, 0.87)' }}
                              >
                                {value?.corporationId
                                  .split('-')
                                  .slice(0, 2)
                                  .join('-')}
                              </Link>
                            )
                          })}
                      </Box>
                    </Box>
                  </MenuItem>
                </Menu>
              </div>
            )}
          </Box>
          {editInfo ? null : (
            <Box display='flex' alignItems='center' gap='18px'>
              {isUpdatable && data?.invoiceStatus === 40100 ? (
                <Button variant='contained' onClick={onCompleteRevisionInvoice}>
                  Complete revision
                </Button>
              ) : null}
              <Button
                onClick={onDownloadInvoiceClick}
                variant='outlined'
                startIcon={<Icon icon='ic:baseline-download' />}
              >
                Download invoice
              </Button>
            </Box>
          )}
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
                data={data as InvoicePayableDetailType}
                jobList={jobList || { count: 0, totalCount: 0, data: [] }}
                statusList={statusList!}
                auth={auth.getValue()}
                editInfo={editInfo}
                setEditInfo={setEditInfo}
                isDeletable={isDeletable}
                onClickDelete={onClickDelete}
                isAccountInfoUpdatable={isAccountInfoUpdatable}
                onMarkAsPaidClick={onChangeStatusToPaid}
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
