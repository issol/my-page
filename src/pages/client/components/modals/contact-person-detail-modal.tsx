import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  CardHeader,
  Dialog,
  DialogContent,
  Divider,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { ModalContainer } from '@src/@core/components/modal'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import { getGmtTime } from '@src/shared/helpers/timezone.helper'
import { ContactPersonType } from '@src/types/schema/client-contact-person.schema'
import styled from 'styled-components'

type Props = {
  data: ContactPersonType
  onEdit: (data: ContactPersonType) => void
  onClose: () => void
}
export default function ContactPersonDetailModal({
  data,
  onEdit,
  onClose,
}: Props) {
  return (
    <Dialog open={true} maxWidth='lg' onClose={onClose}>
      <DialogContent>
        <CardHeader
          style={{ paddingLeft: 0 }}
          title={
            <Box
              display='flex'
              alignItems='center'
              justifyContent='space-between'
            >
              <Typography variant='h6'>
                [{data.personType}]{' '}
                {getLegalName({
                  firstName: data.firstName!,
                  middleName: data?.middleName,
                  lastName: data.lastName!,
                })}
              </Typography>
              <IconButton onClick={onClose}>
                <Icon icon='material-symbols:close' />
              </IconButton>
            </Box>
          }
        />
        <Divider style={{ marginBottom: '24px' }} />
        <Grid container spacing={6}>
          <Grid item xs={6}>
            <InfoContainer>
              <Label>Department</Label>
              <Typography variant='body2'>{data?.department ?? '-'}</Typography>
            </InfoContainer>
          </Grid>
          <Grid item xs={6}>
            <InfoContainer>
              <Label>Job title</Label>
              <Typography variant='body2'>{data?.jobTitle ?? '-'}</Typography>
            </InfoContainer>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={6}>
            <InfoContainer>
              <Label>Time zone</Label>
              <Typography variant='body2'>
                {data?.timezone?.code ? getGmtTime(data?.timezone.code) : '-'}
              </Typography>
            </InfoContainer>
          </Grid>
          <Grid item xs={6}>
            <InfoContainer>
              <Label>Telephone</Label>
              <Typography variant='body2'>
                {data?.phone
                  ? `+${data?.timezone?.phone})  ${data?.phone}`
                  : '-'}
              </Typography>
            </InfoContainer>
          </Grid>

          <Grid item xs={6}>
            <InfoContainer>
              <Label>Mobile phone</Label>
              <Typography variant='body2'>
                {data?.mobile
                  ? `+${data?.timezone?.phone})  ${data?.mobile}`
                  : '-'}
              </Typography>
            </InfoContainer>
          </Grid>
          <Grid item xs={6}>
            <InfoContainer>
              <Label>Fax</Label>
              <Typography variant='body2'>
                {data?.fax ? `+${data?.timezone?.phone})  ${data?.fax}` : '-'}
              </Typography>
            </InfoContainer>
          </Grid>
          <Grid item xs={6}>
            <InfoContainer>
              <Label>Email</Label>
              <Typography variant='body2'>{data.email ?? '-'}</Typography>
            </InfoContainer>
          </Grid>
          <Grid item xs={12}>
            <Divider style={{ marginTop: '24px' }} />
          </Grid>
          <Grid item xs={12}>
            <Label style={{ width: '300px', marginBottom: '12px' }}>
              Memo for contact person
            </Label>
            <Typography variant='body2'>{data.memo ?? '-'}</Typography>
          </Grid>
        </Grid>

        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button
            variant='outlined'
            color='secondary'
            onClick={() => onEdit(data)}
          >
            Edit
          </Button>
          <Button
            variant='contained'
            //   onClick={() => {
            //     onClick()
            //     onClose()
            //   }}
          >
            Delete
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

const Label = styled(Typography)`
  display: block;
  width: 200px;
  font-weight: bold;
  font-size: 1rem;
`
const InfoContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`