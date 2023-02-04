import { useEffect, useState } from 'react'

// ** mui
import { Grid, Typography } from '@mui/material'

// ** components
import PageHeader from 'src/@core/components/page-header'
import Filters from '../components/client-guideline/filter'
import ClientGuideLineList from '../components/client-guideline/list'

// ** fetch
import { useGetGuideLines } from 'src/queries/client-guideline.query'

import isEqual from 'lodash/isEqual'

export type FilterType = {
  client?: Array<string>
  category?: Array<string>
  serviceType?: Array<string>
  title?: string
  content?: string
  skip: number
  pageSize: number
}

export type FilterOmitType = Omit<FilterType, 'skip' | 'pageSize'>

export const initialFilter: FilterOmitType = {
  client: [],
  category: [],
  serviceType: [],
  title: '',
  content: '',
}
export default function ClientGuidLines() {
  const [filter, setFilter] = useState<FilterOmitType>({
    ...initialFilter,
  })
  const [skip, setSkip] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [search, setSearch] = useState(true)

  const { data, refetch } = useGetGuideLines(
    { ...filter, skip, pageSize },
    search,
    setSearch,
  )

  useEffect(() => {
    refetch()
  }, [skip, pageSize])

  // const handleChangePage = (direction: string) => {
  //   const changedPage =
  //     direction === 'prev'
  //       ? Math.max(skip - 1, 0)
  //       : direction === 'next'
  //       ? skip + 1
  //       : direction === 'first'
  //       ? 0
  //       : direction === 'last' && Math.floor(invoice?.count / ROWS_PER_PAGE)
  //   setSkip(changedPage)
  // }

  function onReset() {
    setFilter({ ...initialFilter })
  }

  useEffect(() => {
    let mounted = true
    if (mounted) {
      if (isEqual(initialFilter, filter)) {
        refetch()
      }
    }
    return (): void => {
      mounted = false
    }
  }, [filter])

  console.log(search)

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={<Typography variant='h5'>Client guidelines</Typography>}
      />
      <Filters
        filter={filter}
        setFilter={setFilter}
        onReset={onReset}
        search={() => setSearch(true)}
      />
      <ClientGuideLineList
        skip={skip}
        setSkip={setSkip}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </Grid>
  )
}

ClientGuidLines.acl = {
  action: 'read',
  subject: 'onboarding',
}
