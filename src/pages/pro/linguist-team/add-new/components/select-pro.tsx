import { Icon } from '@iconify/react'
import {
  Box,
  Button,
  FormControlLabel,
  IconButton,
  Switch,
  Tooltip,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { getLinguistTeamProColumns } from '@src/shared/const/columns/linguist-team'
import { LinguistTeamFormType } from '@src/types/pro/linguist-team'
import { v4 as uuidv4 } from 'uuid'
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormTrigger,
} from 'react-hook-form'
import LegalNameEmail from '@src/pages/onboarding/components/list/list-item/legalname-email'
import {
  ExtraNumberChip,
  JobTypeChip,
  ProStatusChip,
  RoleChip,
} from '@src/@core/components/chips/chips'
import { hexToRGBA } from '@src/@core/utils/hex-to-rgba'
import { Dispatch, SetStateAction } from 'react'

type Props = {
  onClickSelectProsHelperIcon: () => void
  fields: FieldArrayWithId<LinguistTeamFormType, 'pros', 'id'>[]
  control: Control<LinguistTeamFormType, any>
  trigger: UseFormTrigger<LinguistTeamFormType>
  getValues: UseFormGetValues<LinguistTeamFormType>
  onClickAddPros: () => void
  remove: UseFieldArrayRemove
  handleBack: () => void
  onClickSave: () => void
  type: 'edit' | 'create' | 'detail'
  setExpandSelectProArea?: Dispatch<SetStateAction<boolean>>
  expandSelectProArea?: boolean
}

