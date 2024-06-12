import { styled } from '@mui/system'
import Image from 'next/image'

type Props = {
  listCount: number
  page: number
  handleChangePage: (direction: string) => void
  rowsPerPage: number
  isPreviousData?: boolean
}

const Pagination = ({
  listCount,
  page,
  handleChangePage,
  rowsPerPage,
  isPreviousData,
}: Props) => {
  const isOverPage = (page: number, number: number) => {
    if (number >= rowsPerPage) {
      const isInteger = number % 1 === 0
      const result = isInteger
        ? number / rowsPerPage - 1
        : Math.floor(number / rowsPerPage)

      return page === result
    } else {
      return true
    }
  }

  function isEndOfList() {
    return Math.min(rowsPerPage * (page + 1), listCount) === listCount
  }

  return (
    <PaginationContainer>
      {`${page * rowsPerPage + 1} - ${
        listCount > rowsPerPage
          ? Math.min(rowsPerPage * (page + 1), listCount)
          : listCount
      } of ${listCount}`}
      {/* <PaginationButton
        type='button'
        onClick={() => handleChangePage('first')}
        disabled={page === 0}
      >
        <Image
          src='/image/icon/icon-first-arrow.png'
          width={11}
          height={11}
          alt='<'
          quality={100}
        />
      </PaginationButton> */}
      <PaginationButton
        type='button'
        onClick={() => handleChangePage('prev')}
        disabled={page === 0}
      >
        <img
          src='/images/icons/onboarding-icons/icon-prev.png'
          // width={7}
          // height={11}
          // alt='<'
          // quality={100}
        />
      </PaginationButton>
      <PaginationButton
        type='button'
        onClick={() => handleChangePage('next')}
        // disabled={isPreviousData || isOverPage(page, listCount)}
        disabled={isEndOfList()}
      >
        <img src='/images/icons/onboarding-icons/icon-next.png' />
      </PaginationButton>
      {/* <PaginationButton
        type='button'
        onClick={() => handleChangePage('last')}
        // disabled={isPreviousData || isOverPage(page, listCount)}
        disabled={isEndOfList()}
      >
        <Image
          src='/image/icon/icon-last-arrow.png'
          width={11}
          height={11}
          alt='<'
          quality={100}
        />
      </PaginationButton> */}
    </PaginationContainer>
  )
}

const PaginationContainer = styled('div')`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 16px;
  gap: 10px;
  font-weight: 400;
  font-size: 14px;
`

const PaginationButton = styled('button')`
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  border: none;
  background-color: white;
  align-items: center;
  justify-content: center;

  &:disabled {
    cursor: default;
    opacity: 0.4;
  }
`

export default Pagination
