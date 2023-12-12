import { useTheme } from '@mui/material/styles'
import TablePagination from '@mui/material/TablePagination'

import { ApexOptions } from 'apexcharts'

import ReactApexcharts from '@src/@core/components/react-apexcharts'
import styled from '@emotion/styled'
import React, { useMemo, useState } from 'react'
import { useLanguagePool } from '@src/queries/dashboard/dashnaord-lpm'
import { Box } from '@mui/material'
import { Title } from '@src/views/dashboard/dashboardItem'

interface TADLanguagePoolBarChartProps {
  setOpenInfoDialog: (open: boolean, key: string) => void
}

const TADLanguagePoolBarChart = ({
  setOpenInfoDialog,
}: TADLanguagePoolBarChartProps) => {
  const theme = useTheme()

  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowPerPage] = React.useState(6)
  const [filter, setFilter] = useState<'source' | 'target' | 'pair'>('pair')

  const { data, isLoading, isFetching } = useLanguagePool('pair')

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

  const [series, labels] = useMemo(() => {
    const sliceData = data?.report.slice(
      page * rowsPerPage,
      page * rowsPerPage + 6,
    )

    const seriesData = [
      {
        name: 'series',
        data: sliceData?.map(item => item.count) || [],
      },
    ]
    const labels =
      sliceData?.map(item => {
        if (filter === 'source') return item.sourceLanguage
        if (filter === 'target') return item.targetLanguage
        return [item.sourceLanguage, `-> ${item.targetLanguage}`]
      }) || []

    return [seriesData, labels]
  }, [data, page])

  const options: ApexOptions = useMemo(() => {
    const max = Math.max(...series[0].data)

    return {
      chart: {
        redrawOnParentResize: true,
        width: '100%',
        parentHeightOffset: 30,
        toolbar: { show: false },
        offsetX: -8,
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
          fontSize: '14px',
          fontWeight: 600,
          colors: ['#000'],
        },
        formatter: function (val, opt) {
          return `${val}`
        },
        offsetY: 0,
        offsetX: 24,
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
        max: Math.ceil(max / 100) * 100,
        axisTicks: { show: false },
        axisBorder: { show: false },
        categories: labels,
        tickAmount: 5,
        labels: {},
      },
      yaxis: {
        labels: {
          align: 'left',
          offsetY: 6,
          style: {
            fontWeight: 600,
            fontSize: '14px',
            cssClass: 'data-label',
            colors: theme.palette.text.primary,
          },
        },
      },
    }
  }, [labels])

  return (
    <Box sx={{ width: '100%', height: '100%', marginTop: '20px' }}>
      <Box>
        <Title
          title='Language pool'
          subTitle={`Total ${data?.totalCount || 0} Language pairs`}
          openDialog={setOpenInfoDialog}
        />
      </Box>
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex' }}>
          <CustomBarChart
            type='bar'
            width={390}
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
    '& .data-label': {
      fontSize: '14px',
      fontWeight: 600,
      textTransform: 'uppercase',
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
