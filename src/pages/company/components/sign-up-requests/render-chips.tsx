import CustomChip from 'src/@core/components/mui/chip'

import { v4 as uuidv4 } from 'uuid'

import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

type Props = {
  user: {
    id: number
    roles: string[]
  }
  handleDeleteRole: (
    role: string,
    user: {
      id: number
      roles: string[]
    },
  ) => void
  handleAddRole: (
    role: string,
    user: {
      id: number
      roles: string[]
    },
  ) => void
}

const RenderRoleChips = ({ user, handleDeleteRole, handleAddRole }: Props) => {
  const chips = user.roles.map((value: any) => {
    if (user.roles.length === 1) {
      return (
        <>
          <CustomChip
            key={uuidv4()}
            skin='light'
            size='small'
            // onDelete={() => handleDeleteRole(value, user)}
            label={value}
            color={
              value.includes('TAD')
                ? 'error'
                : value.includes('LPM')
                ? 'primary'
                : 'primary'
            }
            sx={{
              textTransform: 'capitalize',
              '& .MuiChip-label': { lineHeight: '18px' },
              mr: 1,
            }}
          />
          <CustomChip
            color={
              value.includes('TAD')
                ? 'primary'
                : value.includes('LPM')
                ? 'error'
                : 'primary'
            }
            onClick={() => handleAddRole(value, user)}
            aria-label='add'
            size='small'
            skin='light'
            clickable
            // sx={{ width: '20px', height: '20px' }}
            sx={{
              fontSize: '18px',
              color: '#6D788D',
              '&&:hover': {
                backgroundColor: value.includes('TAD')
                  ? hexToRGBA('#666CFF', 0.5)
                  : hexToRGBA('#FF4D49', 0.5),
              },
            }}
            label='+'
          />
        </>
      )
    } else {
      return (
        <CustomChip
          key={uuidv4()}
          skin='light'
          size='small'
          onDelete={() => handleDeleteRole(value, user)}
          label={value}
          color={
            value.includes('TAD')
              ? 'error'
              : value.includes('LPM')
              ? 'primary'
              : 'primary'
          }
          sx={{
            textTransform: 'capitalize',
            '& .MuiChip-label': { lineHeight: '18px' },
            mr: 1,
          }}
        />
      )
    }
  })

  return <>{chips}</>
}

export default RenderRoleChips
