import { Box, Typography } from '@mui/material'
import { JobRequestedProHistoryType } from '@src/types/jobs/jobs.type'
import { DataGrid } from '@mui/x-data-grid'
import NoList from 'src/pages/[companyName]/components/no-list'
import { getJobRequestedProColumns } from '@src/shared/const/columns/job-requested-pro'
import { v4 as uuidv4 } from 'uuid'
import { getLegalName } from '@src/shared/helpers/legalname.helper'
import FileItem from '@src/@core/components/fileItem'
import {
  DownloadAllFiles,
  DownloadFile,
} from '@src/shared/helpers/downlaod-file'
import { FileType } from '@src/types/common/file.type'
import { S3FileType } from '@src/shared/const/signedURLFileType'

type Props = {
  jobStatusList: {
    value: number
    label: string
  }[]
  requestedPro: JobRequestedProHistoryType
}

const HistoryRequestedPro = ({ jobStatusList, requestedPro }: Props) => {
  const fileList = (file: FileType[], type: string) => {
    return file.map((value: FileType) => {
      if (value.type === type) {
        return (
          <Box key={uuidv4()}>
            <FileItem
              key={value.name}
              file={value}
              onClick={() => DownloadFile(value, S3FileType.JOB)}
              size='small'
            />
          </Box>
        )
      }
    })
  }
  return (
    <Box
      sx={{ mt: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}
    >
      {requestedPro?.unassignedPros.length > 0 &&
        requestedPro?.unassignedPros.map(value => {
          return (
            <Box
              key={uuidv4()}
              sx={{
                border: '1px solid #D8D8DD',
                borderRadius: '10px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <Typography fontSize={14} fontWeight={600}>
                  Assigned Pro:
                </Typography>
                <Typography fontSize={14} fontWeight={400}>
                  {getLegalName({
                    firstName: value.firstName,
                    middleName: value.middleName,
                    lastName: value.lastName,
                  })}
                </Typography>
              </Box>
              <Box
                sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography fontSize={14} fontWeight={600}>
                    Source files
                  </Typography>
                  <Typography
                    color='#8D8E9A'
                    fontSize={14}
                    fontWeight={500}
                    sx={{ textDecoration: 'underline' }}
                    onClick={() =>
                      DownloadAllFiles(
                        value.files!.filter(value => value.type === 'SOURCE'),
                        S3FileType.JOB,
                      )
                    }
                  >
                    Download all
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display:
                      value.files && value.files.length ? 'grid' : 'none',
                    gridTemplateColumns: 'repeat(3, 1fr)',

                    width: '100%',
                    gap: '20px',
                  }}
                >
                  {value.files && fileList(value.files, 'SOURCE')}
                </Box>
              </Box>
            </Box>
          )
        })}
      <Box sx={{ border: '1px solid #D8D8DD', borderRadius: '10px' }}>
        {requestedPro.type === null ? null : (
          <Typography fontSize={16} fontWeight={600} sx={{ padding: '20px' }}>
            {requestedPro?.type === 'relayRequest'
              ? 'Relay request'
              : requestedPro?.type === 'bulkManualAssign'
                ? 'Mass request - Manual assignment'
                : requestedPro?.type === 'bulkAutoAssign'
                  ? 'Mass request - First come first serve'
                  : '-'}
            &nbsp;({requestedPro?.pros.length})
          </Typography>
        )}

        <Box
          sx={{
            '& .MuiDataGrid-columnHeaderTitle': {
              textTransform: 'none',
            },
            height: 350,
          }}
        >
          <DataGrid
            // autoHeight
            rowHeight={54}
            components={{
              NoRowsOverlay: () => NoList('There are no requested pros'),
              NoResultsOverlay: () => NoList('There are no requested pros'),
            }}
            sx={{
              borderRadius: 0,
              '& .MuiDataGrid-columnHeaders': {
                borderRadius:
                  requestedPro.type === null ? '10px 10px 0 0' : '0 !important',
              },
            }}
            // sx={{
            //   overflowY: 'scroll',
            //   height: '100%',
            // }}
            columns={getJobRequestedProColumns(jobStatusList)}
            rows={requestedPro?.pros ?? []}
            rowCount={requestedPro?.pros.length ?? 0}
            getRowId={row => row.userId}
            disableSelectionOnClick
            hideFooter
          />
        </Box>
      </Box>
    </Box>
  )
}

export default HistoryRequestedPro
