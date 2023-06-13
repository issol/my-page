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
  OrderStatusChip,
  ServiceTypeChip,
} from '@src/@core/components/chips/chips'
import Icon from '@src/@core/components/icon'
import { OrderStatus } from '@src/shared/const/status/statuses'
import {
  FullDateHelper,
  FullDateTimezoneHelper,
} from '@src/shared/helpers/date.helper'
import {
  OrderProjectInfoFormType,
  OrderStatusType,
} from '@src/types/common/orders.type'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import {
  orderProjectInfoDefaultValue,
  orderProjectInfoSchema,
} from '@src/types/schema/orders-project-info.schema'
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
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import ProjectInfoForm from '@src/pages/components/forms/orders-project-info-form'
import DatePickerWrapper from '@src/@core/styles/libs/react-datepicker'
import useModal from '@src/hooks/useModal'
import DiscardModal from '@src/@core/components/common-modal/discard-modal'
import EditSaveModal from '@src/@core/components/common-modal/edit-save-modal'
import CustomModal from '@src/@core/components/common-modal/custom-modal'
import { useMutation, useQueryClient } from 'react-query'
import { deleteOrder, patchProjectInfo } from '@src/apis/order-detail.api'
import toast from 'react-hot-toast'
import { Router, useRouter } from 'next/router'
import dayjs from 'dayjs'
import {
  InvoiceProjectInfoFormType,
  InvoiceReceivableStatusType,
} from '@src/types/invoice/common.type'
import {
  invoiceProjectInfoDefaultValue,
  invoiceProjectInfoSchema,
} from '@src/types/schema/invoice-project-info.schema'
import InvoiceProjectInfoForm from '@src/pages/components/forms/invoice-receivable-info-form'
import { ClientFormType, clientSchema } from '@src/types/schema/client.schema'
import { useGetInvoiceStatus } from '@src/queries/invoice/common.query'
import {
  InvoiceReceivableDetailType,
  InvoiceReceivablePatchParamsType,
} from '@src/types/invoice/receivable.type'
import { InvoiceStatus } from '@glocalize-inc/glodex'
import InformationModal from '@src/@core/components/common-modal/information-modal'
import InvoiceAccountingInfoForm from '@src/pages/components/forms/invoice-accouting-info-form'
import { set } from 'nprogress'
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
}: Props) => {
  const { openModal, closeModal } = useModal()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [value, setValue] = useState<string>(invoiceInfo.invoiceStatus)
  const [isReminder, setIsReminder] = useState(invoiceInfo.setReminder)
  const { data: statusList, isLoading } = useGetInvoiceStatus()

  const handleChange = (event: SelectChangeEvent) => {
    setValue(event.target.value as string)
    const data = getInvoiceInfo && getInvoiceInfo()
    if (onSave && data) {
      onSave({
        id: invoiceInfo.id,
        form: {
          ...data,
          invoiceStatus: event.target.value as InvoiceReceivableStatusType,
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

  const onClickSave = () => {
    const data = getInvoiceInfo && getInvoiceInfo()
    if (data) {
      const res: InvoiceReceivablePatchParamsType = {
        invoiceStatus: data.status,
        invoicedAt: data.invoiceDate,
        payDueAt: data.paymentDueDate.date,
        payDueTimezone: data.paymentDueDate.timezone,
        invoiceDescription: data.invoiceDescription,

        invoiceConfirmedAt: data.invoiceConfirmDate?.date,
        invoiceConfirmTimezone: data.invoiceConfirmDate?.timezone,
        taxInvoiceDueAt: data.taxInvoiceDueDate?.date,
        taxInvoiceDueTimezone: data.taxInvoiceDueDate?.timezone,
      }
      if (onSave) {
        onSave({ id: invoiceInfo.id, form: res })
      }
    }
  }

  const handleDeleteInvoice = () => {
    deleteInvoiceMutation.mutate(invoiceInfo.id)
    console.log('delete')
  }

  useEffect(() => {
    if (invoiceInfo && invoiceInfoReset) {
      setValue(invoiceInfo.invoiceStatus)
      const res: InvoiceProjectInfoFormType = {
        ...invoiceInfo,
        status: invoiceInfo.invoiceStatus,

        invoiceDescription: invoiceInfo.description,

        invoiceDate: invoiceInfo.invoicedAt,
        paymentDueDate: {
          date: invoiceInfo.payDueAt,
          // timezone: invoiceInfo.payDueTimezone,
          timezone: clientTimezone!,
        },
        invoiceConfirmDate: {
          date: invoiceInfo.invoiceConfirmedAt ?? '',
          // timezone: invoiceInfo.invoiceConfirmTimezone ?? clientTimezone,
          timezone: clientTimezone!,
        },
        taxInvoiceDueDate: {
          date: invoiceInfo.taxInvoiceDueAt ?? '',
          // timezone: invoiceInfo.taxInvoiceDueTimezone ?? clientTimezone!,
          timezone: clientTimezone!,
        },
        paymentDate: {
          date: invoiceInfo.paidAt ?? '',
          // timezone: invoiceInfo.paidDateTimezone ?? clientTimezone!,
          timezone: clientTimezone!,
        },
        taxInvoiceIssuanceDate: {
          date: invoiceInfo.taxInvoiceIssuedAt ?? '',
          // timezone: invoiceInfo.taxInvoiceIssuedDateTimezone ?? clientTimezone!,
          timezone: clientTimezone!,
        },
        salesRecognitionDate: {
          date: invoiceInfo.salesCheckedAt ?? '',
          // timezone: invoiceInfo.salesCheckedDateTimezone ?? clientTimezone!,
          timezone: clientTimezone!,
        },

        sendReminder: invoiceInfo.setReminder,
        tax: invoiceInfo.tax,
        isTaxable: invoiceInfo.isTaxable ?? true,
      }
      // projectInfoReset(res)
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
                statusList={statusList!}
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
                            onClick={onClickSave}
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
              setValue={setInvoiceInfo!}
              watch={invoiceInfoWatch!}
              errors={invoiceInfoErrors!}
              clientTimezone={clientTimezone}
              statusList={statusList!}
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
                          onClick={onClickSave}
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
                {type === 'detail' ? (
                  <IconButton onClick={() => setEdit!(true)}>
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
                        InvoiceReceivableChip(invoiceInfo.invoiceStatus)
                      ) : (
                        <Select
                          value={value}
                          onChange={handleChange}
                          size='small'
                          sx={{ width: '253px' }}
                        >
                          {OrderStatus.map(status => {
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
                        Due date for the tax invoice
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
                        onChange={e => {
                          setIsReminder(e.target.checked)
                        }}
                        checked={isReminder}
                        disabled={invoiceInfo.invoiceStatus === 'Paid'}
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
                  {type === 'detail' ? (
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
                      value={isReminder}
                      onChange={e => {
                        setIsReminder(e.target.checked)
                      }}
                      checked={isReminder}
                      disabled={invoiceInfo.invoiceStatus === 'Paid'}
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
