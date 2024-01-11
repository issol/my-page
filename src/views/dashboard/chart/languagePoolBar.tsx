import { useTheme } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'
import styled from '@emotion/styled'
import React, { useEffect, useMemo, useState } from 'react'
import { useLanguagePool } from '@src/queries/dashboard/dashnaord-lpm'
import { Box } from '@mui/material'
import { Title } from '@src/views/dashboard/dashboardItem'
import OptionsMenu from '@src/@core/components/option-menu'
import { useRouter } from 'next/router'
import { CSVDataRecordProps } from '@src/types/dashboard'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import find from 'lodash/find'

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import ChartDataLabels from 'chartjs-plugin-datalabels'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface TADLanguagePoolBarChartProps extends CSVDataRecordProps {
  setOpenInfoDialog: (open: boolean, key: string) => void
}

const DISPLAY = true
const CHART_AREA = true

const TADLanguagePoolBarChart = ({
  dataRecord,
  setDataRecord,
  setOpenInfoDialog,
}: TADLanguagePoolBarChartProps) => {
  const router = useRouter()
  const theme = useTheme()
  const gloLanguage = getGloLanguage()

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowPerPage] = React.useState(6)
  const [filter, setFilter] = useState<'source' | 'target' | 'pair'>('pair')

  const { data, isLoading } = useLanguagePool(filter)

  useEffect(() => {
    const filterLanguage = data?.report.map(item => {
      if (filter === 'source') {
        return {
          'Source languages': item?.sourceLanguage || '-',
          'Source languages Number?': item?.count || 0,
          'Source languages Percent?': item?.ratio || 0,
          ' ': '',
        }
      }

      if (filter === 'target') {
        return {
          'Target languages': item?.targetLanguage || '-',
          'Target languages Number': item?.count || 0,
          'Target languages Percent': item?.ratio || 0,
          ' ': '',
        }
      }

      return {
        'Source languages': item?.sourceLanguage || '-',
        'Target languages': item?.targetLanguage || '-',
        'Languages pair Number': item?.count || 0,
        'Languages pair Percent': item?.ratio || 0,
        ' ': '',
      }
    })
    setDataRecord(filterLanguage || [])
  }, [filter])

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowPerPage(parseInt(event.target.value, 10))
  }

  const [series, labels, seriesRatioData] = useMemo(() => {
    const sliceData = data?.report.slice(
      page * rowsPerPage,
      page * rowsPerPage + 6,
    )

    const seriesData = [
      {
        data: sliceData?.map(item => item.count) || [],
        backgroundColor: [
          '#787EFF',
          '#83E542',
          '#FDBE42',
          '#40CDFA',
          '#FF625F',
          '#6D788D',
        ],
        barThickness: 27,
      },
    ]

    const seriesRatioData = sliceData?.map(item => item.ratio) || []

    const labels =
      sliceData?.map(item => {
        if (filter === 'source') {
          let label = find(gloLanguage, {
            value: item.sourceLanguage,
          })?.label?.split('(')

          if (label && label[1]) {
            label[1] = `(${label[1]}`
          }

          return label || '-'
        }

        if (filter === 'target') {
          let label = find(gloLanguage, {
            value: item.targetLanguage,
          })?.label?.split('(')

          if (label && label[1]) {
            label[1] = `(${label[1]}`
          }

          return label || '-'
        }
        return [
          (item.sourceLanguage || '-').toUpperCase(),
          `→ ${item.targetLanguage || '-'}`.toUpperCase(),
        ]
      }) || []

    return [seriesData, labels, seriesRatioData]
  }, [data, page])

  const getSubTitle = () => {
    if (filter === 'source') return 'Source languages'
    if (filter === 'target') return 'Target languages'
    return 'Language pairs'
  }

  const chartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 0,
        borderRadius: 10,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            size: 14,
            weight: '600',
          },
        },
      },
      datalabels: {
        anchor: context => {
          const index = context.dataIndex
          const value = context.dataset.data[index] || 0
          if (value < 55) return 'end'
          return 'start'
        },
        align: 'start',
        clamp: true,
        offset: 10,
        font: {
          weight: 'bold',
        },
        labels: {
          name: {
            align: 'right',
            formatter: function (value, context) {
              return `${value}`
            },
            color: context => {
              const index = context.dataIndex
              const value = context.dataset.data[index] || 0
              if (value < 55) return '#4C4E64DE'
              return '#fff'
            },
          },
          value: {
            align: 'right',
            formatter: function (value, context) {
              return `(${seriesRatioData[context.dataIndex] || 0}%)`
            },
            color: context => {
              const index = context.dataIndex
              const value = context.dataset.data[index] || 0
              if (value < 55) return '#4C4E64DE'
              return '#fff'
            },
            offset: 35,
          },
        },
      },
    },
    scales: {
      x: {
        min: 0,
        max: 200,
        grid: {
          display: DISPLAY,
          drawOnChartArea: CHART_AREA,
          drawTicks: false,
          color: '#EAEAEC',
          borderDash: [10],
          drawBorder: false,
        },
      },
      y: {
        grid: {
          display: false,
          drawBorder: false,
        },
        ticks: {
          maxTicksLimit: 7,
          font: {
            size: 14,
            weight: '600',
          },
          crossAlign: 'far',
        },
      },
    },
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        marginTop: '20px',
      }}
    >
      <Box display='flex' justifyContent='space-between'>
        <Title
          title='Language pool'
          subTitle={`Total ${data?.totalCount || 0} ${getSubTitle()}`}
          openDialog={setOpenInfoDialog}
          handleClick={() => router.push('/pro')}
        />
        <Box>
          <OptionsMenu
            iconButtonProps={{ size: 'small', className: 'card-more-options' }}
            options={[
              {
                text: 'Language pairs',
                menuItemProps: {
                  onClick: () => {
                    setFilter('pair')
                    setPage(0)
                  },
                },
              },
              {
                text: 'Source languages',
                menuItemProps: {
                  onClick: () => {
                    setFilter('source')
                    setPage(0)
                  },
                },
              },
              {
                text: 'Target languages',
                menuItemProps: {
                  onClick: () => {
                    setFilter('target')
                    setPage(0)
                  },
                },
              },
            ]}
          />
        </Box>
      </Box>
      <div>
        <div style={{ display: 'flex', height: '330px' }}>
          <Bar
            plugins={[ChartDataLabels]}
            options={chartOptions}
            data={{
              labels,
              datasets: series,
            }}
          />
        </div>
        <CustomPagination
          count={data?.totalCount || 0}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
    </Box>
  )
}

const CustomPagination = styled(TablePagination)(() => {
  return {
    width: '100%',
    minHeight: '80px !important',
    display: 'flex',
    justifyContent: 'flex-end',
    border: 'none',
    padding: '0 !important',
    margin: 0,

    '& .MuiTablePagination-toolbar': {},

    '& .MuiTablePagination-displayedRows': {
      fontSize: '14px !important',
    },

    '& .MuiTablePagination-spacer, & .MuiTablePagination-input': {
      display: 'none !important',
    },
  }
})

export default TADLanguagePoolBarChart
