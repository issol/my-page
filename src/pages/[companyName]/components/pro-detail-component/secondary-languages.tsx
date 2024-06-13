import { Icon } from '@iconify/react'
import { Box, Card, Typography, IconButton } from '@mui/material'
import languageHelper from '@src/shared/helpers/language.helper'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  secondaryLanguages: string[]
  onClickEditSecondaryLanguages?: () => void
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
        {onClickEditSecondaryLanguages ? (
          <IconButton
            onClick={() => {
              onClickEditSecondaryLanguages && onClickEditSecondaryLanguages()
            }}
          >
            <Icon icon='mdi:pencil-outline' />
          </IconButton>
        ) : null}
      </Box>

      <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
        {secondaryLanguages.length > 0 ? (
          secondaryLanguages.map((value, index) => (
            <Typography
              fontSize={16}
              fontWeight={600}
              key={uuidv4()}
              // component={'span'}
            >
              {languageHelper(value)}
              {index === secondaryLanguages.length - 1 ? '' : ', '}&nbsp;
            </Typography>
          ))
        ) : (
          <Typography fontSize={16} fontWeight={600}>
            -
          </Typography>
        )}
      </Box>
    </Card>
  )
}

export default SecondaryLanguages
