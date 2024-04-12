import { Icon } from '@iconify/react'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Divider,
  IconButton,
  Popover,
  TextField,
  Typography,
} from '@mui/material'
import { assignmentStatusChip } from '@src/@core/components/chips/chips'

import { useGetStatusList } from '@src/queries/common.query'
import { useGetMessage } from '@src/queries/order/job.query'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { JobRequestsProType } from '@src/types/jobs/jobs.type'
import Image from 'next/image'
import { ChangeEvent, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import CustomChip from '@src/@core/components/mui/chip'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { authState } from '@src/states/auth'
import { convertTimeToTimezone } from '@src/shared/helpers/date.helper'
import { useMutation } from 'react-query'
import { sendMessageToPro } from '@src/apis/jobs/job-detail.api'

type Props = {
  jobId: number
  info: {
    userId: number
    firstName: string
    middleName: string | null
    lastName: string
  }
  messageType: 'request' | 'job' | 'all'
  onClose: () => void
}

const Message = ({ jobId, info, messageType, onClose }: Props) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)
  const [message, setMessage] = useState<string>('')
  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  console.log("jobId, info.userId",jobId, info.userId)
  const {
    data: messageList,
    isLoading: messageListLoading,
    refetch: messageRefetch,
  } = useGetMessage(jobId, info.userId, messageType)

  const { data: jobAssignmentStatusList } = useGetStatusList('JobAssignment')

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

  const handleSendMessage = () => {
    sendMessageToProMutation.mutate({
      jobId: jobId,
      proId: info.userId,
      message: message,
    })
  }

  useEffect(() => {
    messageRefetch()
  }, [messageRefetch])

  return (
    <Box
      sx={{
        maxWidth: '483px',
        maxHeight: '80vh', // Limit maxHeight to 80% of the screen size
        width: '100%',
        background: '#ffffff',
        boxShadow: '0px 0px 20px rgba(76, 78, 100, 0.4)',
        borderRadius: '10px',
      }}
    >
      <Box
        sx={{
          padding: '32px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E5E4E4',
        }}
      >
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Image
            src='/images/icons/order-icons/message.svg'
            width={50}
            height={50}
            alt=''
            quality={100}
          />
          <Typography fontSize={20} fontWeight={500}>
            {getLegalName({
              firstName: info.firstName,
              middleName: info.middleName,
              lastName: info.lastName,
            })}
          </Typography>
          {assignmentStatusChip(70000, jobAssignmentStatusList!)}
        </Box>
        <IconButton
          sx={{ padding: 0, height: 'fit-content' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton>
      </Box>
      <Box
        sx={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E5E4E4',
          alignItems: 'center',
        }}
      >
        <Typography fontSize={14} fontWeight={400} color='#8D8E9A'>
          Members
        </Typography>
        <Box>
          <AvatarGroup
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            {messageList &&
              messageList.members.map((i, index) => {
                if (index > 1) return null
                return (
                  <Avatar
                    key={uuidv4()}
                    sx={{
                      width: 32,
                      height: 32,
                      fontSize: 14,
                      border: `1px solid ${index === 0 ? '#FFA6A4' : '#B9F094'} !important`,
                      background: '#FFF',
                    }}
                  >
                    {i.firstName?.charAt(0) + i.lastName?.charAt(0)}
                  </Avatar>
                )
              })}
          </AvatarGroup>
          <Popover
            id='mouse-over-popover'
            sx={{
              pointerEvents: 'none',
            }}
            open={open}
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            onClose={handlePopoverClose}
            disableRestoreFocus
          >
            <Box
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
              >
                <CustomChip
                  label={'LPM'}
                  skin='light'
                  sx={{
                    background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #21AEDB`,
                    color: '#21AEDB',
                    maxWidth: 48,
                  }}
                  size='small'
                />
                <Typography fontSize={14} fontWeight={600} color='#666CFF'>
                  {getLegalName({
                    firstName: messageList?.members?.find(
                      value => value.role === 'lpm',
                    )?.firstName,
                    middleName: messageList?.members?.find(
                      value => value.role === 'lpm',
                    )?.middleName,
                    lastName: messageList?.members?.find(
                      value => value.role === 'lpm',
                    )?.lastName,
                  })}
                  (Me)
                </Typography>
              </Box>
              <Typography fontWeight={600} fontSize={14}>
                {getLegalName({
                  firstName: messageList?.members?.find(
                    value => value.role === 'pro',
                  )?.firstName,
                  middleName: messageList?.members?.find(
                    value => value.role === 'pro',
                  )?.middleName,
                  lastName: messageList?.members?.find(
                    value => value.role === 'pro',
                  )?.lastName,
                })}
              </Typography>
            </Box>
          </Popover>
        </Box>
      </Box>
      {messageList &&
      messageList.contents &&
      messageList.contents.length > 0 ? (
        <>
          {messageList.contents.map((item, index) => (
            <Box
              key={uuidv4()}
              sx={{
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {!item.isPro ? (
                    <CustomChip
                      label={'LPM'}
                      skin='light'
                      sx={{
                        background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #21AEDB`,
                        color: '#21AEDB',
                        maxWidth: 48,
                      }}
                      size='small'
                    />
                  ) : null}
                  <Typography
                    fontWeight={600}
                    fontSize={14}
                    color={!item.isPro ? '#666CFF' : 'rgba(76, 78, 100, 0.87)'}
                  >
                    {getLegalName({
                      firstName: item.firstName,
                      middleName: item.middleName,
                      lastName: item.lastName,
                    })}
                    {!item.isPro ? '(Me)' : ''}
                  </Typography>
                  <Divider orientation='vertical' variant='middle' flexItem />
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                    color='rgba(76, 78, 100, 0.60)'
                  >
                    {item.email}
                  </Typography>
                </Box>
                <Typography fontSize={12} fontWeight={400} color='#4C4E6499'>
                  {convertTimeToTimezone(
                    item.createdAt,
                    auth.getValue()?.user?.timezone,
                    timezone.getValue(),
                  )}
                </Typography>
              </Box>
              <Typography fontSize={14} fontWeight={400}>
                {item.content}
              </Typography>
            </Box>
          ))}
        </>
      ) : null}
      <Box sx={{ padding: '20px' }}>
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
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '32px 20px',
        }}
      >
        <Button
          variant='contained'
          disabled={message === ''}
          onClick={handleSendMessage}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}

export default Message
