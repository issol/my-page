import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { v4 as uuidv4 } from 'uuid'
import { SignUpRequestsType } from './types'

type Props = {
  user: SignUpRequestsType
  handleRoleDelete: (role: string, user: SignUpRequestsType) => void
}
const RenderChips = ({ user, handleRoleDelete }: Props) => {
  const res = user.role.map((value: any, index: number) => {
    if (index < 2) {
      return (
        <CustomChip
          key={uuidv4()}
          skin='light'
          size='small'
          onDelete={() => handleRoleDelete(value, user)}
          label={value}
          color={
            value.includes('TAD')
              ? 'primary'
              : value.includes('LPM')
              ? 'error'
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

  return <>{res}</>
}

export default RenderChips
