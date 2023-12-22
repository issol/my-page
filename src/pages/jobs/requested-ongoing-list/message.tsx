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
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { authState } from '@src/states/auth'
import { useRecoilValueLoadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import CustomChip from 'src/@core/components/mui/chip'
import { ChangeEvent, useEffect, useState } from 'react'
import { ProJobListType } from '@src/types/jobs/jobs.type'
import { useQueryClient, useMutation } from 'react-query'
import { readMessage, sendMessageToPro } from '@src/apis/job-detail.api'
import { useGetMessage } from '@src/queries/order/job.query'
import OverlaySpinner from '@src/@core/components/spinner/overlay-spinner'
import { timezoneSelector } from '@src/states/permission'

type Props = {
  row: ProJobListType
}

const ProJobsMessage = ({ row }: Props) => {
  const queryClient = useQueryClient()
  const { openModal, closeModal } = useModal()
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [message, setMessage] = useState<string>('')
  const [isScrollToBottomRunning, setIsScrollToBottomRunning] =
    useState<boolean>(false)
  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const {
    data: messageList,
    isLoading: messageListLoading,
    refetch: messageRefetch,
  } = useGetMessage(row.jobId, auth.getValue()?.user?.id!)

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
        queryClient.invalidateQueries(['proJobList'])
      },
    },
  )

  const handleSendMessage = () => {
    sendMessageToProMutation.mutate({
      jobId: row.jobId,
      proId: auth.getValue()?.user?.id!,
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
        jobId: row.jobId,
        proId: auth.getValue()?.user?.id!,
      })
      scrollToBottom()
    }
  }, [messageList, messageListLoading])

  return (
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
      {sendMessageToProMutation.isLoading ? <OverlaySpinner /> : null}
      <Box sx={{ padding: '50px 60px', position: 'relative' }}>
        <IconButton
          sx={{ position: 'absolute', top: '20px', right: '20px' }}
          onClick={() => {
            closeModal('ProJobsMessageModal')
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
            <img src='/images/icons/order-icons/message.svg' alt='' />
            <Typography variant='h5'>Message from LPM</Typography>
          </Box>
          <Divider />
          <Box
            id='message-box'
            sx={{
              maxHeight: '500px',
              overflowY: 'scroll',
            }}
          >
            {messageList?.contents && messageList.contents.length > 0
              ? messageList?.contents.map((item, index) => (
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
                        sx={{
                          display: 'flex',
                          gap: '8px',
                          alignItems: 'center',
                        }}
                      >
                        {!item.isPro ? (
                          <CustomChip
                            label={'LPM'}
                            skin='light'
                            sx={{
                              background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #21AEDB`,
                              color: '#21AEDB',
                            }}
                            size='small'
                          />
                        ) : null}
                        <Typography
                          variant='subtitle1'
                          fontWeight={500}
                          color={
                            auth.getValue()?.user?.email === item.email
                              ? 'primary'
                              : 'default'
                          }
                        >
                          {getLegalName({
                            firstName: item.firstName,
                            middleName: item.middleName,
                            lastName: item.lastName,
                          })}
                        </Typography>
                        <Divider
                          orientation='vertical'
                          variant='middle'
                          flexItem
                        />
                        <Typography variant='body2' fontWeight={400}>
                          {item.email}
                        </Typography>
                      </Box>
                      <Typography variant='subtitle2'>
                        {convertTimeToTimezone(
                          item.createdAt,
                          auth.getValue().user?.timezone,
                          timezone.getValue(),
                        )}
                      </Typography>
                      <Box>{item.content}</Box>
                    </Box>
                    {index !== messageList.contents!.length - 1 && <Divider />}
                  </>
                ))
              : null}
          </Box>
          {row.status === 60700 ||
          row.status === 60800 ||
          row.status === 70200 ||
          row.status === 70400 ||
          row.status === 601000 ? (
            <Box>
              <Typography
                variant='body1'
                fontWeight={400}
                sx={{ padding: '0 20px 20px 20px' }}
              >
                There are no message
              </Typography>
              <Divider />
            </Box>
          ) : (
            <>
              <Box>
                <TextField
                  rows={4}
                  multiline
                  fullWidth
                  // label='Write down a message to Pro'
                  placeholder='Write down a message to LPM'
                  value={message ?? ''}
                  onChange={handleChangeMessage}
                  inputProps={{ maxLength: 500 }}
                />
                <Typography variant='body2' mt='12px' textAlign='right'>
                  {message?.length ?? 0}/500
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', justifyContent: 'flex-end', mt: '9px' }}
              >
                <Button
                  variant='contained'
                  disabled={message === ''}
                  onClick={handleSendMessage}
                >
                  Send
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ProJobsMessage
