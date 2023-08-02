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
import styled from 'styled-components'
import Icon from '@src/@core/components/icon'
import {
  FullDateHelper,
  FullDateTimezoneHelper,
} from '@src/shared/helpers/date.helper'

import { ClientType, DeliveryFileType } from '@src/types/orders/order-detail'
import {
  Control,
  UseFormGetValues,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid'
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
  MarkDayInfo,
} from '@src/types/invoice/receivable.type'
import InformationModal from '@src/@core/components/common-modal/information-modal'
import InvoiceAccountingInfoForm from '@src/pages/components/forms/invoice-accouting-info-form'
import { CountryType } from '@src/types/sign/personalInfoTypes'
import {
  cancelInvoice,
  deleteInvoice,
  deliverTaxInvoice,
  markInvoiceAsPaid,
} from '@src/apis/invoice/receivable.api'
import { getCurrentRole } from '@src/shared/auth/storage'
import { ReasonType } from '@src/types/quotes/quote'
import ReasonModal from '@src/@core/components/common-modal/reason-modal'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getClientDetail } from '@src/apis/client.api'
import { formatFileSize } from '@src/shared/helpers/file-size.helper'
import { getFilePath } from '@src/shared/transformer/filePath.transformer'
import {
  getDownloadUrlforCommon,
  getUploadUrlforCommon,
  uploadFileToS3,
} from '@src/apis/common.api'
import { S3FileType } from '@src/shared/const/signedURLFileType'
import { AuthContext } from '@src/context/AuthContext'
import { toast } from 'react-hot-toast'
import { useDropzone } from 'react-dropzone'
import { FILE_SIZE } from '@src/shared/const/maximumFileSize'
import SimpleAlertModal from '@src/pages/client/components/modals/simple-alert-modal'
import CancelRequestModal from './modal/cancel-reason-modal'
import { CancelReasonType } from '@src/types/requests/detail.type'

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
  isAccountInfoUpdatable: boolean
  client?: ClientType
  isFileUploading?: boolean
  setIsFileUploading?: (n: boolean) => void
}

