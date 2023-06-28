import CustomChip from 'src/@core/components/mui/chip'

import { v4 as uuidv4 } from 'uuid'

import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

type Props = {
  user: {
    id: number
    role: string[]
  }
  handleDeleteRole: (
    role: string,
    user: {
      id: number
      role: string[]
    },
  ) => void
  handleAddRole: (
    role: string,
    user: {
      id: number
      role: string[]
    },
  ) => void
  editRow: boolean
}

const RenderChips = ({
  user,
  handleDeleteRole,
  handleAddRole,
  editRow,
}: Props) => {
  const chips = user.role
    .filter(value => value === 'LPM' || value === 'TAD')
    .map((value: string, index: number) => {
      return (
        <>
          <CustomChip
            key={uuidv4()}
            skin='light'
            size='small'
            onDelete={
              editRow && user.role.length > 1
                ? () => handleDeleteRole(value, user)
                : undefined
            }
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
          {editRow && user.role.length === 1 && (
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
          )}
        </>
      )
    })

  return <>{chips}</>
}

export default RenderChips
