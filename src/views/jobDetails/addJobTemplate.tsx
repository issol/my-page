import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import {
  Autocomplete,
  Button,
  Checkbox,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import CancelIcon from '@mui/icons-material/Cancel'
import { Controller, useForm, useWatch } from 'react-hook-form'

import OutlinedInput from '@mui/material/OutlinedInput'
import { Icon } from '@iconify/react'
import { useGetJobTemplate } from '@src/queries/jobs/job-template.query'
import { useGetServiceType } from '@src/queries/common.query'
import {
  FilterType,
  initialFilter,
} from '@src/pages/orders/job-list/job-template'
import { DataGrid, GridSelectionModel } from '@mui/x-data-grid'
import { getAddJobTemplateColumns } from '@src/shared/const/columns/job-template'
import NoList from '@src/pages/components/no-list'
import { UseMutationResult } from 'react-query'
import { displayCustomToast } from '@src/shared/utils/toast'

interface AddJobTemplateSearchForm {
  search: string
  serviceType: number[]
}

interface AddJobTemplateProps {
  isOpen: boolean
  onClose: () => void
  itemId: number
  createWithJobTemplateMutation: UseMutationResult<void, unknown, {
    itemId: number;
    templateId: number;
  }, unknown>
}

const AddJobTemplate = ({ isOpen, onClose, itemId, createWithJobTemplateMutation }: AddJobTemplateProps) => {
  const searchForm = useForm<AddJobTemplateSearchForm>({
    defaultValues: {
      search: '',
      serviceType: [],
    },
  })

  const [selectedServiceType] = useWatch({
    control: searchForm.control,
    name: ['serviceType'],
  })

  const [activeFilter, setActiveFilter] = useState<FilterType>({
    ...initialFilter,
    take: 8,
  })
  const [selectionModel, setSelectionModel] = useState<GridSelectionModel>([])

  const { data, isLoading } = useGetJobTemplate(activeFilter)
  const { data: serviceTypes } = useGetServiceType()

  const onSearch = (values: AddJobTemplateSearchForm) => {
    setActiveFilter({ ...activeFilter, ...values, take: 8 })
  }

  const onClickAddTemlate = () => {
    // 여기서 뮤테이션을 받고 닫아야 함
    createWithJobTemplateMutation.mutateAsync({
      itemId,
      templateId: selectionModel[0] as number,
    }).then(() => {
      onClose()
    }).catch(() => {
      displayCustomToast('Failed to delete.', 'error')
      // onClose()
    })
  }

  return (
    <Dialog
      aria-labelledby='customized-dialog-title'
      open={isOpen}
      maxWidth='xl'
    >
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        sx={{ p: '32px 20px' }}
      >
        <DialogTitle id='customized-dialog-title' sx={{ p: 0 }}>
          Add Job template
        </DialogTitle>
        <IconButton
          aria-label='close'
          sx={{
            color: theme => theme.palette.grey[500],
          }}
          onClick={() => onClose()}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <DialogContent dividers sx={{ padding: 0 }}>
        <form onSubmit={searchForm.handleSubmit(onSearch)}>
          <Box display='flex' gap='16px' padding='20px'>
            <Box>
              <Controller
                control={searchForm.control}
                name='serviceType'
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    id='serviceType'
                    size='small'
                    autoHighlight
                    fullWidth
                    multiple
                    disableCloseOnSelect
                    options={serviceTypes || []}
                    getOptionLabel={option => option.label}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option.label}
                          size='small'
                          {...getTagProps({ index })}
                          key={`${option.value}-${index}`}
                          deleteIcon={
                            <CancelIcon sx={{ color: '#6D788D !important' }} />
                          }
                        />
                      ))
                    }
                    renderInput={params => (
                      <TextField
                        {...params}
                        fullWidth
                        autoComplete='off'
                        placeholder={
                          selectedServiceType.length === 0 ? 'Service Type' : ''
                        }
                      />
                    )}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox checked={selected} sx={{ mr: 2 }} />
                        {option.label}
                      </li>
                    )}
                    value={serviceTypes?.filter(st =>
                      field.value?.includes(st.value),
                    )}
                    onChange={(event, newValue) => {
                      field.onChange(newValue.map(item => item.value))
                    }}
                    sx={{
                      minWidth: 183,
                      '& .MuiOutlinedInput-root': {
                        padding: '6px 12px !important',
                      },
                    }}
                  />
                )}
              />
            </Box>
            <Controller
              control={searchForm.control}
              name='search'
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  id='text-field'
                  type='text'
                  size='small'
                  placeholder='Search template name'
                  sx={{ minWidth: 261 }}
                  endAdornment={
                    <InputAdornment position='end'>
                      <IconButton aria-label='Search template name' edge='end'>
                        <Icon icon='ic:baseline-search' fontSize={24} />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              )}
            />
            <Button type='reset' variant='outlined' color='secondary'>
              Reset
            </Button>
            <Button type='submit' variant='contained' color='secondary'>
              Search
            </Button>
          </Box>
        </form>
        <Divider sx={{ margin: '0 !important' }} />
        <Box sx={{ marginTop: '20px' }}>
          <DataGrid
            autoHeight
            components={{
              NoRowsOverlay: () => NoList('There are no job templates'),
              NoResultsOverlay: () => NoList('There are no job templates'),
            }}
            sx={{
              overflowX: 'scroll',
              '& .MuiDataGrid-row': { cursor: 'pointer' },
            }}
            rows={data?.data || []}
            rowCount={data?.totalCount || 0}
            loading={isLoading}
            rowsPerPageOptions={[8, 16, 24]}
            columns={getAddJobTemplateColumns(
              serviceTypes || [],
              selectionModel,
            )}
            pagination
            page={activeFilter.skip}
            pageSize={activeFilter.take}
            paginationMode='server'
            onPageChange={n => {
              setActiveFilter({ ...activeFilter, skip: n })
            }}
            onPageSizeChange={newPageSize =>
              setActiveFilter({ ...activeFilter, take: newPageSize })
            }
            selectionModel={selectionModel}
            onSelectionModelChange={newSelectionModel => {
              setSelectionModel(newSelectionModel)
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p: '32px 20px' }}>
          <Button
            variant='contained'
            disabled={selectionModel.length === 0}
            onClick={onClickAddTemlate}
          >
            Add template
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default AddJobTemplate