const SelectPro = ({
  onClickSelectProsHelperIcon,
  fields,
  control,
  trigger,
  getValues,
  onClickAddPros,
  remove,
  handleBack,
  onClickSave,
  type,
  setExpandSelectProArea,
  expandSelectProArea,
}: Props) => {
  const getClientName = (
    clients: Array<{
      id: number
      client: string
    }>,
  ) => {
    const clientName: Array<string> = []
    clients.map((client, index) => {
      clientName.push(client.client)
    })
    return clientName.join(', ')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        height: '100%',
        // minHeight: '772px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          padding:
            type === 'detail' || expandSelectProArea
              ? '20px '
              : '32px 20px 20px 20px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Typography fontSize={20} fontWeight={500}>
            Selected Pros ({getValues('pros')?.length ?? 0})
          </Typography>
          <IconButton sx={{ padding: 0 }} onClick={onClickSelectProsHelperIcon}>
            <Icon icon='mdi:info-circle-outline' />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {type === 'detail' ? (
            <>
              <Typography fontSize={14}>Priority mode</Typography>
              <Box
                sx={{
                  padding: '3px 4px',
                  borderRadius: '5px',
                  background:
                    getValues('isPrioritized') === '1' ? '#EEFBE5' : '#E9EAEC',
                }}
              >
                <Typography
                  fontSize={13}
                  color={
                    getValues('isPrioritized') === '1' ? '#6AD721' : '#BBBCC4'
                  }
                >
                  {getValues('isPrioritized') === '1' ? 'On' : 'Off'}
                </Typography>
              </Box>
            </>
          ) : (
            <>
              <IconButton
                sx={{ padding: 0 }}
                onClick={onClickSelectProsHelperIcon}
              >
                <Icon icon='mdi:info-circle-outline' />
              </IconButton>
              <Controller
                name='isPrioritized'
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        checked={field.value === '1' ? true : false}
                        value={field.value === '1' ? true : false}
                        onChange={(e, v) => {
                          field.onChange(v ? '1' : '0')
                          trigger('isPrioritized')
                        }}
                      />
                    }
                    labelPlacement='start'
                    label='Priority mode'
                    sx={{
                      '& .MuiTypography-body1': {
                        fontSize: 14,
                      },
                      marginLeft: 0,
                    }}
                  />
                )}
              />
              {type === 'edit' ? (
                <Tooltip title='Expand this section'>
                  <IconButton
                    sx={{ padding: 0, marginLeft: '16px' }}
                    onClick={() =>
                      setExpandSelectProArea &&
                      setExpandSelectProArea(!expandSelectProArea)
                    }
                  >
                    {expandSelectProArea ? (
                      <Icon icon='pajamas:expand-down' />
                    ) : (
                      <Icon icon='pajamas:expand-up' />
                    )}
                  </IconButton>
                </Tooltip>
              ) : null}
            </>
          )}
        </Box>
      </Box>
      <Box sx={{ height: '100%' }}>
        <DataGrid
          sx={{ height: '56px !important' }}
          autoHeight
          rows={[]}
          components={{
            NoRowsOverlay: () => <></>,
            NoResultsOverlay: () => <></>,
          }}
          columns={getLinguistTeamProColumns(
            getValues('isPrioritized') === '1' ? true : false,
            type === 'detail' && getValues('isPrioritized') === '0'
              ? true
              : false,
            type,
          )}
          hideFooter
        />
        <Box
          sx={{
            // position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            // minHeight: '501px',
            minHeight: type === 'create' ? '500px' : '300px',
            background: '#F7F8FF',
          }}
          className='selectPro'
        >
          {fields.length > 0 && (
            <Box
              key={'proList'}
              data-droppable-id={'proList'}
              sx={{
                overflowY: 'scroll',
                maxHeight: type === 'create' ? '650px' : '500px',
                '&::-webkit-scrollbar': {
                  width: 6,
                },
                '&::-webkit-scrollbar-thumb': {
                  borderRadius: 20,
                  background: hexToRGBA('#57596C', 0.6),
                },
                '&::-webkit-scrollbar-track': {
                  borderRadius: 20,
                  background: 'transparent',
                },
              }}
            >
              {fields.map((value, index) => {
                return (
                  <Box
                    key={uuidv4()}
                    data-index={index}
                    className={
                      getValues('isPrioritized') === '1' ? 'dnd-item' : ''
                    }
                    sx={{
                      width: '100%',
                      display: 'flex',
                      height: '54px',
                      background: '#F7F8FF',
                      borderTop: '1px solid rgba(76, 78, 100, 0.12)',
                      borderBottom: '1px solid rgba(76, 78, 100, 0.12)',
                    }}
                  >
                    {getValues('isPrioritized') === '1' ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flex:
                            type === 'detail' &&
                            getValues('isPrioritized') === '1'
                              ? 0.032
                              : 0.0584,
                        }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flex: 1,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                        >
                          <Typography fontWeight={600} fontSize={14}>
                            {index + 1}
                          </Typography>
                        </Box>
                        {type === 'detail' ? null : (
                          <Box
                            sx={{
                              display: 'flex',
                              flex: 1,
                              justifyContent: 'center',
                              alignItems: 'center',
                              cursor: 'grab',
                            }}
                            className='dnd-handle'
                          >
                            <Icon
                              icon='akar-icons:drag-vertical'
                              fontSize={24}
                              color='#8D8E9A'
                            />
                          </Box>
                        )}
                      </Box>
                    ) : null}
                    <Box
                      sx={{
                        paddingLeft: '16px',
                        // paddingLeft:
                        //   type === 'detail' &&
                        //   getValues('isPrioritized') === '0'
                        //     ? 0
                        //     : '16px',
                        display: 'flex',

                        flex:
                          type === 'detail' &&
                          getValues('isPrioritized') === '0'
                            ? 0.274
                            : 0.248,
                      }}
                    >
                      <LegalNameEmail
                        row={{
                          isOnboarded: value.isOnboarded,
                          isActive: value.isActive,

                          firstName: value.firstName,
                          middleName: value.middleName,
                          lastName: value.lastName,
                          email: value.email,
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        // padding: '16px 20px',

                        display: 'flex',
                        alignItems: 'center',
                        paddingLeft:
                          type === 'detail' &&
                          getValues('isPrioritized') === '0'
                            ? '16px'
                            : '20px',
                        flex: 0.144,
                      }}
                    >
                      <ProStatusChip
                        status={value.status}
                        label={value.status}
                      />
                    </Box>
                    <Box
                      sx={{
                        paddingLeft: '20px',
                        display: 'flex',
                        flex: 0.144,
                      }}
                    >
                      {' '}
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {!value.clients?.length ? (
                          '-'
                        ) : (
                          <Box
                            key={uuidv4()}
                            sx={{
                              display: 'flex',
                            }}
                          >
                            <Box
                              sx={{
                                maxWidth: '160px',
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {`${getClientName(value.clients)}`}
                            </Box>
                          </Box>
                        )}
                        {value.clients?.length > 1 ? (
                          <Box>+{value.clients?.length - 1}</Box>
                        ) : null}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flex:
                          type === 'detail' &&
                          getValues('isPrioritized') === '0'
                            ? 0.286
                            : 0.264,
                        alignItems: 'center',
                        paddingLeft: '20px',
                      }}
                    >
                      <Box sx={{ display: 'flex', gap: '8px' }}>
                        {value.jobInfo && value.jobInfo.length ? (
                          <>
                            <JobTypeChip
                              type={value.jobInfo[0]?.jobType}
                              label={value.jobInfo[0]?.jobType}
                            />
                            <RoleChip
                              type={value.jobInfo[0]?.role}
                              label={value.jobInfo[0]?.role}
                            />
                          </>
                        ) : (
                          '-'
                        )}
                        {value.jobInfo?.length > 1 ? (
                          <ExtraNumberChip
                            label={`+${value.jobInfo?.slice(1).length}`}
                            size='small'
                          />
                        ) : null}
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        // padding: '16px 20px',
                        display: 'flex',
                        flex:
                          type === 'detail'
                            ? 0.168
                            : getValues('isPrioritized') === '1'
                              ? 0.0936
                              : 0.152,

                        alignItems: 'center',
                        paddingLeft: '20px',
                      }}
                    >
                      <Typography variant='body1'>
                        {value.experience}
                      </Typography>
                    </Box>
                    {type === 'detail' ? null : (
                      <Box
                        sx={{
                          // padding: '16px 20px',

                          display: 'flex',
                          flex: 0.048,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <IconButton sx={{ padding: 0, height: 'fit-content' }}>
                          <Icon
                            icon='mdi:close'
                            fontSize={20}
                            onClick={e => {
                              e.stopPropagation()
                              remove(index)
                            }}
                          ></Icon>
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                )
              })}
            </Box>
          )}
          {type === 'detail' ? null : (
            <Box sx={{ background: '#F7F8FF' }}>
              <Box
                sx={{
                  width: '100%',

                  display: 'flex',
                  paddingTop: '32px',
                  paddingBottom: '18px',
                  justifyContent: 'center',
                }}
              >
                <Button
                  sx={{
                    color: '#8D8E9A',
                    '&:hover': {
                      background: 'inherit',
                    },
                  }}
                  onClick={onClickAddPros}
                >
                  + Add Pros
                </Button>
              </Box>
            </Box>
          )}
          {type === 'detail' ? null : (
            <Box
              sx={{
                height: '100px',
                width: '100%',

                position: 'absolute',
                bottom: 0,
                padding: '32px 20px',
                background: '#FFFFFF',
              }}
            >
              {type === 'create' ? (
                <Box
                  sx={{
                    display: 'flex',
                    height: '100%',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Button
                    variant='outlined'
                    onClick={handleBack}
                    sx={{ width: 181 }}
                  >
                    Previous step
                  </Button>
                  <Button
                    variant='contained'
                    sx={{ width: 181 }}
                    onClick={onClickSave}
                    disabled={fields.length === 0}
                  >
                    Save
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant='contained'
                    sx={{ width: 181 }}
                    onClick={onClickSave}
                    disabled={fields.length === 0}
                  >
                    Save changes
                  </Button>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default SelectPro
