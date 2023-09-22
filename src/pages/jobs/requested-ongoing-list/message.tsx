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
import { FullDateTimezoneHelper } from '@src/shared/helpers/date.helper'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { authState } from '@src/states/auth'
import { useRecoilValueLoadable } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import CustomChip from 'src/@core/components/mui/chip'
import { ChangeEvent, useState } from 'react'
import { ProJobListType } from '@src/types/jobs/jobs.type'

type Props = {
  row: ProJobListType
}

const ProJobsMessage = ({ row }: Props) => {
  const { openModal, closeModal } = useModal()
  const auth = useRecoilValueLoadable(authState)
  const [message, setMessage] = useState<string>('')
  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  console.log(row)

  const messageList = {
    unReadCount: 1,
    contents: [
      {
        id: 1,
        content: 'message1',
        createdAt: '2023-08-31T14:13:15Z',
        firstName: 'John',
        middleName: null,
        lastName: 'Doe',
        email: 'john.doe@example.com',
        role: 'role1',
      },
    ],
  }

  return (
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
          {messageList?.contents &&
            messageList?.contents.map((item, index) => (
              <>
                <Box
                  key={uuidv4()}
                  sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <Box
                    sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                  >
                    {item.role === 'LPM' ? (
                      <CustomChip
                        label={item.role}
                        skin='light'
                        sx={{
                          background: `linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #72E128`,
                          color: '#72E128',
                        }}
                        size='small'
                      />
                    ) : null}
                    <Typography variant='subtitle1' fontWeight={500}>
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
                    {FullDateTimezoneHelper(
                      item.createdAt,
                      auth.getValue().user?.timezone,
                    )}
                  </Typography>
                  <Box>{item.content}</Box>
                </Box>
                {index !== messageList.contents.length - 1 && <Divider />}
              </>
            ))}
          {row.status === 601200 ||
          row.status === 601400 ||
          row.status === 60300 ||
          row.status === 60600 ||
          row.status === 60400 ? null : (
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
                  // onClick={handleSendMessage}
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
