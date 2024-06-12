import { Icon } from '@iconify/react'
import { Box, Card, Typography, IconButton } from '@mui/material'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  secondaryLanguages: string[]
  onClickEditSecondaryLanguages: () => void
}
const SecondaryLanguages = ({
  secondaryLanguages,
  onClickEditSecondaryLanguages,
}: Props) => {
  return (
    <Card sx={{ padding: '20px', minHeight: '154px', height: '100%' }}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        paddingBottom='24px'
      >
        <Typography variant='h6'>Secondary languages</Typography>
        <IconButton onClick={onClickEditSecondaryLanguages}>
          <Icon icon='mdi:pencil-outline' />
        </IconButton>
      </Box>

      <Box sx={{ width: '100%', display: 'flex', gap: '4px' }}>
        {secondaryLanguages.map((value, index) => (
          <Typography fontSize={16} fontWeight={600} key={uuidv4()}>
            {value}
            {index === secondaryLanguages.length - 1 ? '' : ', '}
          </Typography>
        ))}
      </Box>
    </Card>
  )
}

export default SecondaryLanguages
