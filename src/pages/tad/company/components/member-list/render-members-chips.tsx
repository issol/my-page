import CustomChip from 'src/@core/components/mui/chip'
import Icon from 'src/@core/components/icon'
import { v4 as uuidv4 } from 'uuid'
import { MembersType, SignUpRequestsType } from 'src/types/company/members'
import Fab from '@mui/material/Fab'
import { hexToRGBA } from 'src/@core/utils/hex-to-rgba'

type Props = {
  member: MembersType
  // handleDeleteRole: (role: string, user: SignUpRequestsType) => void
  // handleAddRole: (role: string, user: SignUpRequestsType) => void
}

const RenderMembersChips = ({
  member,
}: // handleDeleteRole,
// handleAddRole,
Props) => {
  console.log(member)

  const chips = member.role.map((value: any) => {
    return (
      <CustomChip
        key={uuidv4()}
        skin='light'
        size='small'
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
  })

  return <>{chips}</>
}

export default RenderMembersChips
