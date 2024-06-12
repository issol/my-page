import {
  Button,
  Card,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  styled,
} from '@mui/material'
import Box from '@mui/material/Box'

import {
  CatInterfaceParams,
  PriceUnitListType,
  PriceUnitListWithHeaders,
  StandardPriceListType,
} from '@src/types/common/standard-price'
import { v4 as uuidv4 } from 'uuid'

import IconButton from '@mui/material/IconButton'
import Icon from '@src/@core/components/icon'
import {
  useState,
  MouseEvent,
  useEffect,
  SetStateAction,
  Dispatch,
} from 'react'
import TextField from '@mui/material/TextField'
import { CatInterfaceChip } from '@src/@core/components/chips/chips'
import { useGetCatInterfaceHeaders } from '@src/queries/company/standard-price'

type Props = {
  priceUnitList: PriceUnitListType[]
  priceData: StandardPriceListType
  existPriceUnit: boolean
  setSelectedPrice: Dispatch<SetStateAction<StandardPriceListType | null>>
}
const CatInterface = ({
  priceUnitList,
  priceData,
  existPriceUnit,
  setSelectedPrice,
}: Props) => {
  const [alignment, setAlignment] = useState<string>('Phrase')
  const [editing, setEditing] = useState(false)

  const { data: catInterface, isLoading } = useGetCatInterfaceHeaders(
    alignment!,
  )

  const [originalHeaders, setOriginalHeaders] = useState<{
    Phrase: PriceUnitListWithHeaders[]
    memoQ: PriceUnitListWithHeaders[]
  }>({ Phrase: [], memoQ: [] })
  const [priceUnitListWithHeaders, setPriceUnitListWithHeaders] = useState<{
    Phrase: PriceUnitListWithHeaders[]
    memoQ: PriceUnitListWithHeaders[]
  }>({ Phrase: [], memoQ: [] })

  const [editingItemId, setEditingItemId] = useState<number | null>(null)

  const handleAlignment = (
    event: MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment)
  }

  const handleItemChange = (id: number, field: string, value: string) => {
    if (id === editingItemId) {
      if (alignment === 'Phrase') {
        setPriceUnitListWithHeaders(prevState => {
          const res = prevState.Phrase.map(obj => {
            if (obj.id === id) {
              return {
                ...obj,
                perWords: value ? Number(value) : null,
              }
            } else {
              return obj
            }
          })
          return { ...prevState, Phrase: res }
        })
      } else if (alignment === 'memoQ') {
        setPriceUnitListWithHeaders(prevState => {
          const res = prevState.memoQ.map(obj => {
            if (obj.id === id) {
              return {
                ...obj,
                perWords: value ? Number(value) : null,
              }
            } else {
              return obj
            }
          })
          return { ...prevState, memoQ: res }
        })
      }
    }
  }

  const handleFocus = (id: number) => {
    setEditingItemId(id)
  }

  const handleBlur = () => {
    setEditingItemId(null)
  }

  const onClickEditCatInterface = () => {
    setEditing(true)
  }

  const onClickSaveEditCatInterface = () => {
    const phrase: CatInterfaceParams[] = priceUnitListWithHeaders.Phrase.map(
      value => ({
        priceUnitPairId: value.priceUnitPairId,
        priceUnitTitle: value.title,
        priceUnitPrice: value.price!,
        priceUnitQuantity: value.quantity!,
        priceUnitUnit: value.unit!,
        perWords: value.perWords!,
        chips: value.chips.map(obj => ({
          title: obj.title,
          selected: obj.selected,
        })),
      }),
    )

    const memoQ: CatInterfaceParams[] = priceUnitListWithHeaders.memoQ.map(
      value => ({
        priceUnitPairId: value.priceUnitPairId,
        priceUnitTitle: value.title,
        priceUnitPrice: value.price!,
        priceUnitQuantity: value.quantity!,
        priceUnitUnit: value.unit!,
        perWords: value.perWords!,
        chips: value.chips.map(obj => ({
          title: obj.title,
          selected: obj.selected,
        })),
      }),
    )
    const data = {
      phrase: phrase,
      memoQ: memoQ,
    }

    //@ts-ignore
    setSelectedPrice({ ...priceData, catInterface: data })
    setEditing(false)
  }

  const onClickRangeChip = (
    data: { id: number; title: string; selected: boolean },
    value: PriceUnitListWithHeaders,
  ) => {
    if (alignment === 'Phrase') {
      setPriceUnitListWithHeaders(prevState => {
        const res = prevState.Phrase.map(obj => {
          if (obj.id === value.id) {
            const tmp = obj.chips.map(obj2 => {
              if (obj2.id === data.id) {
                return {
                  ...obj2,
                  selected: !obj2.selected,
                  tmpSelected: !obj2.tmpSelected,
                }
              } else {
                return obj2
              }
            })

            return { ...obj, chips: tmp }
          } else {
            return obj
          }
        })

        if (res) {
          return { ...prevState, Phrase: res }
        } else {
          return prevState
        }
      })
    } else if (alignment === 'memoQ') {
      setPriceUnitListWithHeaders(prevState => {
        const res = prevState.memoQ.map(obj => {
          if (obj.id === value.id) {
            const tmp = obj.chips.map(obj2 => {
              if (obj2.id === data.id) {
                return {
                  ...obj2,
                  selected: !obj2.selected,
                  tmpSelected: !obj2.tmpSelected,
                }
              } else {
                return obj2
              }
            })

            return { ...obj, chips: tmp }
          } else {
            return obj
          }
        })

        if (res) {
          return { ...prevState, memoQ: res }
        } else {
          return prevState
        }
      })
    }
  }

  useEffect(() => {
    let phrase: PriceUnitListWithHeaders[] = []
    let memoQ: PriceUnitListWithHeaders[] = []

    if (!isLoading && catInterface && priceUnitList.length > 0 && priceData) {
      /* @ts-ignore */
      const formattedHeader = catInterface.headers.map((value, idx) => ({
        id: idx,
        title: value,
        selected: false,
        tmpSelected: false,
      }))

      const withHeaders = priceUnitList.map(value => ({
        id: value.id,
        priceUnitPairId: value.id,
        title: value.title,
        quantity: value.quantity!,
        perWords: 1,
        price: value.price,
        unit: value.unit,
        chips: formattedHeader,
      }))

      phrase = priceData.catInterface!.phrase.length
        ? [
            ...priceData.catInterface!.phrase.map(value => ({
              id: value.id,
              priceUnitPairId: value.priceUnitPairId,
              title: value.priceUnitTitle,
              quantity: value.priceUnitQuantity,
              price: value.priceUnitPrice,
              unit: value.priceUnitUnit,
              perWords: value.perWords,
              chips: value.chips.map((data, idx) => ({
                id: idx,
                title: data.title,
                selected: data.selected,
                tmpSelected: false,
              })),
            })),
            ...withHeaders.filter(
              value =>
                !priceData
                  .catInterface!.phrase.map(data => data.priceUnitTitle)
                  .includes(value.title),
            ),
          ]
        : withHeaders

      memoQ = priceData.catInterface!.memoQ.length
        ? [
            ...priceData.catInterface!.memoQ.map(value => ({
              id: value.id,
              priceUnitPairId: value.priceUnitPairId,
              title: value.priceUnitTitle,
              quantity: value.priceUnitQuantity,
              price: value.priceUnitPrice,
              unit: value.priceUnitUnit,
              perWords: value.perWords,
              chips: value.chips.map((data, idx) => ({
                id: idx,
                title: data.title,
                selected: data.selected,
                tmpSelected: false,
              })),
            })),
            ...withHeaders.filter(
              value =>
                !priceData
                  .catInterface!.phrase.map(data => data.priceUnitTitle)
                  .includes(value.title),
            ),
          ]
        : withHeaders
    } else if (!isLoading && catInterface && priceUnitList.length === 0) {
      const formattedHeader = catInterface.headers.map((value, idx) => ({
        id: idx,
        title: value,
        selected: false,
        tmpSelected: false,
      }))

      memoQ = phrase = [
        {
          id: 0,
          priceUnitPairId: 0,
          title: '-',
          quantity: null,
          perWords: null,
          price: null,
          unit: null,
          chips: formattedHeader,
        },
      ]
    }

    setPriceUnitListWithHeaders({ Phrase: phrase, memoQ })
    setOriginalHeaders({ Phrase: phrase, memoQ })
  }, [catInterface, isLoading, priceUnitList, priceData])

  return (
    <Card
      sx={{
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Typography variant='h6'>CAT Interface</Typography>
          <Box>
            <ToggleGroup
              exclusive
              color='primary'
              value={alignment}
              onChange={handleAlignment}
              sx={{
                border: '1px solid #666CFF',
              }}
            >
              <ToggleButton
                value='Phrase'
                sx={{ color: '#666CFF', textTransform: 'none !important' }}
              >
                Phrase
              </ToggleButton>
              <ToggleButton
                value='memoQ'
                sx={{ color: '#666CFF', textTransform: 'none !important' }}
              >
                memoQ
              </ToggleButton>
            </ToggleGroup>
          </Box>
        </Box>

        {editing ? (
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Button
              variant='contained'
              color='secondary'
              sx={{
                width: '36px',
                height: '36px',
                minWidth: '36px !important',
              }}
              onClick={() => {
                setPriceUnitListWithHeaders({ ...originalHeaders })
                setEditing(false)
              }}
            >
              <img
                src='/images/icons/price-icons/interface-cancel.svg'
                alt=''
              />
            </Button>
            <Button
              variant='contained'
              sx={{
                width: '36px',
                height: '36px',
                minWidth: '36px !important',
              }}
              onClick={onClickSaveEditCatInterface}
            >
              <img src='/images/icons/price-icons/interface-check.svg' alt='' />
            </Button>
          </Box>
        ) : !editing && existPriceUnit ? (
          <IconButton onClick={onClickEditCatInterface}>
            <Icon icon='mdi:pencil-outline'></Icon>
          </IconButton>
        ) : null}
      </Box>
      <Box sx={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
        {alignment === 'Phrase'
          ? priceUnitListWithHeaders.Phrase.map(obj => {
              return (
                <Box
                  key={uuidv4()}
                  sx={{
                    border: '1px solid rgba(76, 78, 100, 0.22)',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                      {obj.price ?? ''}
                      &nbsp;
                      {obj.title === '-' ? '' : priceData.currency}
                      &nbsp;{obj.title === '-' ? '' : 'per'}&nbsp;
                      {obj.unit && obj.unit === 'Percent' ? 1 : obj.quantity}
                      &nbsp;
                      {obj.unit && obj.unit !== 'Percent'
                        ? obj.unit
                        : obj.unit && obj.unit === 'Percent'
                          ? ''
                          : ''}
                      &nbsp;
                      {obj.title}
                    </Typography>
                    <Box
                      sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                      {obj.title === '-' ? (
                        '-'
                      ) : (
                        <TextField
                          autoComplete='off'
                          value={obj.perWords}
                          onFocus={() => handleFocus(obj.id)}
                          onBlur={handleBlur}
                          autoFocus={obj.id === editingItemId}
                          disabled={!editing}
                          error={obj.perWords === null}
                          onChange={e => {
                            const { value } = e.target

                            const filteredValue = value
                              .replace(/[^0-9]/g, '') // 숫자만 입력 가능하도록 필터링
                              .slice(0, 10)
                            e.target.value = filteredValue
                            handleItemChange(obj.id, 'words', filteredValue)
                          }}
                          id='controlled-text-field'
                          InputProps={{
                            style: {
                              width: '42px',
                              height: '30px',
                            },
                          }}
                          sx={{
                            input: {
                              textAlign: 'center',
                              padding: '0 12px',
                            },
                            '.Mui-disabled': {
                              opacity: 1,
                              color: 'black',
                              input: {
                                color: 'rgba(76, 78, 100, 0.87)',
                                '-webkit-text-fill-color':
                                  'rgba(76, 78, 100, 0.87)',
                              },
                            },
                          }}
                        />
                      )}

                      <Typography variant='body2' sx={{}}>
                        Words
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '1%', overflow: 'scroll' }}>
                    {obj.chips.map(data => {
                      return (
                        <CatInterfaceChip
                          label={data.title}
                          size='medium'
                          clickable={editing}
                          status={data.selected}
                          key={uuidv4()}
                          sx={{
                            display: 'flex',
                            '& .Mui-disabled': { opacity: 1 },
                          }}
                          onClick={() => {
                            editing ? onClickRangeChip(data, obj) : null
                          }}
                          icon={
                            data.tmpSelected ? (
                              <img
                                src='/images/icons/price-icons/check-chip.svg'
                                alt=''
                              />
                            ) : undefined
                          }
                        />
                      )
                    })}
                  </Box>
                </Box>
              )
            })
          : priceUnitListWithHeaders.memoQ.map(obj => {
              return (
                <Box
                  key={uuidv4()}
                  sx={{
                    border: '1px solid rgba(76, 78, 100, 0.22)',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>
                      {obj.price ?? ''}
                      &nbsp;
                      {obj.title === '-' ? '' : priceData.currency}
                      &nbsp;{obj.title === '-' ? '' : 'per'}&nbsp;
                      {obj.unit && obj.unit === 'Percent' ? 1 : obj.quantity}
                      &nbsp;
                      {obj.unit && obj.unit !== 'Percent'
                        ? obj.unit
                        : obj.unit && obj.unit === 'Percent'
                          ? ''
                          : ''}
                      &nbsp;
                      {obj.title}
                    </Typography>
                    <Box
                      sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}
                    >
                      {obj.title === '-' ? (
                        '-'
                      ) : (
                        <TextField
                          autoComplete='off'
                          value={obj.perWords}
                          onFocus={() => handleFocus(obj.id)}
                          onBlur={handleBlur}
                          autoFocus={obj.id === editingItemId}
                          disabled={!editing}
                          error={obj.perWords === null}
                          onChange={e => {
                            const { value } = e.target

                            const filteredValue = value
                              .replace(/[^0-9]/g, '') // 숫자만 입력 가능하도록 필터링
                              .slice(0, 10)
                            e.target.value = filteredValue
                            handleItemChange(obj.id, 'words', filteredValue)
                          }}
                          id='controlled-text-field'
                          InputProps={{
                            style: {
                              width: '42px',
                              height: '30px',
                            },
                          }}
                          sx={{
                            input: {
                              textAlign: 'center',
                              padding: '0 12px',
                            },
                            '.Mui-disabled': {
                              opacity: 1,
                              color: 'black',
                              input: {
                                color: 'rgba(76, 78, 100, 0.87)',
                                '-webkit-text-fill-color':
                                  'rgba(76, 78, 100, 0.87)',
                              },
                            },
                          }}
                        />
                      )}

                      <Typography variant='body2' sx={{}}>
                        Words
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: 'flex', gap: '1%', overflow: 'scroll' }}>
                    {obj.chips.map(data => {
                      return (
                        <CatInterfaceChip
                          label={data.title}
                          size='medium'
                          clickable={editing}
                          status={data.selected}
                          key={uuidv4()}
                          sx={{
                            display: 'flex',
                            '& .Mui-disabled': { opacity: 1 },
                          }}
                          onClick={() => {
                            editing ? onClickRangeChip(data, obj) : null
                          }}
                          icon={
                            data.tmpSelected ? (
                              <img
                                src='/images/icons/price-icons/check-chip.svg'
                                alt=''
                              />
                            ) : undefined
                          }
                        />
                      )
                    })}
                  </Box>
                </Box>
              )
            })}
      </Box>
    </Card>
  )
}

export const ToggleGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  height: '38px',
  '& .MuiToggleButtonGroup-groupedHorizontal:not(:first-of-type".)': {
    borderLeftColor: '#666CFF', // 가운데 선의 색상을 변경할 수 있습니다.
  },
}))

export default CatInterface
