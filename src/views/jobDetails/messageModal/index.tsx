import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Popover,
  TextField,
  Typography,
} from '@mui/material'

import { useGetStatusList } from '@src/queries/common.query'
import { useGetMessage } from '@src/queries/order/job.query'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { ProJobListType } from '@src/types/jobs/jobs.type'
import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import CustomChip from '@src/@core/components/mui/chip'
import { useRecoilValueLoadable } from 'recoil'
import { timezoneSelector } from '@src/states/permission'
import { authState } from '@src/states/auth'
import { useMutation } from 'react-query'
import { Member, sendMessageToPro } from '@src/apis/jobs/job-detail.api'
import styled from '@emotion/styled'
import MessageItem from '@src/views/jobDetails/messageModal/messageItem'

interface MessageProps {
  jobId: number
  info: ProJobListType
  isPair?: boolean
  onClose: () => void
}

const Message = ({ jobId, info, isPair = false, onClose }: MessageProps) => {
  const MAX_AVATAR_COUNT = 3

  const auth = useRecoilValueLoadable(authState)
  const timezone = useRecoilValueLoadable(timezoneSelector)

  const [message, setMessage] = useState<string>('')
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const open = Boolean(anchorEl)

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePopoverClose = () => {
    setAnchorEl(null)
  }

  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const {
    data: messageList,
    isLoading: messageListLoading,
    refetch: messageRefetch,
  } = useGetMessage(jobId, auth.getValue().user?.userId || 0, 'all')

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
      proId: auth.getValue().user?.userId || 0,
      message: message,
    })
  }

  useEffect(() => {
    messageRefetch()
  }, [messageRefetch])

  const memberCount = useMemo(() => {
    if (!messageList?.members) return ''
    if (messageList?.members.length < MAX_AVATAR_COUNT) return ''
    if (messageList?.members.length > MAX_AVATAR_COUNT)
      return `+${messageList?.members.length - MAX_AVATAR_COUNT}`
    return ''
  }, [messageList?.members])

  const messageContentsList = useMemo(() => {
    if (!messageList) return []
    if (!messageList?.contents) return []
    return messageList.contents
  }, [messageList?.contents])

  const memberList = useMemo(() => {
    if (!messageList) return []
    if (!messageList?.members) return []
    return messageList.members
  }, [messageList?.members])

  const myIndex = useMemo(
    () =>
      memberList.findIndex(
        value => value.userId === auth.getValue().user?.userId,
      ),
    [memberList, auth],
  )

  return (
    <Card sx={{ maxWidth: 1080, maxHeight: '80%' }}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        padding='32px 20px'
      >
        <Box display='flex' alignItems='center' gap='8px'>
          <img src='/images/icons/order-icons/message.svg' alt='' />
          <Typography variant='h6'>{info.name}</Typography>
        </Box>
        <IconButton onClick={onClose}>
          <Icon icon='mdi:close'></Icon>
        </IconButton>
      </Box>

      <Divider sx={{ margin: '0 !important' }} />

      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        padding='20px'
      >
        <Typography variant='body2' color='#8D8E9A'>
          Members
        </Typography>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <CustomAvatarGroup
            onMouseEnter={handlePopoverOpen}
            onMouseLeave={handlePopoverClose}
          >
            {memberList.map((message, index) => {
              if (index > 1) return null
              return (
                <CustomAvatar key={`avatar-${index}`} index={index}>
                  {getAvatarName(`${message.firstName} ${message.lastName}`)}
                </CustomAvatar>
              )
            })}
            <Typography
              component='li'
              sx={{ marginLeft: '4px' }}
              color='rgba(141, 142, 154, 1)'
            >
              {memberCount}
            </Typography>
          </CustomAvatarGroup>
          <MemberPopover
            open={open}
            memberList={messageList?.members || []}
            anchorEl={anchorEl}
            handlePopoverClose={handlePopoverClose}
          />
        </Box>
      </Box>

      <Divider sx={{ margin: '0 !important' }} />

      <Box overflow='scroll'>
        {messageList?.contents?.map((item, index) => (
          <>
            <MessageItem key={`message-${index}`} />
            <Divider
              sx={{
                margin: '0 !important',
                display: index === 5 ? 'none' : 'block',
              }}
            />
          </>
        ))}
      </Box>

      <Divider sx={{ margin: '0 !important' }} />
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
    </Card>
  )
}

const getAvatarName = (name: string) => {
  return `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`.toUpperCase()
}

const CustomAvatarGroup = styled.ul(() => ({
  display: 'flex',
  alignItems: 'center',
  listStyle: 'none',
  padding: '0 !important',
  margin: '0 !important',
}))

const CustomAvatar = styled.li<{ index: number }>(({ index }) => {
  const borderColors = ['#FFA6A4', '#B9F094', '#FEDA94']
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: `1px solid ${borderColors[index]}`,
    background: '#fff',
    marginLeft: '-5px',
    fontSize: '14px',
    color: '#8D8E9A',
  }
})

interface MemberPopoverProps {
  open: boolean
  anchorEl: HTMLElement | null
  handlePopoverClose: () => void
  memberList: Array<Member>
}

const MemberPopover = ({
  open,
  anchorEl,
  memberList,
  handlePopoverClose,
}: MemberPopoverProps) => {
  const auth = useRecoilValueLoadable(authState)

  const myIndex = useMemo(
    () =>
      memberList.findIndex(
        value => value.userId === auth.getValue().user?.userId,
      ),
    [memberList, auth],
  )

  const sortMemberList = useMemo(() => {
    return memberList.sort((a, b) => {
      if (a.role === 'lpm') {
        return -1
      }

      if (b.role === 'lpm') {
        return 1
      }

      return 0
    })
  }, [memberList])

  return (
    <Popover
      id='mouse-over-popover'
      sx={{
        pointerEvents: 'none',
        top: '5px',
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
        display='flex'
        flexDirection='column'
        gap='20px'
        marginTop='5px'
        padding='20px'
      >
        {sortMemberList.map((member, index) => (
          <Box
            key={`${member.userId}-${index}`}
            sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}
          >
            <CustomChip
              label={member.role.toUpperCase()}
              skin='light'
              size='small'
              sx={{
                ...(member.role === 'lpm' ? lpmStyles : etcStyles),
                width: 'fit-content',
              }}
            />
            <Typography
              variant='body2'
              fontWeight={index === myIndex ? 500 : 600}
              color={
                index === myIndex
                  ? 'rgba(90, 95, 224, 1)'
                  : 'rgba(76, 78, 100, 1)'
              }
            >
              {getLegalName({
                firstName: member?.firstName,
                middleName: member?.middleName,
                lastName: member?.lastName,
              })}
              {index === myIndex ? ' (Me)' : ''}
            </Typography>
          </Box>
        ))}
      </Box>
    </Popover>
  )
}

export const lpmStyles = {
  background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #21AEDB`,
  color: '#21AEDB',
}

export const etcStyles = {
  background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88) 0%, rgba(255, 255, 255, 0.88) 100%), #666CFF`,
  color: '#111111DE',
  border: '1px solid rgba(102, 108, 255, 0.50)',
}

export default Message