type FileProp = { name: string; type: string; size: number }

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
  isAccountInfoUpdatable,
  client,
  isFileUploading,
  setIsFileUploading,
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

  const statusOption = client?.contactPerson?.userId
    ? statusList.filter(i => [30000, 30100, 30200].includes(i.value))
    : statusList.filter(
        i => ![30300, 30900, 301000, 301100, 301200].includes(i.value),
      )

  const [fileSize, setFileSize] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [savedFiles, setSavedFiles] = useState<DeliveryFileType[]>([])

  const { user } = useContext(AuthContext)

  const isInvoiceInfoUpdatable =
    ![30900, 301200].includes(invoiceInfo.invoiceStatus) && isUpdatable

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

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    disabled: invoiceInfo.clientConfirmedAt === null,
    maxSize: FILE_SIZE.DEFAULT,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'application/pdf': ['.pdf'],
      'text/csv': ['.cvs'],
      'text/plain': ['.txt'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
        ['.docx'],
    },
    onDrop: (acceptedFiles: File[]) => {
      const uniqueFiles = files
        .concat(acceptedFiles)
        .reduce((acc: File[], file: File) => {
          let result = fileSize
          acc.concat(file).forEach((file: FileProp) => (result += file.size))
          if (result > FILE_SIZE.DEFAULT) {
            onFileUploadReject()
            return acc
          } else {
            const found = acc.find(f => f.name === file.name)
            if (!found) acc.push(file)
            return acc
          }
        }, [])
      setFiles(uniqueFiles)
      setIsFileUploading && setIsFileUploading(true)
    },
    onDropRejected: () => onFileUploadReject(),
  })

  function onFileUploadReject() {
    openModal({
      type: 'rejectDrop',
      children: (
        <SimpleAlertModal
          message='The maximum file size you can upload is 50mb.'
          onClose={() => closeModal('rejectDrop')}
        />
      ),
    })
  }
  const onClickReason = (status: string, reason: ReasonType | null) => {
    openModal({
      type: `${status}ReasonModal`,
      children: (
        <ReasonModal
          onClose={() => closeModal(`${status}ReasonModal`)}
          reason={reason}
          showType={false}
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

  const handelChangeShowDescription = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const data = getInvoiceInfo && getInvoiceInfo()
    if (onSave && data) {
      onSave({
        id: invoiceInfo.id,
        form: {
          ...data,
          showDescription: event.target.checked,
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

  function fetchFile(file: DeliveryFileType) {
    getDownloadUrlforCommon(S3FileType.TAX_INVOICE, file.filePath).then(res => {
      fetch(res.url, { method: 'GET' })
        .then(res => {
          return res.blob()
        })
        .then(blob => {
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${file.fileName}`
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
    fetchFile(file)
  }

  function downloadAllFiles(files: Array<DeliveryFileType> | [] | undefined) {
    if (!files || !files.length) return

    files.forEach(file => {
      fetchFile(file)
    })
  }

  function onFileDelete(file: File) {
    setFiles(files.filter(i => i.name !== file.name))
  }

  // async function uploadFiles() {
  //     const fileInfo: DeliveryFileType[] = []
  //     const paths: string[] = files?.map(file =>
  //       getFilePath(['invoice', String(invoiceInfo.id), 'tax'], file.name),
  //     )
  //     const promiseArr = paths.map((url, idx) => {
  //       try{
  //         const res = await getUploadUrlforCommon(S3FileType.TAX_INVOICE, url);
  //       fileInfo.push({
  //         type: 'uploaded',
  //         filePath: url,
  //         fileName: files[idx].name,
  //         fileExtension: files[idx].type,
  //         fileSize: files[idx].size,
  //       });
  //       await uploadFileToS3(res.url, files[idx]);
  //       }catch(error){}
  //       return getUploadUrlforCommon(S3FileType.TAX_INVOICE, url).then(res => {
  //         fileInfo.push({
  //           type: 'uploaded',
  //           filePath: url,
  //           fileName: files[idx].name,
  //           fileExtension: files[idx].type,
  //           fileSize: files[idx].size,
  //         })
  //         return uploadFileToS3(res.url, files[idx])
  //       })

  //     })
  //     return [promiseArr, fileInfo]
  //   }
  async function uploadFiles(): Promise<[Promise<void>[], DeliveryFileType[]]> {
    const fileInfo: DeliveryFileType[] = []
    const paths: string[] = files?.map(file =>
      getFilePath(['invoice', String(invoiceInfo.id), 'tax'], file.name),
    )

    const promiseArr: Promise<void>[] = paths.map(async (url, idx) => {
      try {
        const res = await getUploadUrlforCommon(S3FileType.TAX_INVOICE, url)
        fileInfo.push({
          type: 'uploaded',
          filePath: url,
          fileName: files[idx].name,
          fileExtension: files[idx].type,
          fileSize: files[idx].size,
        })
        await uploadFileToS3(res.url, files[idx])
      } catch (error) {
        onError()
      }
    })

    await Promise.all(promiseArr)

    return [promiseArr, fileInfo]
  }

  async function deliverTaxInvoiceMutation() {
    try {
      const [promises, fileInfo] = await uploadFiles()
      await Promise.all(promises)
      if (fileInfo.length) {
        deliverTaxInvoice(invoiceInfo.id!, savedFiles.concat(fileInfo)).then(
          res => {
            toast.success('Success!', {
              position: 'bottom-left',
            })
            setFiles([])
            setIsFileUploading && setIsFileUploading(false)
            queryClient.invalidateQueries({
              queryKey: 'invoiceReceivableDetail',
            })
          },
        )
      }
    } catch (error) {
      setIsFileUploading && setIsFileUploading(false)
    }
  }

  function onError() {
    toast.error(
      'Something went wrong while uploading files. Please try again.',
      {
        position: 'bottom-left',
      },
    )
  }

  function onDeliverTaxInvoice() {
    openModal({
      type: 'uploadFiles',
      children: (
        <CustomModal
          vary='successful'
          title='Are you sure you want to deliver the uploaded files? You cannot delete the files after delivering them to the client.'
          onClick={() => {
            closeModal('uploadFiles')
            deliverTaxInvoiceMutation()
          }}
          onClose={() => closeModal('uploadFiles')}
          rightButtonText='Deliver'
        />
      ),
    })
  }

  function onCancelFileUpload() {
    if (!files.length) {
      setIsFileUploading && setIsFileUploading(false)
    } else {
      openModal({
        type: 'cancelUpload',
        children: (
          <CustomModal
            vary='error'
            title='Are you sure you want to deliver the uploaded files? You cannot delete the files after delivering them to the client.'
            onClick={() => {
              closeModal('cancelUpload')
              setIsFileUploading && setIsFileUploading(false)
            }}
            onClose={() => closeModal('cancelUpload')}
            rightButtonText='Cancel'
            leftButtonText='No'
          />
        ),
      })
    }
  }

  const uploadedFileList = files.map((file: File) => (
    <Box key={uuidv4()}>
      <FileBox>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: '8px', display: 'flex' }}>
            <Icon
              icon='material-symbols:file-present-outline'
              style={{ color: 'rgba(76, 78, 100, 0.54)' }}
              fontSize={24}
            />
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Tooltip title={file.name}>
              <FileName variant='body1'>{file.name}</FileName>
            </Tooltip>

            <Typography variant='caption' lineHeight={'14px'}>
              {formatFileSize(file.size)}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={() => onFileDelete(file)}>
          <Icon icon='material-symbols:close' fontSize={24} />
        </IconButton>
      </FileBox>
    </Box>
  ))

  const savedFileList = savedFiles?.map((file: DeliveryFileType) => (
    <Box key={uuidv4()} mt={4}>
      <FileBox>
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
              <FileName variant='body1'>{file.fileName}</FileName>
            </Tooltip>

            <Typography variant='caption' lineHeight={'14px'}>
              {formatFileSize(file.fileSize)}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={() => downloadOneFile(file)}
          disabled={isFileUploading}
        >
          <Icon icon='mdi:download' fontSize={24} />
        </IconButton>
      </FileBox>
      <Typography
        variant='body2'
        fontSize={14}
        fontWeight={400}
        sx={{ mb: '5px' }}
      >
        {FullDateTimezoneHelper(file.createdAt, user?.timezone)}
      </Typography>
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
        taxInvoiceIssued: invoiceInfo.taxInvoiceIssued,
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

  const cancelMutation = useMutation(
    (info: CancelReasonType) => cancelInvoice(invoiceInfo.id!, info),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: 'invoiceReceivableDetail',
        })
      },
      onError: () => onError(),
    },
  )

  const onCancelClick = () => {
    openModal({
      type: 'cancelReason',
      children: (
        <CancelRequestModal
          onClose={() => closeModal('cancelReason')}
          onClick={data => {
            closeModal('cancelReason')
            cancelMutation.mutate(data)
          }}
        />
      ),
    })
  }

  const makeInvoiceMarked = useMutation(
    (info: MarkDayInfo) => markInvoiceAsPaid(invoiceInfo.id!, info),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: 'invoiceReceivableDetail',
        })
      },
      onError: () => onError(),
    },
  )

  const onMarkAsPaidClick = () => {
    openModal({
      type: 'markAsPaid',
      children: (
        <CustomModal
          onClose={() => closeModal('markAsPaid')}
          onClick={() => {
            closeModal('markAsPaid')
            makeInvoiceMarked.mutate({
              paidAt: Date(),
              paidDateTimezone: user?.timezone!,
            })
          }}
          title='Are you sure you want to mark this invoice as paid?'
          vary='successful'
          rightButtonText='Mark as paid'
        />
      ),
    })
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {isFileUploading ? null : (
        <>
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
                    client={client}
                    invoiceInfo={invoiceInfo}
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
                    <Typography variant='h6'>
                      An Unexpected Proposal 1-10
                    </Typography>
                    {type === 'detail' &&
                    isUpdatable &&
                    currentRole &&
                    isInvoiceInfoUpdatable &&
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
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '20px',
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
                          ) : (currentRole && currentRole.name === 'CLIENT') ||
                            [30900, 301000, 301100, 301200].includes(
                              invoiceInfo.invoiceStatus,
                            ) ? (
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
                                      onClickReason(
                                        'Canceled',
                                        invoiceInfo.reason,
                                      )
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
                              {statusOption.map(status => {
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
                                    .filter(
                                      value => value.id === contactPersonId,
                                    )
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
                        <Box
                          sx={{ display: 'flex', flex: 1, alignItems: 'start' }}
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
                                  <ServiceTypeChip
                                    label={value}
                                    key={uuidv4()}
                                  />
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
                                  <Typography
                                    key={uuidv4()}
                                    variant='subtitle2'
                                  >
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
                                {invoiceInfo.isTaxable
                                  ? 'Taxable'
                                  : 'Non-taxable'}
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
                        <Box display='flex' justifyContent='space-between'>
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
                          <Box display='flex' width={380} alignItems='center'>
                            <Checkbox
                              value={invoiceInfo.showDescription}
                              onChange={handelChangeShowDescription}
                              checked={invoiceInfo.showDescription}
                              disabled={[30900, 301200].includes(
                                invoiceInfo.invoiceStatus,
                              )}
                            />

                            <Typography variant='body2' display='block'>
                              Show invoice description to client
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            display: 'flex',
                            gap: '8px',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant='subtitle2'>
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
                            disabled={[30900, 301200].includes(
                              invoiceInfo.invoiceStatus,
                            )}
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
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '36px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Typography variant='h6'>Accounting info</Typography>
                      {type === 'detail' && isAccountInfoUpdatable ? (
                        <IconButton onClick={() => setAccountingEdit!(true)}>
                          <Icon icon='mdi:pencil-outline' />
                        </IconButton>
                      ) : null}
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '20px',
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

                        <Typography variant='body2'>
                          Tax invoice issued
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Card>
              )}
            </Box>
          )}
        </>
      )}
      {/* TODO: currentRole &&
          currentRole.name === 'CLIENT' && 이 조건을 뺐는데 괜찮은지 렐 문의하기 */}
      {type !== 'history' ? (
        <Grid container spacing={6}>
          <Grid item xs={isFileUploading ? 9 : 12}>
            <Card sx={{ padding: '24px' }}>
              <Grid item xs={12}>
                <Box display='flex' gap='20px' alignItems='center'>
                  <Box display='flex' flexDirection='column'>
                    <Typography variant='h6'>Tax invoice</Typography>
                    <Typography variant='caption'>
                      {formatFileSize(fileSize).toLowerCase()}/ 50mb
                    </Typography>
                  </Box>
                  {isUpdatable ? (
                    <div {...getRootProps({ className: 'dropzone' })}>
                      <Button
                        variant='contained'
                        size='small'
                        fullWidth
                        disabled={invoiceInfo.clientConfirmedAt === null}
                      >
                        <input {...getInputProps()} />
                        Upload
                      </Button>
                    </div>
                  ) : null}

                  {isFileUploading ? null : (
                    <Box sx={{ display: 'flex', gap: '16px' }}>
                      <Button
                        variant='outlined'
                        disabled={savedFiles.length < 1}
                        sx={{
                          height: '34px',
                        }}
                        startIcon={<Icon icon='mdi:download' fontSize={18} />}
                        onClick={() => downloadAllFiles(savedFiles)}
                      >
                        Download all
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
              {savedFiles.length ? (
                <>
                  <Grid item xs={12}>
                    <Box
                      display='grid'
                      gridTemplateColumns='repeat(3,1fr)'
                      gap='16px'
                    >
                      {savedFileList}
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                </>
              ) : isFileUploading ? null : (
                '-'
              )}

              <Grid item xs={12} mt={4}>
                {files.length ? (
                  <Box
                    display='grid'
                    gridTemplateColumns='repeat(3,1fr)'
                    gap='16px'
                  >
                    {uploadedFileList}
                  </Box>
                ) : null}
              </Grid>
            </Card>
          </Grid>
          {isFileUploading ? (
            <Grid item xs={3}>
              <Card sx={{ padding: '24px' }}>
                <Button
                  variant='contained'
                  color='success'
                  fullWidth
                  disabled={!files.length}
                  startIcon={<Icon icon='ic:outline-send' />}
                  onClick={onDeliverTaxInvoice}
                >
                  Deliver to client
                </Button>
                <Button
                  variant='outlined'
                  fullWidth
                  sx={{ mt: 4 }}
                  onClick={onCancelFileUpload}
                >
                  Cancel
                </Button>
              </Card>
            </Grid>
          ) : null}
        </Grid>
      ) : null}

      {edit || isFileUploading || type === 'history' ? null : (
        <Grid xs={12} container spacing={6}>
          {currentRole && currentRole.name === 'CLIENT' ? null : (
            <Grid item xs={4}>
              <Card sx={{ padding: '20px', width: '100%' }}>
                <Button
                  variant='outlined'
                  fullWidth
                  color='error'
                  size='large'
                  disabled={
                    !isDeletable ||
                    ![30000, 30100, 30200].includes(invoiceInfo.invoiceStatus)
                  }
                  onClick={onClickDelete}
                >
                  Delete this invoice
                </Button>
              </Card>
            </Grid>
          )}
          <Grid item xs={4}>
            <Card sx={{ padding: '20px', width: '100%' }}>
              <Button
                variant='outlined'
                fullWidth
                color='error'
                size='large'
                disabled={
                  !isDeletable ||
                  /* TODO: 조건수정하기*/
                  ![30900, 301200].includes(invoiceInfo.invoiceStatus)
                }
                onClick={onCancelClick}
              >
                Cancel this invoice
              </Button>
            </Card>
          </Grid>
          <Grid item xs={4}>
            <Card sx={{ padding: '20px', width: '100%' }}>
              <Button
                variant='contained'
                fullWidth
                color='success'
                size='large'
                disabled={
                  !isUpdatable ||
                  ![30700, 30800, 301000, 301100].includes(
                    invoiceInfo.invoiceStatus,
                  )
                }
                onClick={onMarkAsPaidClick}
              >
                Mark as paid
              </Button>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default InvoiceInfo

const FileBox = styled(Box)`
  display: flex;
  margin-bottom: 8px;
  width: 100%;
  justify-content: space-between;
  border-radius: 8px;
  padding: 10px 12px;
  border: 1px solid rgba(76, 78, 100, 0.22);
  background: #f9f8f9;
`

const FileName = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
`
