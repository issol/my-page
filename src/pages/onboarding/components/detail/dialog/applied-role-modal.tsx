import Image from 'next/image'
import { SyntheticEvent, useContext, useState, useEffect } from 'react'
import Box from '@mui/material/Box'

import Dialog from '@mui/material/Dialog'

import DialogContent from '@mui/material/DialogContent'

import DialogContentText from '@mui/material/DialogContentText'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import CardActions from '@mui/material/CardActions'
import Typography from '@mui/material/Typography'
import { ModalContext } from 'src/context/ModalContext'
import InputLabel from '@mui/material/InputLabel'
import Icon from 'src/@core/components/icon'
import { AddRoleType, AssignReviewerType } from 'src/types/onboarding/list'
import Tab from '@mui/material/Tab'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import FormControl from '@mui/material/FormControl'
import MuiTabList, { TabListProps } from '@mui/lab/TabList'
import {
  Control,
  FieldArrayWithId,
  FieldErrorsImpl,
  Controller,
  UseFormGetValues,
  UseFormHandleSubmit,
} from 'react-hook-form'

import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import { JobList } from 'src/shared/const/job/jobs'
import { ProRolePair } from 'src/shared/const/role/roles'
import FormHelperText from '@mui/material/FormHelperText'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import { FormControlLabel } from '@mui/material'
import { GloLanguageEnum } from '@glocalize-inc/glo-languages'
import _ from 'lodash'

