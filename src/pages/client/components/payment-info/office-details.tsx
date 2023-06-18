import { useState } from 'react'

// ** style components
import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogContent,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material'

// ** components
import PaymentMethod from './payment-method'
import PaymentMethodForm from './payment-method-form'

// ** types
import {
  OfficeType,
  PaymentType,
} from '@src/types/payment-info/client/index.type'
import { PaymentMethodUnionType } from '@src/types/schema/payment-method'
import { OfficeTaxType } from '@src/types/schema/tax-info'

type Props = {
  clientId: number
}

/* TODO:
1. onSave함수에 mutation추가하기
2. payment-method-form에 form reset할 데이터 프롭으로 보내주기
3. office선택하는 dropdown에는 서버가 보내주는 리스트를 option값으로 주도록 변경하기
4. default로 선택되는 office값 설정해주기.
    - 하나의 office정보만 등록한 경우 해당 오피스가 기본으로 선택되어 있음
    - 여러개 등록되어 있는 경우 가장 최근에 수정된 오피스가 디폴트로 변경됨
*/

export default function OfficeDetails({ clientId }: Props) {
  const officeList: OfficeType[] = ['Japan', 'Korea', 'Singapore', 'US']
  const [office, setOffice] = useState<OfficeType>('Korea')

  const [editForm, setEditForm] = useState(false)

  function onSave(
    paymentMethod: PaymentType,
    office: OfficeType,
    paymentInfo: PaymentMethodUnionType,
    taxInfo: OfficeTaxType,
  ) {
    //TODO:
    //- 정보가 등록되어 있지 않은 경우 → 신규로 입력
    //- 등록되어 있는 경우 → 수정
  }

  return (
    <Card>
      <CardHeader
        title={
          <Box
            display='flex'
            alignItems='center'
            justifyContent='space-between'
          >
            <Box display='flex' alignItems='center' gap='16px'>
              <Typography variant='h6'>Office details</Typography>
              <FormControl sx={{ m: 1, minWidth: 80 }}>
                <InputLabel id='select office'>Office</InputLabel>
                <Select
                  labelId='select office'
                  value={office}
                  onChange={e => setOffice(e.target.value as OfficeType)}
                  autoWidth
                  label='Age'
                >
                  {officeList.map(i => (
                    <MenuItem value={i} key={i}>
                      {i}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <IconButton onClick={() => setEditForm(true)}>
              <Icon icon='mdi:pencil-outline' />
            </IconButton>
          </Box>
        }
      />
      <CardContent>
        <PaymentMethod office={office} />
      </CardContent>
      <Dialog open={editForm} maxWidth='md'>
        <DialogContent sx={{ padding: '50px' }}>
          <PaymentMethodForm
            office={office}
            open={editForm}
            onSave={onSave}
            onClose={() => setEditForm(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  )
}
