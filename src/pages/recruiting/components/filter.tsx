// ** React imports
import { useEffect, useMemo, useState } from 'react'

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

import { JobList } from '@src/shared/const/job/jobs'
import { RoleList } from '@src/shared/const/role/roles'

import { getGloLanguage } from '@src/shared/transformer/language.transformer'

// ** types
import { FilterType } from '..'
import { useGetClientList } from '@src/queries/client.query'

type Filter = { value: string; label: string }
type Props = {
  filter: FilterType
  setFilter: <T extends FilterType>(v: T) => void
  search: () => void
  onReset: () => void
  jobTypeOption: Array<Filter>
  roleOption: Array<Filter>
}

export default function Filters({
  filter,
  setFilter,
  search,
  onReset,
  jobTypeOption,
  roleOption,
}: Props) {
  const languageList = getGloLanguage()
  const [collapsed, setCollapsed] = useState<boolean>(true)

  const { data: clientData } = useGetClientList({ take: 1000, skip: 0 })
  const clientList = useMemo(
    () => clientData?.data?.map(i => ({ label: i.name, value: i.name })) || [],
    [clientData],
  )

  function filterValue(option: any, keyName: keyof FilterType) {
    return !filter[keyName]
      ? { value: '', label: '' }
      : option.filter(
          (item: { value: string; label: string }) =>
            filter[keyName] === item.value,
        )[0]
  }

  return (
    <Grid item xs={12}>
      <Card>
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
                    autoHighlight
                    fullWidth
                    value={filterValue(clientList, 'client')}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        client: v?.value ?? '',
                      })
                    }
                    options={clientList}
                    // filterSelectedOptions
                    id='client'
                    getOptionLabel={option => option.label}
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
                        {option.label}
                      </li>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <FormControl fullWidth>
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      options={!jobTypeOption.length ? JobList : jobTypeOption}
                      value={filterValue(JobList, 'jobType')}
                      onChange={(e, v) =>
                        setFilter({
                          ...filter,
                          jobType: v?.value ?? '',
                        })
                      }
                      // filterSelectedOptions
                      id='jobType'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField
                          {...params}
                          autoComplete='off'
                          label='Job type'
                          placeholder='Job type'
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
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={!roleOption.length ? RoleList : roleOption}
                    value={filterValue(RoleList, 'role')}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        role: v?.value ?? '',
                      })
                    }
                    // filterSelectedOptions
                    id='role'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField {...params} autoComplete='off' label='Role' placeholder='Role' />
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
              <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={languageList}
                    value={filterValue(languageList, 'source')}
                    onChange={(e, v) => {
                      setFilter({
                        ...filter,
                        source: v?.value ?? '',
                      })
                    }}
                    // filterSelectedOptions
                    id='source'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
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
              <Grid item xs={12} sm={6} md={6}>
                <FormControl fullWidth>
                  <Autocomplete
                    autoHighlight
                    fullWidth
                    options={languageList}
                    value={filterValue(languageList, 'target')}
                    onChange={(e, v) =>
                      setFilter({
                        ...filter,
                        target: v?.value ?? '',
                      })
                    }
                    // filterSelectedOptions
                    id='target'
                    getOptionLabel={option => option.label}
                    renderInput={params => (
                      <TextField
                        {...params}
                        autoComplete='off'
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
