import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardActionArea,
  CardHeader,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import { LinguistTeamListType } from '@src/types/pro/linguist-team'

import { v4 as uuidv4 } from 'uuid'
import { ServiceTypeChip } from '@src/@core/components/chips/chips'
import languageHelper from '@src/shared/helpers/language.helper'
import { Icon } from '@iconify/react'
import { DataGrid } from '@mui/x-data-grid'
import NoList from '@src/pages/components/no-list'
import { getLinguistTeamColumns } from '@src/shared/const/columns/linguist-team'
import { useRouter } from 'next/router'
import { MenuType } from '..'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { useInfiniteQuery } from 'react-query'
import { getLinguistTeamList } from '@src/apis/pro/linguist-team'
import { FilterType } from 'src/pages/pro/linguist-team/index'

type Props = {
  serviceTypeList: Array<{
    value: number
    label: string
  }>
  clientList: {
    clientId: number
    name: string
  }[]
  skip: number
  pageSize: number
  setPageSize: (num: number) => void
  setListCount: (num: number) => void
  activeFilter: FilterType
  page: number
  setPage: (num: number) => void
}

const LinguistTeamCardList = ({
  serviceTypeList,
  clientList,
  skip,
  pageSize,
  setPageSize,
  setListCount,
  activeFilter,
  page,
  setPage,
}: Props) => {
  const router = useRouter()
  const { ref, inView } = useInView()

  const {
    data: linguistCardList,
    fetchNextPage,
    hasNextPage,
    isLoading: isCardLoading,
    isFetchingNextPage,
    isError,
    refetch,
  } = useInfiniteQuery(
    'linguistCardList',
    ({ pageParam = 0 }) => 
      getLinguistTeamList({
        ...activeFilter,
        skip: pageParam,
        take: 12,
      }),
    {
      suspense: false,
      refetchInterval: 600000,
      refetchIntervalInBackground: true,
      refetchOnMount: 'always',
      refetchOnWindowFocus: 'always',
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.count === 12 && lastPage.totalCount > pages.length * 12) {
          return pages.length * lastPage.count
        }
      },
      retry: false,
    },
  )

  useEffect(() => {
    let listCount = 0
    if (linguistCardList?.pages && linguistCardList?.pages[0]?.totalCount) {
      listCount = linguistCardList?.pages[0]?.totalCount
    } 
    setListCount(listCount)
  }, [linguistCardList])

  // activeFilter가 변했을때 데이터 갱신이 useInfiniteQuery에서 처리되지 못해서 refetch로 대체
  useEffect(() => {
    // TODO: 생성, 삭제 후 리패치가 실행되서 서버에서 신규 데이터를 가져오긴 하지만
    // 페이지에는 이전 데이터로 반영되는 버그가 있음
    refetch()
  }, [activeFilter])

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [inView])

  return (
    <Box>
      <Divider />
      <Grid sx={{ marginTop: '-8px', padding: '20px', maxHeight: 600, overflow: 'auto' }} container spacing={6} rowSpacing={4}>
        {linguistCardList?.pages && linguistCardList?.pages[0]?.data?.length > 0 ? (
          linguistCardList?.pages.map(
            (page: { data: LinguistTeamListType[] }) => {
              return page.data.map(
                (item, index) => {
                  return (
                    <Grid key={uuidv4()} item lg={3} md={4} xs={4}>
                      <Card>
                        <CardActionArea
                          onClick={() => {
                            router.push(`/pro/linguist-team/detail/${item.id}`)
                          }}
                        >
                          <Box
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              padding: '20px',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                              }}
                            >
                              {item.isPrivate ? (
                                <Box
                                  sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: 20,
                                    height: 20,
                                    borderRadius: '5px',
                                    background: '#F7F7F9',
                                  }}
                                >
                                  <Icon icon='mdi:lock' color='#8D8E9A' />
                                </Box>
                              ) : null}

                              <Typography color='#8D8E9A' fontSize={12}>
                                {item.corporationId}
                              </Typography>
                            </Box>

                            <Typography
                              color='#4C4E64'
                              fontSize={16}
                              fontWeight={600}
                            >
                              {item.name}
                            </Typography>
                            <Typography color='#666CFF' fontSize={14}>
                              {clientList.find(
                                value => value.clientId === item.clientId,
                              )?.name ?? '-'}
                            </Typography>

                            <Box>
                              <ServiceTypeChip
                                label={
                                  serviceTypeList.find(
                                    i => i.value === item.serviceTypeId,
                                  )?.label || ''
                                }
                              />
                            </Box>
                            <Box
                              sx={{
                                overflow: 'hidden',
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis'
                              }}
                            >
                              <Typography
                                sx={{
                                  overflow: 'hidden',
                                  whiteSpace: 'nowrap',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {languageHelper(item.sourceLanguage)} &rarr;{' '}
                                {languageHelper(item.targetLanguage)}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                                mt: '8px',
                              }}
                            >
                              <AvatarGroup>
                                {item.pros.map((i, index) => {
                                  if (index > 2) return null
                                  return (
                                    <Avatar
                                      key={uuidv4()}
                                      sx={{
                                        width: 32,
                                        height: 32,
                                        fontSize: 14,
                                        border: `2px solid ${item.isPrivate ? '#4C4E6461' : index === 0 ? '#FFA6A4' : index === 1 ? '#B9F094' : index === 2 ? '#FEDA94' : '#FFF'} !important`,
                                        background: item.isPrivate
                                          ? '#ECECEE'
                                          : '#FFF',
                                      }}
                                    >
                                      {item.isPrivate
                                        ? ''
                                        : i.firstName?.charAt(0) +
                                          i.lastName?.charAt(0)}
                                    </Avatar>
                                  )
                                })}
                              </AvatarGroup>
                              {item.pros.length > 3 ? (
                                <Typography color='#8D8E9A' fontSize={14}>
                                  +{item.pros.length - 3} linguists
                                </Typography>
                              ) : null}
                            </Box>
                          </Box>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  )
                }
              )
            }
          )
        ) : (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              minHeight: '439px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography color='#8D8E9A' fontSize={14}>
              There are no linguist teams
            </Typography>
          </Box>
        )}
        {isFetchingNextPage ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <div ref={ref} style={{ height: '1px' }}></div>
        )}
      </Grid>
    </Box>
  )
}

export default LinguistTeamCardList
