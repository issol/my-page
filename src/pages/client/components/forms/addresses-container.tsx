// ** mui
import { Button, Divider, Grid } from '@mui/material'

// ** types
import { ClientAddressFormType } from '@src/types/schema/client-address.schema'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// ** react hook form
import {
  Control,
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFieldArrayUpdate,
  UseFormGetValues,
  UseFormWatch,
} from 'react-hook-form'
import ClientAddressesForm from './addresses-info-form'

type Props = {
  checked: boolean
  setChecked: (v: boolean) => void
  control: Control<ClientAddressFormType, any>
  fields: FieldArrayWithId<ClientAddressFormType, 'clientAddresses', 'id'>[]
  append: UseFieldArrayAppend<ClientAddressFormType, 'clientAddresses'>
  remove: UseFieldArrayRemove
  update: UseFieldArrayUpdate<ClientAddressFormType, 'clientAddresses'>
  getValues: UseFormGetValues<ClientAddressFormType>
  errors: FieldErrors<ClientAddressFormType>
  isValid: boolean
  watch: UseFormWatch<ClientAddressFormType>
  onNextStep: () => void
  handleBack: () => void
}
export default function AddressesForm({
  checked,
  setChecked,
  control,
  fields,
  append,
  remove,
  update,
  getValues,
  errors,
  isValid,
  watch,
  onNextStep,
  handleBack,
}: Props) {
  return (
    <Grid container spacing={6}>
      <ClientAddressesForm
        checked={checked}
        setChecked={setChecked}
        control={control}
        fields={fields}
        append={append}
        remove={remove}
        update={update}
        errors={errors}
        isValid={isValid}
        getValues={getValues}
      />
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12} display='flex' justifyContent='space-between'>
        <Button variant='outlined' color='secondary' onClick={handleBack}>
          <Icon icon='material-symbols:arrow-back-rounded' />
          Previous
        </Button>
        <Button variant='contained' disabled={!isValid} onClick={onNextStep}>
          Next <Icon icon='material-symbols:arrow-forward-rounded' />
        </Button>
      </Grid>
    </Grid>
  )
}
