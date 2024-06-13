import { Icon } from '@iconify/react'
import { Box, Card, IconButton, Typography } from '@mui/material'
import CustomModalV2 from '@src/@core/components/common-modal/custom-modal-v2'
import useModal from '@src/hooks/useModal'
import { v4 as uuidv4 } from 'uuid'

type Props = {
  history: Array<{ client: string; id: number }>
}

const ProClientsHistory = ({ history }: Props) => {
  const { openModal, closeModal } = useModal()

  const onClickHelpIcon = () => {
    openModal({
      type: 'InformationModal',
      children: (
        <CustomModalV2
          title='Client history'
          subtitle='Client history shows every client that the Pro has worked with. It includes only those jobs with Approved, Invoiced, Paid, and Without invoice statuses.'
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
          <Typography variant='h6'>Client history</Typography>
          <IconButton
            sx={{ padding: 0, width: '20px', height: '20px' }}
            onClick={onClickHelpIcon}
          >
            <Icon icon='mdi:alert-circle-outline' fontSize={20} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ width: '100%', display: 'flex', flexWrap: 'wrap' }}>
        {history.length > 0 ? (
          history.map((value, index) => (
            <Typography
              fontSize={16}
              fontWeight={500}
              key={uuidv4()}
              // component={'span'}
            >
              {value.client}
              {index === history.length - 1 ? '' : ', '}&nbsp;
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

export default ProClientsHistory
