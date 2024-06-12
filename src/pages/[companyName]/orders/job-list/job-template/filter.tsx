import { Dispatch, SetStateAction, useState } from 'react'
import { FilterType } from '.'
import {
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { Icon } from '@iconify/react'

type Props = {
  filter: FilterType
  setFilter: Dispatch<SetStateAction<FilterType>>
  onSearch: () => void
  onReset: () => void
  serviceTypeList: Array<{ value: number; label: string }>
}

const Filters = ({
  filter,
  setFilter,
  onSearch,
  onReset,
  serviceTypeList,
}: Props) => {
  return (
    <Box sx={{ width: '100%' }}>
      <Card sx={{ padding: '24px' }}>
        <Grid container spacing={6} rowSpacing={4}>
          <Grid item xs={6} sm={6} md={5}>
            <Box className='filterFormAutoComplete'>
              <Autocomplete
                // autoHighlight
                fullWidth
                multiple
                limitTags={3}
                options={serviceTypeList}
                disableCloseOnSelect
                // value={filterValue(serviceTypeList, 'serviceType')}
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
                id='serviceType'
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
          <Grid item xs={12} sm={12} md={5}>
            <FormControl fullWidth className='filterFormControl'>
              <InputLabel>Search template name or number</InputLabel>
              <OutlinedInput
                label='Search template name or number'
                value={filter.search}
                sx={{
                  height: '46px',
                }}
                inputProps={{
                  style: {
                    height: '46px',
                    padding: '0 14px',
                  },
                }}
                onChange={e => setFilter({ ...filter, search: e.target.value })}
                endAdornment={
                  <InputAdornment position='end'>
                    <IconButton edge='end'>
                      <Icon icon='mdi:magnify' />
                    </IconButton>
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
    </Box>
  )
}

export default Filters
