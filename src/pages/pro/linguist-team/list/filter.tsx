import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import { FilterType } from '..'
import { Dispatch, SetStateAction } from 'react'
import { Icon } from '@iconify/react'
import _ from 'lodash'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'

type Props = {
  filter: FilterType
  setFilter: Dispatch<SetStateAction<FilterType>>
  onSearch: () => void
  onReset: () => void
  serviceTypeList: Array<{ value: number; label: string }>
  clientList: Array<{ value: string; label: string }>
  languageList: {
    value: string
    label: GloLanguageEnum
  }[]
}

const Filters = ({
  filter,
  setFilter,
  onSearch,
  onReset,
  serviceTypeList,
  clientList,
  languageList,
}: Props) => {
  return (
    <Card sx={{ padding: '24px' }}>
      <Grid container spacing={6} rowSpacing={4}>
        <Grid item xs={6}>
          <Box className='filterFormAutoComplete'>
            <Autocomplete
              fullWidth
              multiple
              limitTags={3}
              options={clientList}
              disableCloseOnSelect
              value={clientList.filter(
                (item: { value: string; label: string }) =>
                  filter.clients?.includes(item.value),
              )}
              onChange={(e, v) =>
                setFilter({
                  ...filter,
                  clients: v.map(item => item.value),
                })
              }
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField {...params} autoComplete='off' label='Clients' />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} sx={{ mr: 2 }} />
                  {option.label}
                </li>
              )}
            />
          </Box>
        </Grid>
        <Grid item xs={6}>
          <Box className='filterFormAutoComplete'>
            <Autocomplete
              fullWidth
              multiple
              limitTags={3}
              options={serviceTypeList}
              disableCloseOnSelect
              value={serviceTypeList.filter(
                (item: { value: number; label: string }) =>
                  filter.serviceType?.includes(item.value),
              )}
              onChange={(e, v) =>
                setFilter({
                  ...filter,
                  serviceType: v.map(item => item.value),
                })
              }
              getOptionLabel={option => option.label}
              renderInput={params => (
                <TextField
                  {...params}
                  autoComplete='off'
                  label='Service type'
                />
              )}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox checked={selected} sx={{ mr: 2 }} />
                  {option.label}
                </li>
              )}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box className='filterFormAutoComplete'>
            <Autocomplete
              fullWidth
              options={_.uniqBy(languageList, 'value')}
              getOptionLabel={option => option.label}
              value={
                languageList.find(
                  (item: { value: string; label: GloLanguageEnum }) =>
                    filter.source === item.value,
                ) ?? null
              }
              onChange={(e, v) => {
                setFilter({
                  ...filter,
                  source: v?.value,
                })
              }}
              renderInput={params => <TextField {...params} label='Source' />}
            />
          </Box>
        </Grid>
        <Grid item xs={3}>
          <Box className='filterFormAutoComplete'>
            <Autocomplete
              fullWidth
              options={_.uniqBy(languageList, 'value')}
              getOptionLabel={option => option.label}
              value={
                languageList.find(
                  (item: { value: string; label: GloLanguageEnum }) =>
                    filter.target === item.value,
                ) ?? null
              }
              onChange={(e, v) => {
                setFilter({
                  ...filter,
                  target: v?.value,
                })
              }}
              renderInput={params => <TextField {...params} label='Target' />}
            />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth className='filterFormControl'>
            <InputLabel>Search Team name or number</InputLabel>
            <OutlinedInput
              label='Search Team name or number'
              value={filter.search}
              onChange={e => setFilter({ ...filter, search: e.target.value })}
              sx={{
                height: '46px',
              }}
              inputProps={{
                style: {
                  height: '46px',
                  padding: '0 14px',
                },
              }}
              type={'text'}
              endAdornment={
                <InputAdornment position='end'>
                  <Icon fontSize={20} icon={'mdi:magnify'} />
                </InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={2}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              height: '46px',
              gap: '16px',
            }}
          >
            <Button
              variant='outlined'
              color='secondary'
              type='button'
              onClick={onReset}
              sx={{ flex: 1 }}
            >
              Reset
            </Button>
            <Button
              variant='contained'
              onClick={onSearch}
              color='secondary'
              sx={{ flex: 1 }}
            >
              Search
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Card>
  )
}

export default Filters
