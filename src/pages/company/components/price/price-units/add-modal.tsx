import { Box, Button, Typography } from '@mui/material'
import AlertIcon from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/@core/components/modal'
import styled from 'styled-components'

type Props = {
  title: string
  onAdd: () => void
  onClose: () => void
}
export default function AddModal({ title, onAdd, onClose }: Props) {
  return (
    <SmallModalContainer>
      <AlertIcon type='successful' />
      <Typography variant='body1' textAlign='center' mt='10px'>
        Are you sure you want to add this price unit?
      </Typography>
      <Title variant='body1' textAlign='center' fontWeight='bold'>
        {title}
      </Title>
      <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
        <Button variant='outlined' onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant='contained'
          onClick={() => {
            onAdd()
            onClose()
          }}
        >
          Add
        </Button>
      </Box>
    </SmallModalContainer>
  )
}

const Title = styled(Typography)`
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`
