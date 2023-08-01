import {
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material'
import {
  InvoiceReceivableChip,
  JobTypeChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import Icon from '@src/@core/components/icon'
import {
  FullDateHelper,
  FullDateTimezoneHelper,
} from '@src/shared/helpers/date.helper'

import {
  Control,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  useForm,
  FieldErrors,
} from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
import { yupResolver } from '@hookform/resolvers/yup'
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import useModal from '@src/hooks/useModal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { useMutation, useQueryClient } from 'react-query'
import { deleteOrder } from '@src/apis/order-detail.api'
import { useRouter } from 'next/router'
import {
  InvoiceProjectInfoFormType,
  InvoiceReceivableStatusType,
} from '@src/types/invoice/common.type'

import InvoiceProjectInfoForm from '@src/pages/components/forms/invoice-receivable-info-form'
import {
  InvoiceReceivableDetailType,
  InvoiceReceivablePatchParamsType,
} from '@src/types/invoice/receivable.type'
import InformationModal from '@src/@core/components/common-modal/information-modal'
import InvoiceAccountingInfoForm from '@src/pages/components/forms/invoice-accouting-info-form'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import { deleteInvoice } from '@src/apis/invoice/receivable.api'

type Props = {
  type: string
  invoiceInfo: InvoiceReceivableDetailType
  edit: boolean
  accountingEdit?: boolean
  setEdit?: Dispatch<SetStateAction<boolean>>
  setAccountingEdit?: Dispatch<SetStateAction<boolean>>
  orderId: number
  onSave?: (data: {
    id: number
    form: InvoiceReceivablePatchParamsType
  }) => void
  clientTimezone?: CountryType
  invoiceInfoControl?: Control<InvoiceProjectInfoFormType, any>
  getInvoiceInfo?: UseFormGetValues<InvoiceProjectInfoFormType>
  setInvoiceInfo?: UseFormSetValue<InvoiceProjectInfoFormType>
  invoiceInfoWatch?: UseFormWatch<InvoiceProjectInfoFormType>
  invoiceInfoReset?: UseFormReset<InvoiceProjectInfoFormType>
  invoiceInfoErrors?: FieldErrors<InvoiceProjectInfoFormType>
  isInvoiceInfoValid?: boolean
  statusList: {
    value: number
    label: string
  }[]
  isUpdatable: boolean
  isDeletable: boolean
}
const InvoiceInfo = ({
  type,
  invoiceInfo,
  edit,
  setEdit,
  accountingEdit,
  setAccountingEdit,
  orderId,
  onSave,
  clientTimezone,
  invoiceInfoControl,
  getInvoiceInfo,
  setInvoiceInfo,
  invoiceInfoWatch,
  invoiceInfoReset,
  invoiceInfoErrors,
  isInvoiceInfoValid,
  statusList,
  isUpdatable,
  isDeletable,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<number>(invoiceInfo.invoiceStatus)
  const [isReminder, setIsReminder] = useState(invoiceInfo.setReminder)
  const [issued, setIssued] = useState<boolean>(invoiceInfo.taxInvoiceIssued)

  const statusLabel =
    statusList?.find(i => i.value === invoiceInfo.invoiceStatus)?.label || ''

  const handleChangeStatus = (event: SelectChangeEvent) => {
    const value = Number(event.target.value)
    setStatus(value)
    const data = getInvoiceInfo && getInvoiceInfo()
    if (onSave && data) {
      onSave({
        id: invoiceInfo.id,
        form: {
          ...data,
          invoiceStatus: value as InvoiceReceivableStatusType,
        },
      })
    }
  }

  const handleChangeIsReminder = (event: ChangeEvent<HTMLInputElement>) => {
    setIsReminder(event.target.checked)
    const data = getInvoiceInfo && getInvoiceInfo()
    if (onSave && data) {
      onSave({
        id: invoiceInfo.id,
        form: {
          ...data,
          setReminder: event.target.checked,
        },
      })
    }
  }

  const handleChangeIssued = (event: ChangeEvent<HTMLInputElement>) => {
    setIssued(event.target.checked)
    const data = getInvoiceInfo && getInvoiceInfo()
    if (onSave && data) {
      onSave({
        id: invoiceInfo.id,
        form: {
          ...data,
          taxInvoiceIssued: event.target.checked,
        },
      })
    }
  }

  const deleteInvoiceMutation = useMutation((id: number) => deleteInvoice(id), {
    onSuccess: () => {
      closeModal('DeleteOrderModal')
      router.push('/invoice/receivable')
      queryClient.invalidateQueries('invoice/receivable/list')
    },
  })

  const onClickDiscard = () => {
    setEdit!(false)
    closeModal('DiscardModal')
  }

  const onClickAccountingDiscard = () => {
    setAccountingEdit!(false)
    closeModal('DiscardModal')
  }

  const onClickSave = (infoType: 'basic' | 'accounting') => {
    const data = getInvoiceInfo && getInvoiceInfo()
    if (data) {
      const res: InvoiceReceivablePatchParamsType =
        infoType === 'basic'
          ? {
              invoicedAt: data.invoiceDate,
              invoicedAtTimezone: data.invoiceDateTimezone,
              payDueAt: data.paymentDueDate.date,
              payDueTimezone: data.paymentDueDate.timezone,
              invoiceDescription: data.invoiceDescription,

              invoiceConfirmedAt: data.invoiceConfirmDate?.date,
              invoiceConfirmTimezone: data.invoiceConfirmDate?.timezone,
              taxInvoiceDueAt: data.taxInvoiceDueDate?.date,
              taxInvoiceDueTimezone: data.taxInvoiceDueDate?.timezone,
            }
          : {
              paidAt: data.paymentDate?.date,
              paidDateTimezone: data.paymentDate?.timezone,
              taxInvoiceIssuedAt: data.taxInvoiceIssuanceDate?.date,
              taxInvoiceIssuedDateTimezone:
                data.taxInvoiceIssuanceDate?.timezone,
              salesCheckedAt: data.salesRecognitionDate?.date,
              salesCheckedDateTimezone: data.salesRecognitionDate?.timezone,
              notes: data.notes,
              salesCategory: data?.salesCategory,
              taxInvoiceIssued: data?.taxInvoiceIssued,
            }
      if (onSave) {
        onSave({ id: invoiceInfo.id, form: res })
      }
    }
  }

  const handleDeleteInvoice = () => {
    deleteInvoiceMutation.mutate(invoiceInfo.id)
  }

  useEffect(() => {
    if (invoiceInfo && invoiceInfoReset) {
      setStatus(invoiceInfo.invoiceStatus)
      setIsReminder(invoiceInfo.setReminder)
      setIssued(invoiceInfo.taxInvoiceIssued)
      const res: InvoiceProjectInfoFormType = {
        ...invoiceInfo,
        invoiceDescription: invoiceInfo.description,
        invoiceDateTimezone: invoiceInfo.invoicedAtTimezone,
        invoiceDate: invoiceInfo.invoicedAt,
        showDescription: invoiceInfo.showDescription,
        paymentDueDate: {
          date: invoiceInfo.payDueAt,
          timezone: clientTimezone!,
        },
        invoiceConfirmDate: {
          date: invoiceInfo.invoiceConfirmedAt ?? null,
          timezone: clientTimezone!,
        },
        taxInvoiceDueDate: {
          date: invoiceInfo.taxInvoiceDueAt ?? null,
          timezone: clientTimezone!,
        },
        paymentDate: {
          date: invoiceInfo.paidAt,
          timezone: clientTimezone!,
        },
        taxInvoiceIssuanceDate: {
          date: invoiceInfo.taxInvoiceIssuedAt ?? '',
          timezone: clientTimezone!,
        },
        salesRecognitionDate: {
          date: invoiceInfo.salesCheckedAt ?? '',
          timezone: clientTimezone!,
        },

        salesCategory: invoiceInfo.salesCategory,
        notes: invoiceInfo.notes,

        sendReminder: invoiceInfo.setReminder,
        tax: invoiceInfo.tax,
        isTaxable: invoiceInfo.isTaxable ?? true,
      }
      invoiceInfoReset(res)
    }
  }, [invoiceInfo, invoiceInfoReset, clientTimezone])

  const onClickDelete = () => {
    openModal({
      type: 'DeleteOrderModal',
      children: (
        <CustomModal
          onClose={() => closeModal('DeleteOrderModal')}
          onClick={handleDeleteInvoice}
          title='Are you sure you want to delete this invoice?'
          vary='error'
          rightButtonText='Delete'
          subtitle={`[${invoiceInfo.corporationId}] ${invoiceInfo.projectName}`}
        />
      ),
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {edit ? (
        <Card sx={{ padding: '24px' }}>
          <DatePickerWrapper>
            <Grid container xs={12} spacing={6}>
              <InvoiceProjectInfoForm
                control={invoiceInfoControl!}
                setValue={setInvoiceInfo!}
                watch={invoiceInfoWatch!}
                errors={invoiceInfoErrors!}
                clientTimezone={clientTimezone}
              />
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '16px',
                  }}
                >
                  <Button
                    variant='outlined'
                    color='secondary'
                    onClick={() =>
                      openModal({
                        type: 'DiscardModal',
                        children: (
                          <DiscardModal
                            onClose={() => closeModal('DiscardModal')}
                            onClick={onClickDiscard}
                          />
                        ),
                      })
                    }
                  >
                    Cancel
                  </Button>
                  <Button
                    variant='contained'
                    disabled={!isInvoiceInfoValid}
                    onClick={() =>
                      openModal({
                        type: 'EditSaveModal',
                        children: (
                          <EditSaveModal
                            onClose={() => closeModal('EditSaveModal')}
                            onClick={() => onClickSave('basic')}
                          />
                        ),
                      })
                    }
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </DatePickerWrapper>
        </Card>
      ) : accountingEdit ? (
        <Card sx={{ padding: '24px' }}>
          <Grid container xs={12} spacing={6}>
            <InvoiceAccountingInfoForm
              control={invoiceInfoControl!}
              getValue={getInvoiceInfo!}
              setValue={setInvoiceInfo!}
              watch={invoiceInfoWatch!}
              errors={invoiceInfoErrors!}
              clientTimezone={clientTimezone}
            />
            <Grid item xs={12}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '16px',
                }}
              >
                <Button
                  variant='outlined'
                  color='secondary'
                  onClick={() =>
                    openModal({
                      type: 'DiscardModal',
                      children: (
                        <DiscardModal
                          onClose={() => closeModal('DiscardModal')}
                          onClick={onClickAccountingDiscard}
                        />
                      ),
                    })
                  }
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  onClick={() =>
                    openModal({
                      type: 'EditSaveModal',
                      children: (
                        <EditSaveModal
                          onClose={() => closeModal('EditSaveModal')}
                          onClick={() => onClickSave('accounting')}
                        />
                      ),
                    })
                  }
                >
                  Save
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card sx={{ padding: '24px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Typography variant='h6'>
                  An Unexpected Proposal 1-10
                </Typography>
                {type === 'detail' && isUpdatable ? (
                  <IconButton
                    onClick={() => setEdit!(true)}
                    disabled={invoiceInfo.invoiceStatus === 30900}
                  >
                    <Icon icon='mdi:pencil-outline' />
                  </IconButton>
                ) : null}
              </Box>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ display: 'flex', flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '25.21%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          width: '100%',
                        }}
                      >
                        Invoice date
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '73.45%',
                      }}
                    >
                      <Typography
                        variant='subtitle2'
                        sx={{
                          width: '100%',
                        }}
                      >
                        {FullDateHelper(invoiceInfo.invoicedAt)}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '25.21%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          width: '100%',
                        }}
                      >
                        Status
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '73.45%',
                      }}
                    >
                      {type === 'history' ? (
                        InvoiceReceivableChip(
                          statusLabel,
                          invoiceInfo.invoiceStatus,
                        )
                      ) : (
                        <Select
                          value={status.toString()}
                          onChange={handleChangeStatus}
                          size='small'
                          sx={{ width: '253px' }}
                        >
                          {statusList.map(status => {
                            return (
                              <MenuItem key={uuidv4()} value={status.value}>
                                {status.label}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      )}
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '25.21%',
                        }}
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            width: '100%',
                          }}
                        >
                          Work name
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '73.45%',
                        }}
                      >
                        <Typography
                          variant='subtitle2'
                          sx={{
                            width: '100%',
                          }}
                        >
                          {invoiceInfo.workName ?? '-'}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '25.21%',
                        }}
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            width: '100%',
                          }}
                        >
                          Category
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '73.45%',
                        }}
                      >
                        <JobTypeChip
                          label={invoiceInfo.category}
                          type={invoiceInfo.category}
                        />
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flex: 1, alignItems: 'start' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '25.21%',
                        }}
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            width: '100%',
                          }}
                        >
                          Service type
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',

                          width: '73.45%',
                          flexWrap: 'wrap',
                        }}
                      >
                        {invoiceInfo.serviceType &&
                          invoiceInfo.serviceType.map(value => {
                            return (
                              <ServiceTypeChip label={value} key={uuidv4()} />
                            )
                          })}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',

                          width: '25.21%',
                        }}
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            width: '100%',
                          }}
                        >
                          Area of expertise
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap',
                          width: '73.45%',
                        }}
                      >
                        {invoiceInfo.expertise &&
                          invoiceInfo.expertise.map((value, idx) => {
                            return (
                              <Typography key={uuidv4()} variant='subtitle2'>
                                {invoiceInfo.expertise.length === idx + 1
                                  ? value
                                  : `${value}, `}
                              </Typography>
                            )
                          })}
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ display: 'flex', flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '33.28%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          width: '100%',
                        }}
                      >
                        Payment due
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '66.62%',
                      }}
                    >
                      <Typography
                        variant='subtitle2'
                        sx={{
                          width: '100%',
                        }}
                      >
                        {FullDateTimezoneHelper(
                          invoiceInfo.payDueAt,
                          invoiceInfo.payDueTimezone!,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '25.21%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          width: '100%',
                        }}
                      >
                        Invoice confirm date
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '73.45%',
                      }}
                    >
                      <Typography
                        variant='subtitle2'
                        sx={{
                          width: '100%',
                        }}
                      >
                        {FullDateTimezoneHelper(
                          invoiceInfo.invoiceConfirmedAt,
                          invoiceInfo.invoiceConfirmTimezone!,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ display: 'flex', width: '50%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '33.28%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          width: '100%',
                        }}
                      >
                        Tax invoice due date
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '66.62%',
                      }}
                    >
                      <Typography
                        variant='subtitle2'
                        sx={{
                          width: '100%',
                        }}
                      >
                        {FullDateTimezoneHelper(
                          invoiceInfo.invoiceConfirmedAt,
                          invoiceInfo.invoiceConfirmTimezone!,
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ display: 'flex' }}>
                  <Box sx={{ display: 'flex', flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '33.28%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          width: '100%',
                        }}
                      >
                        Revenue from
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '66.62%',
                      }}
                    >
                      <Typography
                        variant='subtitle2'
                        sx={{
                          width: '100%',
                        }}
                      >
                        {invoiceInfo.revenueFrom ?? '-'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', flex: 1 }}>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '25.21%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          width: '100%',
                        }}
                      >
                        Tax type
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '73.45%',
                      }}
                    >
                      <Typography
                        variant='subtitle2'
                        sx={{
                          width: '100%',
                        }}
                      >
                        {invoiceInfo.isTaxable ? 'Taxable' : 'Non-taxable'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ width: '100%' }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',

                        gap: '8px',
                        alignItems: 'center',
                        width: '25.21%',
                      }}
                    >
                      <Typography
                        variant='subtitle1'
                        sx={{
                          fontSize: '14px',
                          fontWeight: 600,
                          width: '100%',
                        }}
                      >
                        Invoice description
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: '8px',
                        alignItems: 'center',
                        width: '73.45%',
                      }}
                    >
                      <Typography
                        variant='subtitle2'
                        sx={{
                          width: '100%',
                        }}
                      >
                        {invoiceInfo.description}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {type === 'history' ? null : (
                  <>
                    <Divider />
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Checkbox
                        value={isReminder}
                        onChange={handleChangeIsReminder}
                        checked={isReminder}
                        disabled={invoiceInfo.invoiceStatus === 30900}
                      />

                      <Typography variant='body2'>
                        Send reminder for this invoice
                      </Typography>
                      <IconButton
                        onClick={() => {
                          openModal({
                            type: 'invoiceReminderModal',
                            children: (
                              <InformationModal
                                onClose={() =>
                                  closeModal('invoiceReminderModal')
                                }
                                title='Reminder information'
                                subtitle='A reminder email will be automatically sent to the client when the invoice is overdue.'
                                vary='info'
                              />
                            ),
                          })
                        }}
                      >
                        <Icon icon='ic:outline-info' />
                      </IconButton>
                    </Box>
                  </>
                )}
              </Box>
            </Box>
          </Card>
          {type === 'history' ? null : (
            <Card sx={{ padding: '24px' }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant='h6'>Accounting info</Typography>
                  {type === 'detail' && isUpdatable ? (
                    <IconButton onClick={() => setAccountingEdit!(true)}>
                      <Icon icon='mdi:pencil-outline' />
                    </IconButton>
                  ) : null}
                </Box>
                <Box
                  sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
                >
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '25.21%',
                        }}
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            width: '100%',
                          }}
                        >
                          Payment date
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '73.45%',
                        }}
                      >
                        <Typography
                          variant='subtitle2'
                          sx={{
                            width: '100%',
                          }}
                        >
                          {FullDateTimezoneHelper(
                            invoiceInfo.paidAt,
                            invoiceInfo.paidDateTimezone!,
                          )}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', flex: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '25.21%',
                        }}
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            width: '100%',
                          }}
                        >
                          Issuance date of tax invoice
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '73.45%',
                        }}
                      >
                        <Typography
                          variant='subtitle2'
                          sx={{
                            width: '100%',
                          }}
                        >
                          {FullDateTimezoneHelper(
                            invoiceInfo.taxInvoiceIssuedAt,
                            invoiceInfo.taxInvoiceIssuedDateTimezone!,
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '15px',
                    }}
                  >
                    <Box sx={{ display: 'flex' }}>
                      <Box sx={{ display: 'flex', flex: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            width: '25.21%',
                          }}
                        >
                          <Typography
                            variant='subtitle1'
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              width: '100%',
                            }}
                          >
                            Sales recognition date
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            width: '73.45%',
                          }}
                        >
                          <Typography
                            variant='subtitle2'
                            sx={{
                              width: '100%',
                            }}
                          >
                            {FullDateTimezoneHelper(
                              invoiceInfo.salesCheckedAt,
                              invoiceInfo.salesCheckedDateTimezone!,
                            )}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', flex: 1 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            width: '25.21%',
                          }}
                        >
                          <Typography
                            variant='subtitle1'
                            sx={{
                              fontSize: '14px',
                              fontWeight: 600,
                              width: '100%',
                            }}
                          >
                            Sales category
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                            width: '73.45%',
                          }}
                        >
                          {invoiceInfo.salesCategory}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ width: '100%' }}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',

                          gap: '8px',
                          alignItems: 'center',
                          width: '25.21%',
                        }}
                      >
                        <Typography
                          variant='subtitle1'
                          sx={{
                            fontSize: '14px',
                            fontWeight: 600,
                            width: '100%',
                          }}
                        >
                          Notes
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                          width: '73.45%',
                        }}
                      >
                        <Typography
                          variant='subtitle2'
                          sx={{
                            width: '100%',
                          }}
                        >
                          {invoiceInfo.notes ?? '-'}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Checkbox
                      value={issued}
                      onChange={handleChangeIssued}
                      checked={issued}
                      // disabled={invoiceInfo.invoiceStatus === 'Paid'}
                    />

                    <Typography variant='body2'>Tax invoice issued</Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          )}
        </Box>
      )}

      {edit || type === 'history' ? null : (
        <Grid xs={12} container>
          <Grid item xs={4}>
            <Card sx={{ padding: '20px', width: '100%' }}>
              <Button
                variant='outlined'
                fullWidth
                color='error'
                size='large'
                disabled={!isDeletable}
                onClick={onClickDelete}
              >
                Delete this invoice
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default InvoiceInfo
