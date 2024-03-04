// ** React imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { Box } from '@mui/system'
import Collapse from '@mui/material/Collapse'
import CardContent from '@mui/material/CardContent'
import {
  Button,
  Card,
  CardHeader,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import { styled } from '@mui/system'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// **values
import { CategoryList } from '@src/shared/const/category/categories'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'

// ** types
import { ConstType } from '@src/pages/onboarding/client-guideline'
import { FilterType } from './tracker-view'
import { ClientRowType } from '@src/apis/client.api'

type Props = {
  filter: FilterType
  setFilter: <T extends FilterType>(v: T) => void
  onSearch: () => void
  onReset: () => void
  serviceTypeOptions: Array<ConstType>
  clients: Array<ClientRowType>
}

export default function Filters({
  filter,
  setFilter,
  onSearch,
  onReset,
  serviceTypeOptions,
  clients,
}: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(true)

  function filterValue(
    option: any,
    keyName: keyof Pick<FilterType, 'client' | 'category' | 'serviceType'>,
  ): Array<{ value: string; label: string }> {
    return !filter[keyName]
      ? option[0]
      : option.filter((item: { value: string; label: string }) =>
          filter[keyName]?.includes(item.value),
        )
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Card style={{ overflow: 'visible' }}>
        <CardContent>
          <Grid container spacing={6} rowSpacing={4}>
            <Grid item xs={12} sm={6} md={6}>
              <Box className='filterFormAutoComplete'>
                <Autocomplete
                  autoHighlight
                  fullWidth
                  multiple
                  options={clients}
                  value={clients.filter(client =>
                    filter?.client?.includes(String(client.clientId)),
                  )}
                  onChange={(e, v) =>
                    setFilter({
                      ...filter,
                      client: v.map(i => String(i.clientId)),
                    })
                  }
                  // filterSelectedOptions
                  getOptionLabel={option => option?.name}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoComplete='off'
                      label='Client'
                      placeholder='Client'
                    />
                  )}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox checked={selected} sx={{ mr: 2 }} />
                      {option.name}
                    </li>
                  )}
                />
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={6}>
              <Box className='filterFormAutoComplete'>
                <Autocomplete
                  fullWidth
                  multiple
                  options={CategoryList}
                  value={filterValue(CategoryList, 'category')}
                  onChange={(e, v) =>
                    setFilter({
                      ...filter,
                      category: v.map(item => item.value),
                    })
                  }
                  id='category'
                  getOptionLabel={option => option.label}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoComplete='off'
                      label='Category'
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
            <Grid item xs={12} sm={6} md={6}>
              <Box className='filterFormAutoComplete'>
                <Autocomplete
                  autoHighlight
                  fullWidth
                  multiple
                  options={serviceTypeOptions || []}
                  value={filterValue(ServiceTypeList, 'serviceType')}
                  onChange={(e, v) =>
                    setFilter({
                      ...filter,
                      serviceType: v.map(item => item.value),
                    })
                  }
                  // filterSelectedOptions
                  id='serviceType'
                  getOptionLabel={option => option.label}
                  renderInput={params => (
                    <TextField
                      {...params}
                      autoComplete='off'
                      label='Service type'
                      placeholder='Service type'
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
            <Grid item xs={12} sm={12} md={4}>
              <FormControl fullWidth className='filterFormControl'>
                <InputLabel>Search projects</InputLabel>
                <OutlinedInput
                  label='Search projects'
                  value={filter.search}
                  onChange={e =>
                    setFilter({ ...filter, search: e.target.value })
                  }
                  sx={{
                    height: '46px',
                  }}
                  inputProps={{
                    style: {
                      height: '46px',
                      padding: '0 14px',
                    },
                  }}
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
                  color='secondary'
                  sx={{ flex: 1 }}
                  onClick={onSearch}
                >
                  Search
                </Button>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  )
}
