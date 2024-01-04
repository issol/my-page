// ** React imports
import { useMemo, useState } from 'react'

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
} from '@mui/material'

// ** Icon Imports
import Icon from '@src/@core/components/icon'

// **values
import { RoleList } from '@src/shared/const/role/roles'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import { ProStatus, WorkStatus } from '@src/shared/const/status/statuses'

// ** types
import { FilterType } from '../index'
import { useGetClientList } from '@src/queries/client.query'

interface FiltersProps {
  workName: Array<{ value: string; label: string }> | []
  filter: FilterType
  setFilter: <T extends FilterType>(v: T) => void
  search: () => void
  onReset: () => void
}

const Filters = ({
  workName,
  filter,
  setFilter,
  search,
  onReset,
}: FiltersProps) => {
  const languageList = getGloLanguage()
  const [collapsed, setCollapsed] = useState<boolean>(true)

  const { data: clientData } = useGetClientList({ take: 1000, skip: 0 })

  const clientList = useMemo(
    () => clientData?.data?.map(i => ({ label: i.name, value: i.name })) || [],
    [clientData],
  )

  const commonOptions = {
    autoHighlight: true,
    fullWidth: true,
    getOptionLabel: (val: { label: string; value: string }) => val.label,
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...commonOptions}
                    multiple
                    disableCloseOnSelect
                    options={workName}
                    value={filter.title}
                    limitTags={1}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        title: v,
                      })
                    }
                    id='workName'
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Work name'
                        placeholder='Work name'
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
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...commonOptions}
                    multiple
                    disableCloseOnSelect
                    options={RoleList}
                    value={filter.role}
                    limitTags={1}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        role: v,
                      })
                    }
                    id='role'
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Item name'
                        placeholder='Item name'
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
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...commonOptions}
                    multiple
                    disableCloseOnSelect
                    options={WorkStatus}
                    value={filter.status}
                    limitTags={1}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        status: v,
                      })
                    }
                    id='status'
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
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...commonOptions}
                    multiple
                    disableCloseOnSelect
                    options={languageList}
                    value={filter.source}
                    limitTags={1}
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    onChange={(e, v) => {
                      setFilter({
                        ...filter,
                        source: v,
                      })
                    }}
                    id='source'
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Source'
                        placeholder='Source'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} key={option.value}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...commonOptions}
                    multiple
                    disableCloseOnSelect
                    options={languageList}
                    value={filter.target}
                    isOptionEqualToValue={(option, newValue) => {
                      return option.value === newValue.value
                    }}
                    limitTags={1}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        target: v,
                      })
                    }
                    id='target'
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Target'
                        placeholder='Target'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} key={option.value}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...commonOptions}
                    multiple
                    disableCloseOnSelect
                    options={clientList}
                    value={filter.client}
                    limitTags={1}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        client: v,
                      })
                    }
                    id='client'
                    renderInput={params => (
                      <TextField
                        {...params}
                        label='Clients'
                        placeholder='Clients'
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props} key={option.value}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
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

export default Filters
