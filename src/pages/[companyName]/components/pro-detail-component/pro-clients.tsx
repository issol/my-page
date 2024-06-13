import { Icon } from '@iconify/react'
import { Box, Card, IconButton, Typography } from '@mui/material'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import useModal from '@src/hooks/useModal'

import { v4 as uuidv4 } from 'uuid'

type Props = {
  onClickEditClients: () => void
  clients: Array<{ label: string; value: number }>
}

const PrpClients = ({ onClickEditClients, clients }: Props) => {
  const { openModal, closeModal } = useModal()

  const onClickHelpIcon = () => {
    openModal({
      type: 'InformationModal',
      children: (
        <CustomModalV2
          title='Clients'
          subtitle='The information will not be revealed to the registered clients.'
          onClose={() => closeModal('InformationModal')}
          onClick={() => closeModal('InformationModal')}
          noButton
          closeButton
          rightButtonText=''
          vary='info'
        />
      ),
    })
  }

  return (
    <Card sx={{ padding: '20px', minHeight: '154px', height: '100%' }}>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        paddingBottom='24px'
      >
        <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <Typography variant='h6'>Clients</Typography>
          <IconButton
            sx={{ padding: 0, width: '20px', height: '20px' }}
            onClick={onClickHelpIcon}
          >
            <Icon icon='mdi:alert-circle-outline' fontSize={20} />
          </IconButton>
        </Box>

        <IconButton sx={{ padding: 0 }} onClick={onClickEditClients}>
          <Icon icon='mdi:pencil-outline' />
        </IconButton>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
        {clients.length > 0 ? (
          clients.map((value, index) => (
            <Typography
              fontSize={16}
              fontWeight={500}
              key={uuidv4()}
              // component={'span'}
            >
              {value.label}
              {index === clients.length - 1 ? '' : ', '}&nbsp;
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

export default PrpClients
