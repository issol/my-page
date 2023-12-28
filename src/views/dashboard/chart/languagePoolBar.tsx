import { useTheme } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'

import ReactApexcharts from '@src/@core/components/react-apexcharts'
import styled from '@emotion/styled'
import React, { useEffect, useMemo, useState } from 'react'
import { useLanguagePool } from '@src/queries/dashboard/dashnaord-lpm'
import { Box } from '@mui/material'
import { Title } from '@src/views/dashboard/dashboardItem'
import { ApexOptions } from 'apexcharts'
import OptionsMenu from '@src/@core/components/option-menu'
import { useRouter } from 'next/router'
import { CSVDataRecordProps } from '@src/types/dashboard'
import { getGloLanguage } from '@src/shared/transformer/language.transformer'
import find from 'lodash/find'
import { toCapitalize } from '@src/pages/dashboards/lpm'

interface TADLanguagePoolBarChartProps extends CSVDataRecordProps {
  setOpenInfoDialog: (open: boolean, key: string) => void
}

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

  const [series, labels, max] = useMemo(() => {
    const sliceData = data?.report.slice(
      page * rowsPerPage,
      page * rowsPerPage + 6,
    )

    let title = `${toCapitalize(filter)} Languages`
    if (filter === 'pair') title = 'Language Pairs'

    const seriesData = [
      {
        name: `${title}`,
        data: sliceData?.map(item => item.count) || [],
      },
    ]
    const labels =
      sliceData?.map(item => {
        if (filter === 'source') {
          return (
            find(gloLanguage, {
              value: item.sourceLanguage,
            })?.label || '-'
          )
        }

        if (filter === 'target')
          return (
            find(gloLanguage, {
              value: item.targetLanguage,
            })?.label || '-'
          )
        return [item.sourceLanguage, ` → ${item.targetLanguage}`]
      }) || []

    const max = Math.max(...seriesData[0].data)

    return [seriesData, labels, max]
  }, [data, page])

  //@ts-ignore
  // NOTE: dataLabel formmater 에 두줄 민드는 기능이 지원하나 타입스크립트에서 지원안함. 차후 CSS로 조정 필요
  const options: ApexOptions = useMemo(() => {
    const x = Number(max.toString(10)[0])
    const n = max.toString(10).slice(1).length
    const maxNumber = (x + 1) * Math.pow(10, n)

    const chartOffset = filter === 'pair' ? -5 : 0
    const xaxisOffset = filter === 'pair' ? 3 : 0
    const align = filter === 'pair' ? 'left' : 'right'

    return {
      chart: {
        width: '100%',
        toolbar: { show: false },
        offsetX: chartOffset,
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          barHeight: '70%',
          horizontal: true,
          distributed: true,
          startingShape: 'rounded',
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        textAnchor: 'start',
        style: {
          fontFamily: 'Inter',
          fontSize: '12px',
          fontWeight: 600,
          colors: ['#000'],
        },

        formatter: function (val, { seriesIndex, dataPointIndex, w }) {
          return [
            `${val}`,
            `(${
              data?.report[page * rowsPerPage + dataPointIndex].ratio || 0
            }%)`,
          ]
        },
        offsetY: -10,
        offsetX: 40,
      },
      grid: {
        strokeDashArray: 8,
        borderColor: theme.palette.divider,
        xaxis: {
          lines: { show: true },
        },
        yaxis: {
          lines: { show: false },
        },
      },
      colors: [
        '#666CFF',
        '#72E128',
        '#FDB528',
        '#26C6F9',
        '#FF4D49',
        '#6D788D',
      ],
      legend: { show: false },
      states: {
        hover: {
          filter: { type: 'none' },
        },
        active: {
          filter: { type: 'none' },
        },
      },
      tooltip: {
        enabled: true,
      },
      xaxis: {
        min: 0,
        max: maxNumber,
        axisTicks: { show: false },
        axisBorder: { show: false },
        categories: labels,
        tickAmount: 5,
      },
      yaxis: {
        labels: {
          align: align,
          offsetX: xaxisOffset,
          offsetY: 6,
          style: {
            fontFamily: 'Inter',
            fontWeight: 600,
            fontSize: '12px',
            cssClass: 'data-label',
            colors: theme.palette.text.primary,
          },
        },
      },
    }
  }, [labels])

  const getSubTitle = () => {
    if (filter === 'source') return 'Source languages'
    if (filter === 'target') return 'Target languages'
    return 'Language pairs'
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
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex' }}>
          <CustomBarChart
            type='bar'
            width={400}
            height={350}
            series={series}
            options={options}
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

const CustomBarChart = styled(ReactApexcharts)(() => {
  return {
    '& .apexcharts-canvas > svg': {
      width: 500,
    },
    '& .data-label': {
      fontSize: '12px',
      fontWeight: 600,
      textTransform: 'uppercase',
    },

    '& .apexcharts-data-labels text': {
      textAnchor: 'middle',
      dominantBaseline: 'middle',
    },

    '& .apexcharts-data-labels text > tspan:last-of-type': {
      fill: 'rgba(76, 78, 100, 0.60)',
      fontWeight: '400',
    },
  }
})

const CustomPagination = styled(TablePagination)(() => {
  return {
    position: 'absolute',
    right: '-20px',
    bottom: '-32px',
    width: '100%',
    minHeight: '50px !important',
    display: 'flex',
    justifyContent: 'flex-end',
    border: 'none',
    padding: '0 !important',
    margin: 0,

    '& .MuiTablePagination-displayedRows': {
      fontSize: '14px !important',
    },

    '& .MuiTablePagination-spacer, & .MuiTablePagination-input': {
      display: 'none !important',
    },
  }
})

export default TADLanguagePoolBarChart
