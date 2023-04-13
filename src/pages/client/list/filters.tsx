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

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { FilterType } from '..'
import { ClientStatus } from '@src/shared/const/status/statuses'

type Props = {
  filter: FilterType
  setFilter: <T extends FilterType>(v: T) => void
  search: () => void
  onReset: () => void
}

export default function ClientListFilter({
  filter,
  setFilter,
  search,
  onReset,
}: Props) {
  const [collapsed, setCollapsed] = useState<boolean>(true)

  function filterValue(
    option: any,
    keyName: keyof Omit<FilterType, 'skip' | 'take' | 'search' | 'hideBlocked'>,
  ) {
    return !filter[keyName]
      ? option[0]
      : option.filter((item: { value: string; label: string }) =>
          filter[keyName]?.includes(item.value),
        )
  }

  return (
    <Grid item xs={12}>
      <Card style={{ overflow: 'visible' }}>
        <CardHeader
          title='Search Filters'
          action={
            <IconButton
              size='small'
              aria-label='collapse'
              sx={{ color: 'text.secondary' }}
              onClick={() => setCollapsed(!collapsed)}
            >
              <Icon
                fontSize={20}
                icon={!collapsed ? 'mdi:chevron-down' : 'mdi:chevron-up'}
              />
            </IconButton>
          }
        />
        <Collapse in={collapsed}>
          <CardContent>
            <Grid container spacing={6} rowSpacing={4}>
              <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      multiple
                      options={ClientStatus}
                      value={filterValue(ClientStatus, 'status')}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          status: v.map(item => item.value),
                        })
                      }
                      filterSelectedOptions
                      id='status'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Status'
                          placeholder='Status'
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  </FormControl>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Search clients</InputLabel>
                  <OutlinedInput
                    label='Search clients'
                    value={filter.search}
                    onChange={e =>
                      setFilter({
                        ...filter,
                        search: e.target.value,
                      })
                    }
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

              <Grid item xs={12}>
                <Box display='flex' justifyContent='flex-end' gap='15px'>
                  <Button
                    variant='outlined'
                    size='medium'
                    color='secondary'
                    onClick={onReset}
                  >
                    Reset
                  </Button>
                  <Button variant='contained' size='medium' onClick={search}>
                    Search
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  )
}
