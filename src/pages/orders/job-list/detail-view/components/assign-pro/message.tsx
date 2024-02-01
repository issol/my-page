import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from '@mui/material'
import useModal from '@src/hooks/useModal'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { AssignProListType } from '@src/types/orders/job-detail'
import JobInfoDetailView from '../..'
import { assignmentStatusChip } from '@src/@core/components/chips/chips'
import { ChangeEvent, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CustomChip from '@src/@core/components/mui/chip'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { UserDataType } from '@src/context/types'
import { JobItemType, JobType } from '@src/types/common/item.type'
import { ProjectInfoType } from '@src/types/orders/order-detail'
import {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
  useMutation,
} from 'react-query'
import { useGetMessage } from '@src/queries/order/job.query'
import { readMessage, sendMessageToPro } from '@src/apis/job-detail.api'
import { useEffect } from 'react'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  info: AssignProListType
  user: UserDataType
  row: JobType
  orderDetail: ProjectInfoType
  item: JobItemType
  refetch: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined,
  ) => Promise<
    QueryObserverResult<
      {
        id: number
        cooperationId: string
        items: JobItemType[]
      },
      unknown
    >
  >
  statusList: Array<{ value: number; label: string }>
}

const Message = ({
  info,
  user,
  row,
  orderDetail,
  item,
  refetch,
  statusList,
}: Props) => {
  const { openModal, closeModal } = useModal()
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [message, setMessage] = useState<string>('')
  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }
  const {
    data: messageList,
    isLoading: messageListLoading,
    refetch: messageRefetch,
  } = useGetMessage(row.id, info.userId)

  const sendMessageToProMutation = useMutation(
    (data: { jobId: number; proId: number; message: string }) =>
      sendMessageToPro(data.jobId, data.proId, data.message),
    {
      onSuccess: () => {
        messageRefetch()
        setMessage('')
      },
    },
  )

  const readMessageMutation = useMutation(
    (data: { jobId: number; proId: number }) =>
      readMessage(data.jobId, data.proId),
    {
      onSuccess: () => {
        messageRefetch()
      },
    },
  )

  const handleSendMessage = () => {
    sendMessageToProMutation.mutate({
      jobId: row.id,
      proId: info.userId,
      message: message,
    })
  }

  const scrollToBottom = () => {
    const box = document.getElementById('message-box')
    if (box) {
      box.scrollTop = box.scrollHeight
    }
  }

  useEffect(() => {
    messageRefetch()
  }, [messageRefetch])

  useEffect(() => {
    if (messageList && !messageListLoading) {
      readMessageMutation.mutate({
        jobId: row.id,
        proId: info.userId,
      })
      scrollToBottom()
    }
  }, [messageList, messageListLoading])

  return (
    <Box sx={{ padding: '50px 60px', position: 'relative' }}>
      {sendMessageToProMutation.isLoading ? <OverlaySpinner /> : null}
      <IconButton
        sx={{ position: 'absolute', top: '20px', right: '20px' }}
        onClick={() => {
          closeModal('AssignProMessageModal')
          // closeModal('JobDetailViewModal')
          openModal({
            type: 'JobDetailViewModal',
            children: (
              <Box
                sx={{
                  maxWidth: '1180px',
                  width: '100%',
                  maxHeight: '90vh',
                  background: '#ffffff',
                  boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
                  borderRadius: '10px',
                }}
              >
                <JobInfoDetailView
                  tab={'assignPro'}
                  row={row}
                  orderDetail={orderDetail}
                  item={item}
                  refetch={refetch}
                />
              </Box>
            ),
          })
        }}
      >
        <Icon icon='mdi:close'></Icon>
      </IconButton>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            gap: '8px',
            alignItems: 'center',
          }}
        >
          <IconButton
            sx={{ padding: '0 !important', height: '24px' }}
            onClick={() => {
              closeModal('AssignProMessageModal')
              openModal({
                type: 'JobDetailViewModal',
                children: (
                  <Box
                    sx={{
                      maxWidth: '1180px',
                      width: '100%',
                      maxHeight: '90vh',
                      background: '#ffffff',
                      boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
                      borderRadius: '10px',
                      overflow: 'scroll',
                      '&::-webkit-scrollbar': {
                        display: 'none',
                      },
                    }}
                  >
                    <JobInfoDetailView
                      tab={'assignPro'}
                      row={row}
                      orderDetail={orderDetail}
                      item={item}
                      refetch={refetch}
                    />
                  </Box>
                ),
              })
            }}
          >
            <Icon icon='mdi:chevron-left' width={24} height={24} />
          </IconButton>
          <img src='/images/icons/order-icons/message.svg' alt='' />
          <Typography variant='h5'>
            {getLegalName({
              firstName: info.firstName,
              middleName: info.middleName,
              lastName: info.lastName,
            })}
          </Typography>
          {/* <AssignmentStatusChip
            label={info.assignmentStatus}
            status={info.assignmentStatus!}
          /> */}
          {assignmentStatusChip(Number(info.assignmentStatus), statusList!)}
        </Box>
        <Divider />
        <Box
          id='message-box'
          sx={{
            maxHeight: '500px',
            overflowY: 'scroll',
          }}
        >
          {messageList?.contents &&
            messageList?.contents.map((item, index) => (
              <>
                <Box
                  key={uuidv4()}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    paddingTop: '20px',
                    paddingBottom: '20px',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    {item.isPro ? (
                      <CustomChip
                        label={'Pro'}
                        skin='light'
                        sx={{
                          background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128`,
                          color: '#72E128',
                        }}
                        size='small'
                      />
                    ) : null}
                    <Typography
                      variant='subtitle1'
                      fontWeight={500}
                      color={user.email === item.email ? 'primary' : 'default'}
                    >
                      {getLegalName({
                        firstName: item.firstName,
                        middleName: item.middleName,
                        lastName: item.lastName,
                      })}
                    </Typography>
                    <Divider orientation='vertical' variant='middle' flexItem />
                    <Typography variant='body2' fontWeight={400}>
                      {item.email}
                    </Typography>
                  </Box>
                  <Typography variant='subtitle2'>
                    {convertTimeToTimezone(
                      item.createdAt,
                      user.timezone,
                      timezone.getValue(),
                    )}
                  </Typography>
                  <Box>{item.content}</Box>
                </Box>
                <Divider />
              </>
            ))}
        </Box>
        <Box>
          <TextField
            rows={4}
            multiline
            autoComplete='off'
            fullWidth
            // label='Write down a message to Pro'
            placeholder='Write down a message to Pro'
            value={message ?? ''}
            onChange={handleChangeMessage}
            inputProps={{ maxLength: 500 }}
          />
          <Typography variant='body2' mt='12px' textAlign='right'>
            {message?.length ?? 0}/500
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '9px' }}>
          <Button
            variant='contained'
            disabled={message === ''}
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Message
