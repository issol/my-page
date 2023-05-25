import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import { Icon } from '@iconify/react'
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  CardHeader,
  Collapse,
  Grid,
  IconButton,
  useTheme,
  TextField,
  Checkbox,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from '@mui/material'
import { AutoCompleteComponent } from '@src/pages/pro/list/filters'
import { AreaOfExpertiseList } from '@src/shared/const/area-of-expertise/area-of-expertise'
import { CategoryList } from '@src/shared/const/category/categories'
import { Category } from '@src/shared/const/category/category.enum'
import { ClientListIncludeGloz } from '@src/shared/const/client/clients'
import { ServiceType } from '@src/shared/const/service-type/service-type.enum'
import { ServiceTypeList } from '@src/shared/const/service-type/service-types'
import { WorkStatus } from '@src/shared/const/status/statuses'
import {
  AssignProFilterType,
  AssignProFilterPostType,
} from '@src/types/orders/job-detail'
import _ from 'lodash'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  Control,
  Controller,
  UseFormHandleSubmit,
  UseFormTrigger,
} from 'react-hook-form'

type Props = {
  control: Control<AssignProFilterType, any>
  handleSubmit: UseFormHandleSubmit<AssignProFilterType>
  onSubmit: (data: AssignProFilterType) => void
  filters: AssignProFilterPostType
  setFilters: Dispatch<SetStateAction<AssignProFilterPostType>>
  onReset: () => void
  serviceTypeList: {
    label: ServiceType
    value: ServiceType
  }[]
  setServiceTypeList: Dispatch<
    SetStateAction<
      {
        label: ServiceType
        value: ServiceType
      }[]
    >
  >
  categoryList: {
    label: Category
    value: Category
  }[]
  setCategoryList: Dispatch<
    SetStateAction<
      {
        label: Category
        value: Category
      }[]
    >
  >
  trigger: UseFormTrigger<AssignProFilterType>
  languageList: {
    value: string
    label: GloLanguageEnum
  }[]
}