const TabList = styled(MuiTabList)<TabListProps>(({ theme }) => ({
  '& .MuiTabs-indicator': {
    display: 'none',
  },
  '& .Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: `${theme.palette.common.white} !important`,
  },
  '& .MuiTab-root': {
    minHeight: 38,
    minWidth: 110,
    borderRadius: 8,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
}))
type Props = {
  open: boolean
  onClose: any
  jobInfoFields: FieldArrayWithId<AddRoleType, 'jobInfo', 'id'>[]
  roleJobInfoFields: FieldArrayWithId<AddRoleType, 'jobInfo', 'id'>[]
  control: Control<AddRoleType, any>
  errors: Partial<FieldErrorsImpl<AddRoleType>>
  onChangeJobInfo: (
    id: string,
    value: any,
    item: 'jobType' | 'role' | 'source' | 'target',
    type: string,
  ) => void
  languageList: {
    value: string
    label: GloLanguageEnum
  }[]
  addJobInfo: (type: string) => void
  removeJobInfo: (item: { id: string }, type: string) => void
  getValues: UseFormGetValues<AddRoleType>
  handleSubmit: UseFormHandleSubmit<AddRoleType>
  onClickAssignTest: (data: any) => void
  onClickCancelTest: () => void
  roleControl: Control<AddRoleType, any>
  handleRoleSubmit: UseFormHandleSubmit<AddRoleType>

  roleGetValues: UseFormGetValues<AddRoleType>
  roleErrors: Partial<FieldErrorsImpl<AddRoleType>>
  onClickAssignRole: (data: AddRoleType) => void
  onClickCancelRole: () => void
}
export default function AppliedRoleModal({
  open,
  onClose,
  jobInfoFields,
  roleJobInfoFields,
  control,
  errors,
  onChangeJobInfo,
  languageList,
  addJobInfo,
  removeJobInfo,
  getValues,
  handleSubmit,
  onClickAssignTest,
  onClickCancelTest,
  roleControl,
  handleRoleSubmit,

  roleGetValues,
  roleErrors,
  onClickAssignRole,
  onClickCancelRole,
}: Props) {
  const [value, setValue] = useState<string>('1')
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  useEffect(() => {
    !open && setValue('1')
  }, [open])

  return (
    <Dialog
      open={open}
      keepMounted
      fullWidth
      // onClose={() => setModal(null)}
      onClose={onClose}
      // TransitionComponent={Transition}
      aria-labelledby='alert-dialog-slide-title'
      aria-describedby='alert-dialog-slide-description'
      maxWidth='md'
    >
      <DialogContent
        sx={{
          padding: '50px',
          position: 'relative',
        }}
      >
        {/* <IconButton
          sx={{ position: 'absolute', top: '20px', right: '20px' }}
          onClick={onClose}
        >
          <Icon icon='mdi:close'></Icon>
        </IconButton> */}
        <TabContext value={value}>
          <TabList onChange={handleChange} aria-label='customized tabs example'>
            <Tab
              value='1'
              label='Assign test'
              icon={
                <img
                  src={`/images/icons/onboarding-icons/assign-test-${
                    value === '1' ? 'active' : 'inactive'
                  }.svg`}
                />
              }
              sx={{ textTransform: 'none' }}
              iconPosition='start'
            />
            <Tab
              value='2'
              label='Assign role'
              icon={<Icon icon='mdi:account-outline'></Icon>}
              iconPosition='start'
              sx={{ textTransform: 'none' }}
            />
          </TabList>
          <TabPanel value='1' sx={{ padding: 0 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: '30px',
              }}
            >
              <form onSubmit={handleSubmit(onClickAssignTest)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {/* JobInfos */}
                  {jobInfoFields?.map((item, idx) => {
                    return (
                      <Box key={item.id}>
                        {/* job type & role */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 4,
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant='body1' sx={{ fontWeight: 600 }}>
                            {idx < 9 ? 0 : null}
                            {idx + 1}.
                          </Typography>
                          {jobInfoFields.length > 1 && (
                            <IconButton
                              onClick={() => removeJobInfo(item, 'test')}
                              sx={{ padding: 1 }}
                            >
                              <Icon icon='mdi:delete-outline'></Icon>
                            </IconButton>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.jobType`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <InputLabel
                                    id='jobType'
                                    error={
                                      errors.jobInfo?.length
                                        ? !!errors.jobInfo[idx]?.jobType
                                        : false
                                    }
                                  >
                                    Job type*
                                  </InputLabel>
                                  <Select
                                    label='Job type*'
                                    {...field}
                                    error={
                                      errors.jobInfo?.length
                                        ? !!errors.jobInfo[idx]?.jobType
                                        : false
                                    }
                                    value={item.jobType}
                                    placeholder='Job type *'
                                    onChange={e => {
                                      onChangeJobInfo(
                                        item.id,
                                        e.target.value,
                                        'jobType',
                                        'test',
                                      )
                                    }}
                                  >
                                    {JobList.map((item, idx) => (
                                      <MenuItem value={item.value} key={idx}>
                                        {item.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </>
                              )}
                            />
                            {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.jobType && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.jobType?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                          <FormControl sx={{ mb: 4 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.role`}
                              control={control}
                              render={({ field }) => (
                                <>
                                  <InputLabel
                                    id='role'
                                    error={
                                      errors.jobInfo?.length
                                        ? !!errors.jobInfo[idx]?.role
                                        : false
                                    }
                                  >
                                    Role*
                                  </InputLabel>
                                  <Select
                                    label='Role*'
                                    {...field}
                                    error={
                                      errors.jobInfo?.length
                                        ? !!errors.jobInfo[idx]?.role
                                        : false
                                    }
                                    value={item.role}
                                    placeholder='Role *'
                                    disabled={
                                      !!!getValues(`jobInfo.${idx}.jobType`)
                                    }
                                    onChange={e =>
                                      onChangeJobInfo(
                                        item.id,
                                        e.target.value,
                                        'role',
                                        'test',
                                      )
                                    }
                                  >
                                    {/* @ts-ignore */}
                                    {ProRolePair[item.jobType]?.map(
                                      (item: any, idx: number) => (
                                        <MenuItem value={item.value} key={idx}>
                                          {item.label}
                                        </MenuItem>
                                      ),
                                    )}
                                  </Select>
                                </>
                              )}
                            />

                            {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.role && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.role?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                        </Box>
                        {/* languages */}
                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.source`}
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  {...field}
                                  disableClearable
                                  disabled={
                                    item.role === 'DTPer' ||
                                    item.role === 'DTP QCer'
                                  }
                                  value={
                                    languageList.filter(
                                      l => l.value === item.source,
                                    )[0]
                                  }
                                  options={languageList}
                                  onChange={(e, v) =>
                                    onChangeJobInfo(
                                      item.id,
                                      v?.value,
                                      'source',
                                      'test',
                                    )
                                  }
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Source*'
                                      error={
                                        errors.jobInfo?.length
                                          ? !!errors.jobInfo[idx]?.source
                                          : false
                                      }
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />

                            {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.source && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.source?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.target`}
                              control={control}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  {...field}
                                  disableClearable
                                  disabled={
                                    item.role === 'DTPer' ||
                                    item.role === 'DTP QCer'
                                  }
                                  value={
                                    languageList.filter(
                                      l => l.value === item.target,
                                    )[0]
                                  }
                                  options={languageList}
                                  onChange={(e, v) =>
                                    onChangeJobInfo(
                                      item.id,
                                      v?.value,
                                      'target',
                                      'test',
                                    )
                                  }
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Target*'
                                      error={
                                        errors.jobInfo?.length
                                          ? !!errors.jobInfo[idx]?.target
                                          : false
                                      }
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />

                            {errors.jobInfo?.length
                              ? errors.jobInfo[idx]?.target && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors?.jobInfo[idx]?.target?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                        </Box>
                      </Box>
                    )
                  })}
                  <Box>
                    <IconButton
                      onClick={() => addJobInfo('test')}
                      color='primary'
                      disabled={jobInfoFields.some(item => {
                        if (item.role === 'DTPer' || item.role === 'DTP QCer') {
                          return !item.jobType || !item.role
                        } else {
                          return (
                            !item.jobType ||
                            !item.role ||
                            !item.target ||
                            !item.source
                          )
                        }
                      })}
                      sx={{ padding: 0 }}
                    >
                      <Icon icon='mdi:plus-box' width={26}></Icon>
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '24px',
                    }}
                  >
                    <Button variant='outlined' onClick={onClickCancelTest}>
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      type='submit'
                      disabled={jobInfoFields.some(item => {
                        if (item.role === 'DTPer' || item.role === 'DTP QCer') {
                          return !item.jobType || !item.role
                        } else {
                          return (
                            !item.jobType ||
                            !item.role ||
                            !item.target ||
                            !item.source
                          )
                        }
                      })}
                    >
                      Assign test
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </TabPanel>
          <TabPanel value='2' sx={{ padding: 0 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                mt: '30px',
              }}
            >
              <form onSubmit={handleRoleSubmit(onClickAssignRole)}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {/* JobInfos */}
                  {roleJobInfoFields?.map((item, idx) => {
                    return (
                      <Box key={item.id}>
                        {/* job type & role */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            mb: 4,
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant='body1' sx={{ fontWeight: 600 }}>
                            {idx < 9 ? 0 : null}
                            {idx + 1}.
                          </Typography>
                          {jobInfoFields.length > 1 && (
                            <IconButton
                              onClick={() => removeJobInfo(item, 'role')}
                              sx={{ padding: 1 }}
                            >
                              <Icon icon='mdi:delete-outline'></Icon>
                            </IconButton>
                          )}
                        </Box>

                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.jobType`}
                              control={roleControl}
                              render={({ field }) => (
                                <>
                                  <InputLabel
                                    id='jobType'
                                    error={
                                      roleErrors.jobInfo?.length
                                        ? !!roleErrors.jobInfo[idx]?.jobType
                                        : false
                                    }
                                  >
                                    Job type*
                                  </InputLabel>
                                  <Select
                                    label='Job type*'
                                    {...field}
                                    error={
                                      roleErrors.jobInfo?.length
                                        ? !!roleErrors.jobInfo[idx]?.jobType
                                        : false
                                    }
                                    value={item.jobType}
                                    placeholder='Job type *'
                                    onChange={e =>
                                      onChangeJobInfo(
                                        item.id,
                                        e.target.value,
                                        'jobType',
                                        'role',
                                      )
                                    }
                                  >
                                    {JobList.map((item, idx) => (
                                      <MenuItem value={item.value} key={idx}>
                                        {item.label}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </>
                              )}
                            />
                            {roleErrors.jobInfo?.length
                              ? roleErrors.jobInfo[idx]?.jobType && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {roleErrors?.jobInfo[idx]?.jobType?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                          <FormControl sx={{ mb: 4 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.role`}
                              control={roleControl}
                              render={({ field }) => (
                                <>
                                  <InputLabel
                                    id='role'
                                    error={
                                      roleErrors.jobInfo?.length
                                        ? !!roleErrors.jobInfo[idx]?.role
                                        : false
                                    }
                                  >
                                    Role*
                                  </InputLabel>
                                  <Select
                                    label='Role*'
                                    {...field}
                                    error={
                                      roleErrors.jobInfo?.length
                                        ? !!roleErrors.jobInfo[idx]?.role
                                        : false
                                    }
                                    value={item.role}
                                    placeholder='Role *'
                                    disabled={
                                      !!!roleGetValues(`jobInfo.${idx}.jobType`)
                                    }
                                    onChange={e =>
                                      onChangeJobInfo(
                                        item.id,
                                        e.target.value,
                                        'role',
                                        'role',
                                      )
                                    }
                                  >
                                    {/* @ts-ignore */}
                                    {ProRolePair[item.jobType]?.map(
                                      (item: any, idx: number) => (
                                        <MenuItem value={item.value} key={idx}>
                                          {item.label}
                                        </MenuItem>
                                      ),
                                    )}
                                  </Select>
                                </>
                              )}
                            />

                            {roleErrors.jobInfo?.length
                              ? roleErrors.jobInfo[idx]?.role && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {roleErrors?.jobInfo[idx]?.role?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                        </Box>
                        {/* languages */}
                        <Box sx={{ display: 'flex', gap: '16px' }}>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.source`}
                              control={roleControl}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  {...field}
                                  disableClearable
                                  disabled={item.jobType === 'DTP'}
                                  value={
                                    languageList.filter(
                                      l => l.value === item.source,
                                    )[0]
                                  }
                                  options={languageList}
                                  onChange={(e, v) =>
                                    onChangeJobInfo(
                                      item.id,
                                      v?.value,
                                      'source',
                                      'role',
                                    )
                                  }
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Source*'
                                      error={
                                        roleErrors.jobInfo?.length
                                          ? !!roleErrors.jobInfo[idx]?.source
                                          : false
                                      }
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />

                            {roleErrors.jobInfo?.length
                              ? roleErrors.jobInfo[idx]?.source && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {roleErrors?.jobInfo[idx]?.source?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                          <FormControl sx={{ mb: 2 }} fullWidth>
                            <Controller
                              name={`jobInfo.${idx}.target`}
                              control={roleControl}
                              render={({ field }) => (
                                <Autocomplete
                                  autoHighlight
                                  fullWidth
                                  {...field}
                                  disableClearable
                                  disabled={item.jobType === 'DTP'}
                                  value={
                                    languageList.filter(
                                      l => l.value === item.target,
                                    )[0]
                                  }
                                  options={languageList}
                                  onChange={(e, v) =>
                                    onChangeJobInfo(
                                      item.id,
                                      v?.value,
                                      'target',
                                      'role',
                                    )
                                  }
                                  renderOption={(props, option) => (
                                    <Box
                                      component='li'
                                      {...props}
                                      key={props.id}
                                    >
                                      {option.label}
                                    </Box>
                                  )}
                                  renderInput={params => (
                                    <TextField
                                      {...params}
                                      label='Target*'
                                      error={
                                        roleErrors.jobInfo?.length
                                          ? !!roleErrors.jobInfo[idx]?.target
                                          : false
                                      }
                                      inputProps={{
                                        ...params.inputProps,
                                        autoComplete: 'new-password',
                                      }}
                                    />
                                  )}
                                />
                              )}
                            />

                            {roleErrors.jobInfo?.length
                              ? roleErrors.jobInfo[idx]?.target && (
                                  <FormHelperText sx={{ color: 'error.main' }}>
                                    {roleErrors?.jobInfo[idx]?.target?.message}
                                  </FormHelperText>
                                )
                              : ''}
                          </FormControl>
                        </Box>
                      </Box>
                    )
                  })}
                  <Box>
                    <IconButton
                      onClick={() => addJobInfo('role')}
                      color='primary'
                      disabled={roleJobInfoFields.some(item => {
                        if (item.jobType === 'DTP') {
                          return !item.jobType || !item.role
                        } else {
                          return (
                            !item.jobType ||
                            !item.role ||
                            !item.target ||
                            !item.source
                          )
                        }
                      })}
                      sx={{ padding: 0 }}
                    >
                      <Icon icon='mdi:plus-box' width={26}></Icon>
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '24px',
                    }}
                  >
                    <Button variant='outlined' onClick={onClickCancelRole}>
                      Cancel
                    </Button>
                    <Button
                      variant='contained'
                      type='submit'
                      disabled={roleJobInfoFields.some(item => {
                        if (item.jobType === 'DTP') {
                          return !item.jobType || !item.role
                        } else {
                          return (
                            !item.jobType ||
                            !item.role ||
                            !item.target ||
                            !item.source
                          )
                        }
                      })}
                    >
                      Assign role
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </TabPanel>
        </TabContext>
      </DialogContent>
    </Dialog>
  )
}
