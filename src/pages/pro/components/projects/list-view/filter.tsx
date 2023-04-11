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
} from '@mui/material'

import styled from 'styled-components'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// **values
import { RoleList } from 'src/shared/const/role/roles'
import { getGloLanguage } from 'src/shared/transformer/language.transformer'
import { ProStatus } from '@src/shared/const/status/statuses'
import { ClientListIncludeGloz } from '@src/shared/const/client/clients'

// ** types
import { FilterType } from '../index'

type Props = {
  workName: Array<{ value: string; label: string }> | []
  filter: FilterType
  setFilter: <T extends FilterType>(v: T) => void
  search: () => void
  onReset: () => void
}

export default function Filters({
  workName,
  filter,
  setFilter,
  search,
  onReset,
}: Props) {
  const languageList = getGloLanguage()
  const [collapsed, setCollapsed] = useState<boolean>(true)

  const commonOptions = {
    autoHighlight: true,
    fullWidth: true,
    filterSelectedOptions: true,
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
                  <FormControl fullWidth>
                    <Autocomplete
                      {...commonOptions}
                      multiple
                      options={workName}
                      value={filter.title}
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
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <Autocomplete
                    {...commonOptions}
                    multiple
                    options={RoleList}
                    value={filter.role}
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
                    options={ProStatus}
                    value={filter.status}
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
                    options={languageList}
                    value={filter.source}
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
                    options={languageList}
                    value={filter.target}
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
                    options={ClientListIncludeGloz}
                    value={filter.client}
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