const AssignProFilters = ({
  control,
  handleSubmit,
  onSubmit,
  filters,
  setFilters,
  onReset,
  serviceTypeList,
  setServiceTypeList,
  categoryList,
  setCategoryList,
  trigger,
  languageList,
}: Props) => {
  const [collapsed, setCollapsed] = useState<boolean>(true)
  const [inputStyle, setInputStyle] = useState<boolean>(true)

  return (
    <AutoCompleteComponent dropdownClose={inputStyle}>
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
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6} rowSpacing={4} sx={{ padding: '0' }}>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='source'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px',
                        },
                        '& .MuiChip-root': {
                          height: '24px',
                        },
                      }}
                      onChange={(event, item) => {
                        onChange(item)
                      }}
                      onClose={() => {
                        setInputStyle(false)
                      }}
                      onOpen={() => {
                        setInputStyle(true)
                      }}
                      value={value}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      disableCloseOnSelect
                      limitTags={1}
                      options={_.uniqBy(languageList, 'value')}
                      id='source'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField {...params} label='Source' size='small' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='target'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple
                      fullWidth
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px',
                        },
                        '& .MuiChip-root': {
                          height: '24px',
                        },
                      }}
                      onChange={(event, item) => {
                        onChange(item)
                      }}
                      onClose={() => {
                        setInputStyle(false)
                      }}
                      onOpen={() => {
                        setInputStyle(true)
                      }}
                      value={value}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      disableCloseOnSelect
                      limitTags={1}
                      options={_.uniqBy(languageList, 'value')}
                      id='target'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField {...params} label='Target' size='small' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='category'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      fullWidth
                      multiple
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px',
                        },
                        '& .MuiChip-root': {
                          height: '24px',
                        },
                      }}
                      limitTags={1}
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      onChange={(event, item) => {
                        onChange(item)
                        if (item.length) {
                          const arr: {
                            label: ServiceType
                            value: ServiceType
                          }[] = []

                          item.map(value => {
                            /* @ts-ignore */
                            const res = ServiceTypePair[value.value]
                            arr.push(...res)
                          })

                          setServiceTypeList(_.uniqBy(arr, 'value'))
                          trigger('serviceType')
                        } else {
                          setServiceTypeList(ServiceTypeList)
                          trigger('serviceType')
                        }
                      }}
                      value={value}
                      options={categoryList}
                      id='category'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField {...params} label='Category' size='small' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  control={control}
                  name='serviceType'
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      fullWidth
                      multiple
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px',
                        },
                        '& .MuiChip-root': {
                          height: '24px',
                        },
                      }}
                      disableCloseOnSelect
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      onChange={(event, item) => {
                        onChange(item)

                        if (item.length) {
                          const arr: {
                            label: Category
                            value: Category
                          }[] = []

                          item.map(value => {
                            /* @ts-ignore */
                            const res = CategoryListPair[value.value]
                            arr.push(...res)
                          })

                          setCategoryList(arr)
                          trigger('category')
                        } else {
                          setCategoryList(CategoryList)
                          trigger('category')
                        }
                      }}
                      value={value}
                      options={serviceTypeList}
                      id='ServiceType'
                      limitTags={1}
                      getOptionLabel={option => option.label || ''}
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Service type'
                          size='small'
                        />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <Controller
                  name='client'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Autocomplete
                      fullWidth
                      multiple
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px',
                        },
                        '& .MuiChip-root': {
                          height: '24px',
                        },
                      }}
                      disableCloseOnSelect
                      isOptionEqualToValue={(option, newValue) => {
                        return option.value === newValue.value
                      }}
                      options={ClientListIncludeGloz}
                      // filterSelectedOptions
                      onChange={(e, v) => {
                        if (!v) onChange({ value: '', label: '' })
                        else onChange(v)
                      }}
                      value={value}
                      limitTags={1}
                      id='client'
                      getOptionLabel={option => option.label}
                      renderInput={params => (
                        <TextField {...params} label='Client' size='small' />
                      )}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox checked={selected} sx={{ mr: 2 }} />
                          {option.label}
                        </li>
                      )}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <Controller
                  name='areaOfExpertise'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      autoHighlight
                      fullWidth
                      multiple
                      sx={{
                        '& .MuiInputBase-root': {
                          height: '40px',
                        },
                        '& .MuiChip-root': {
                          height: '24px',
                        },
                      }}
                      value={value}
                      options={AreaOfExpertiseList}
                      // onChange={(e, v: any, l) => {
                      //   if (
                      //     v.length <= 1 &&
                      //     l === 'removeOption' &&
                      //     (!v[0]?.value || !v[0]?.label)
                      //   ) {
                      //     onChange([{ label: '', value: '' }])
                      //     return
                      //   }
                      //   onChange(v)
                      // }}
                      onChange={(e, v) => {
                        if (!v) onChange({ value: '', label: '' })
                        else onChange(v)
                      }}
                      limitTags={1}
                      renderOption={(props, option, { selected }) => (
                        <li {...props}>
                          <Checkbox
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.label}
                        </li>
                      )}
                      id='multiple-limit-tags'
                      renderInput={params => (
                        <TextField
                          {...params}
                          label='Area of expertise'
                          size='small'
                        />
                      )}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={3}>
                <FormControl fullWidth sx={{ height: '40px' }}>
                  <Controller
                    control={control}
                    name='search'
                    render={({ field: { onChange, value } }) => (
                      <>
                        <InputLabel size='small'>Search Pros</InputLabel>
                        <OutlinedInput
                          label='Search Pros'
                          value={value}
                          onChange={onChange}
                          size='small'
                          endAdornment={
                            <InputAdornment position='end'>
                              <IconButton edge='end'>
                                <Icon icon='mdi:magnify' />
                              </IconButton>
                            </InputAdornment>
                          }
                        />
                      </>
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
                    type='button'
                    onClick={onReset}
                    sx={{ height: '30px' }}
                  >
                    Reset
                  </Button>
                  <Button
                    variant='contained'
                    size='medium'
                    type='submit'
                    sx={{ height: '30px' }}
                  >
                    Search
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Collapse>
    </AutoCompleteComponent>
  )
}

export default AssignProFilters
