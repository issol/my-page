import {
  Autocomplete,
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
  TextField,
  Tooltip,
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
  OrderProjectInfoFormType,
  OrderStatusType,
} from '@src/types/common/orders.type'
import {
  ClientType,
  DeliveryFileType,
  ProjectInfoType,
} from '@src/types/orders/order-detail'
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
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
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
import { getCurrentRole } from '@src/shared/auth/storage'
import { ReasonType } from '@src/types/quotes/quote'
import ReasonModal from '@src/@core/components/common-modal/reason-modal'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'
import invoice from '@src/store/invoice'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getClientDetail } from '@src/apis/client.api'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'
import { getFilePath } from '@src/shared/transformer/filePath.transformer'
import { getDownloadUrlforCommon } from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { AuthContext } from '@src/context/AuthContext'
import toast from 'react-hot-toast'

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
  client?: ClientType
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
  client,
}: Props) => {
  const { openModal, closeModal } = useModal()

  const currentRole = getCurrentRole()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [status, setStatus] = useState<number>(invoiceInfo.invoiceStatus)
  const [isReminder, setIsReminder] = useState(invoiceInfo.setReminder)
  const [issued, setIssued] = useState<boolean>(invoiceInfo.taxInvoiceIssued)

  const statusLabel =
    statusList?.find(i => i.value === invoiceInfo.invoiceStatus)?.label || ''
  const [fileSize, setFileSize] = useState(0)
  const [savedFiles, setSavedFiles] = useState<DeliveryFileType[]>([])

  const { user } = useContext(AuthContext)

  const [contactPersonEdit, setContactPersonEdit] = useState(false)
  const [contactPersonId, setContactPersonId] = useState<number | null>(null)
  const [contactPersonList, setContactPersonList] = useState<
    Array<
      ContactPersonType<number> & {
        value: number
        label: string
      }
    >
  >([])

  const onClickReason = (status: string, reason: ReasonType | null) => {
    openModal({
      type: `${status}ReasonModal`,
      children: (
        <ReasonModal
          onClose={() => closeModal(`${status}ReasonModal`)}
          reason={reason}
          type={status}
          vary='info'
        />
      ),
    })
  }

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

  const onClickEditSaveContactPerson = () => {
    // TODO api
    if (onSave) {
      onSave({
        id: invoiceInfo.id,
        form: { contactPersonId: contactPersonId! },
      })
    }
  }

  const handleDeleteInvoice = () => {
    deleteInvoiceMutation.mutate(invoiceInfo.id)
  }

  function fetchFile(fileName: string) {
    // TODO File path 논의되면 수정하기
    const path = getFilePath(['delivery', invoiceInfo.id.toString()], fileName)

    getDownloadUrlforCommon(S3FileType.TAX_INVOICE, path).then(res => {
      fetch(res.url, { method: 'GET' })
        .then(res => {
          return res.blob()
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${fileName}`
          document.body.appendChild(a)
          a.click()
          setTimeout((_: any) => {
            window.URL.revokeObjectURL(url)
          }, 60000)
          a.remove()
        })
        .catch(err =>
          toast.error(
            'Something went wrong while uploading files. Please try again.',
            {
              position: 'bottom-left',
            },
          ),
        )
    })
  }

  function downloadOneFile(file: DeliveryFileType) {
    fetchFile(file.fileName)
  }

  function downloadAllFiles(files: Array<DeliveryFileType> | [] | undefined) {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file.fileName)
    })
  }

  const savedFileList = savedFiles?.map((file: DeliveryFileType) => (
    <Box key={uuidv4()}>
      <Typography
        variant='body2'
        fontSize={14}
        fontWeight={400}
        sx={{ mb: '5px' }}
      >
        {FullDateTimezoneHelper(file.createdAt, user?.timezone)}
      </Typography>
      <Box
        sx={{
          display: 'flex',
          marginBottom: '8px',
          width: '100%',
          justifyContent: 'space-between',
          borderRadius: '8px',
          padding: '10px 12px',
          border: '1px solid rgba(76, 78, 100, 0.22)',
          background: '#f9f8f9',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: '8px', display: 'flex' }}>
            <Icon
              icon='material-symbols:file-present-outline'
              style={{ color: 'rgba(76, 78, 100, 0.54)' }}
              fontSize={24}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={file.fileName}>
              <Typography
                variant='body1'
                fontSize={14}
                fontWeight={600}
                lineHeight={'20px'}
                sx={{
                  overflow: 'hidden',
                  wordBreak: 'break-all',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                }}
              >
                {file.fileName}
              </Typography>
            </Tooltip>

            <Typography variant='caption' lineHeight={'14px'}>
              {formatFileSize(file.fileSize)}
            </Typography>
          </Box>
        </Box>
        {savedFiles.length ? null : (
          <IconButton onClick={() => downloadOneFile(file)}>
            <Icon icon='mdi:download' fontSize={24} />
          </IconButton>
        )}
      </Box>
    </Box>
  ))

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

  useEffect(() => {
    if (client) {
      setContactPersonId(client.contactPerson ? client.contactPerson.id! : null)

      getClientDetail(client.client.clientId)
        .then(res => {
          if (res?.contactPersons?.length) {
            const result: Array<
              ContactPersonType<number> & {
                value: number
                label: string
              }
            > = res.contactPersons.map(item => ({
              ...item,
              value: item.id!,
              label: !item?.jobTitle
                ? getLegalName({
                    firstName: item.firstName!,
                    middleName: item.middleName,
                    lastName: item.lastName!,
                  })
                : `${getLegalName({
                    firstName: item.firstName!,
                    middleName: item.middleName,
                    lastName: item.lastName!,
                  })} / ${item.jobTitle}`,
            }))
            setContactPersonList(result)
          } else {
            setContactPersonList([])
          }
        })
        .catch(e => {
          setContactPersonList([])
        })
    }
  }, [client])

  useEffect(() => {
    let result = 0

    savedFiles.forEach(
      (file: { fileSize: number }) => (result += file.fileSize),
    )
    setFileSize(result)
  }, [savedFiles])

  useEffect(() => {
    if (invoiceInfo?.taxInvoiceFiles?.length) {
      setSavedFiles(invoiceInfo.taxInvoiceFiles)
    }
  }, [invoiceInfo])

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
                {type === 'detail' &&
                isUpdatable &&
                currentRole &&
                currentRole.name !== 'CLIENT' ? (
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
                      ) : currentRole && currentRole.name === 'CLIENT' ? (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          {InvoiceReceivableChip(
                            statusLabel,
                            invoiceInfo.invoiceStatus,
                          )}
                          {invoiceInfo.invoiceStatus === 301200 && (
                            <IconButton
                              onClick={() => {
                                invoiceInfo.reason &&
                                  onClickReason('Canceled', invoiceInfo.reason)
                              }}
                            >
                              <img
                                src='/images/icons/onboarding-icons/more-reason.svg'
                                alt='more'
                              />
                            </IconButton>
                          )}
                        </Box>
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
                {currentRole && currentRole.name === 'CLIENT' ? (
                  <Box sx={{ display: 'flex' }}>
                    <Box sx={{ display: 'flex', width: '50%' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',

                          width: '25.21%',
                        }}
                      >
                        <Typography fontSize={14} fontWeight={600}>
                          Contact person
                        </Typography>
                      </Box>
                      {contactPersonEdit ? (
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '10px',
                            width: '300px',
                          }}
                        >
                          <Autocomplete
                            autoHighlight
                            fullWidth
                            options={contactPersonList
                              .filter(item => item.id !== contactPersonId)
                              .map(value => ({
                                value: value.value,
                                label: value.label,
                              }))}
                            onChange={(e, v) => {
                              // onChange(v.value)
                              const res = contactPersonList.filter(
                                item => item.id === Number(v.value),
                              )
                              setContactPersonId(
                                res.length ? res[0].id! : Number(v.value)!,
                              )
                            }}
                            disableClearable
                            // disabled={type === 'request'}
                            value={
                              contactPersonList
                                .filter(value => value.id === contactPersonId)
                                .map(value => ({
                                  value: value.value,
                                  label: value.label,
                                }))[0] || { value: '', label: '' }
                            }
                            renderInput={params => (
                              <TextField
                                {...params}
                                size='small'
                                placeholder='Select a member'
                                // label='Contact person*'
                                inputProps={{
                                  ...params.inputProps,
                                }}
                              />
                            )}
                          />
                          <Box
                            sx={{
                              display: 'flex',
                              gap: '5px',
                              alignItems: 'center',
                            }}
                          >
                            <Button
                              variant='outlined'
                              sx={{
                                width: '26px !important',
                                height: '26px',
                                minWidth: '26px !important',
                                padding: '0 !important',
                                border: 'none',
                                color: 'rgba(76, 78, 100, 0.6)',
                              }}
                              onClick={() => setContactPersonEdit(false)}
                            >
                              <Icon icon='ic:outline-close' fontSize={20} />
                            </Button>
                            <Button
                              variant='contained'
                              sx={{
                                width: '26px !important',
                                height: '26px',
                                minWidth: '26px !important',
                                padding: '0 !important',
                              }}
                              onClick={onClickEditSaveContactPerson}
                            >
                              <Icon icon='mdi:check' fontSize={20} />
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Typography
                          variant='body2'
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                          }}
                        >
                          {getLegalName({
                            firstName: client?.contactPerson?.firstName,
                            middleName: client?.contactPerson?.middleName,
                            lastName: client?.contactPerson?.lastName,
                          })}
                          {client?.contactPerson?.jobTitle
                            ? ` / ${client?.contactPerson?.jobTitle}`
                            : ''}
                          {type === 'history' ? null : (
                            <IconButton
                              onClick={() => setContactPersonEdit(true)}
                            >
                              <Icon icon='mdi:pencil-outline' />
                            </IconButton>
                          )}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ) : null}
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

                {currentRole && currentRole.name === 'CLIENT' ? null : (
                  <>
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
                  </>
                )}

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
                        {invoiceInfo.description ||
                        invoiceInfo.description !== ''
                          ? invoiceInfo.description
                          : '-'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {type === 'history' ||
                (currentRole && currentRole.name === 'CLIENT') ? null : (
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
          {type === 'history' ||
          (currentRole && currentRole.name === 'CLIENT') ? null : (
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
          {currentRole &&
          currentRole.name === 'CLIENT' &&
          type !== 'history' ? (
            <Card sx={{ padding: '24px' }}>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '36px' }}
              >
                <Box
                  sx={{ display: 'flex', gap: '20px', alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='body1' fontWeight={600}>
                      Tax invoice
                    </Typography>
                    <Typography variant='caption'>
                      {formatFileSize(fileSize).toLowerCase()}/2 gb
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '16px' }}>
                    <Button
                      variant='outlined'
                      disabled={savedFiles.length < 1}
                      sx={{
                        height: '34px',
                      }}
                      onClick={() => downloadAllFiles(savedFiles)}
                    >
                      <Icon icon='mdi:download' fontSize={18} />
                      &nbsp;Download all
                    </Button>
                  </Box>
                </Box>
                {savedFiles.length ? (
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3,1fr)',
                      gridGap: '16px',
                    }}
                  >
                    {savedFileList}
                  </Box>
                ) : (
                  '-'
                )}
              </Box>
            </Card>
          ) : null}
        </Box>
      )}

      {edit ||
      type === 'history' ||
      (currentRole && currentRole.name === 'CLIENT') ? null : (
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
