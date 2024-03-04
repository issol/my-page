import { Box, Tooltip, Typography } from '@mui/material'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import { JobTemplateListType } from '@src/types/jobs/job-template.type'
import Image from 'next/image'

type CellType = {
  row: JobTemplateListType
}

export const getJobTemplateColumns = (
  serviceTypeList: Array<{ value: number; label: string }>,
) => {
  const columns = [
    {
      field: 'corporationId',
      flex: 0.144,
      disableColumnMenu: true,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          No.
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Tooltip title={row.corporationId}>
            <Typography fontSize={14} variant='body1' fontWeight={400}>
              {row.corporationId}
            </Typography>
          </Tooltip>
        )
      },
    },
    {
      flex: 0.232,
      field: 'name',

      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Template name
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Typography fontSize={14} variant='body1' fontWeight={400}>
            {row.name}
          </Typography>
        )
      },
    },
    {
      flex: 0.624,
      field: 'serviceType',

      hideSortIcons: true,
      disableColumnMenu: true,
      sortable: false,
      renderHeader: () => (
        <Typography variant='subtitle1' fontWeight={500} fontSize={14}>
          Service type
        </Typography>
      ),
      renderCell: ({ row }: CellType) => {
        return (
          <Box sx={{ display: 'flex', gap: '8px' }}>
            {row.options.map((option, index) => {
              return (
                <Box
                  key={index}
                  sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                >
                  <ServiceTypeChip
                    label={
                      serviceTypeList.find(
                        value => value.value === option.serviceTypeId,
                      )
                        ? serviceTypeList.find(
                            value => value.value === option.serviceTypeId,
                          )?.label
                        : '-'
                    }
                    size='small'
                  />
                  {option.autoNextJob ? (
                    <Image
                      src='/images/icons/job-icons/trigger.svg'
                      alt=''
                      width={24}
                      height={24}
                    ></Image>
                  ) : null}
                </Box>
              )
            })}
          </Box>
        )
      },
    },
  ]
  return columns
}
