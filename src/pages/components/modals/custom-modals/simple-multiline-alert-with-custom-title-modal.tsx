import { Box, Button, Typography } from '@mui/material'
import AlertIcon, { AlertType } from '@src/@core/components/alert-icon'
import { SmallModalContainer } from '@src/pages/client/components/modals/add-confirm-with-title-modal'
import Dialog from '@mui/material/Dialog'
import { Fragment } from 'react'
import { styled } from '@mui/system'

type Props = {
  vary?: AlertType
  message: string
  title: string[]
  closeButtonText?: string
  confirmButtonText?: string
  onClose: () => void
  onConfirm?: () => void
}

/**
 *
 * @param vary: error, info, successful, error-report, progress, question-info
 * 기본 버튼은 onClose, onClose만 있을때는 variant가 contained로 설정됨
 * \n 문자열로 줄바꿈 설정 가능
 * title은 메세지와 버튼 사이에 굵은 글씨로 나타나는 텍스트임, \n으로 줄바꿈 설정 가능, 3번째 줄부터 ... 처리됨
 */

export default function SimpleMultilineAlertWithCumtomTitleModal({
  vary = 'error',
  message,
  title,
  closeButtonText,
  confirmButtonText,
  onClose,
  onConfirm,
}: Props) {
  const newMessage = message.split('\n').map((line, index) => (
    <Fragment key={index}>
      {line}
      <br />
    </Fragment>
  ))

  let hiddenLineCount = title.length - 3 > 0 ? title.length - 3 : 0
  const lengthFixedTitle = [...title]
  if (lengthFixedTitle.length >= 3) lengthFixedTitle.length = 3

  const newTitle = lengthFixedTitle.map((line, index) => (
    <Fragment key={index}>
      {line}
      <br />
    </Fragment>
  ))

  return (
    <Dialog
      onClose={onClose}
      aria-labelledby='simple-multiline-alert-modal'
      open={true}
    >
      <SmallModalContainer>
        <AlertIcon type={vary} />
        {newMessage}
        {newTitle ? (
          <TitleTypography
            mt='8px'
            variant='body2'
            fontSize='1rem'
            fontWeight='bold'
          >
            {newTitle}
          </TitleTypography>
        ) : null}
        {newTitle && hiddenLineCount > 0 ? `+ ${hiddenLineCount} more` : null}
        <Box display='flex' gap='10px' justifyContent='center' mt='26px'>
          <Button
            variant={onConfirm ? 'outlined' : 'contained'}
            onClick={onClose}
          >
            {closeButtonText ?? 'Okay'}
          </Button>
          {onConfirm ? (
            <Button
              variant='contained'
              onClick={() => {
                onClose()
                onConfirm()
              }}
            >
              {confirmButtonText ?? 'Confirm'}
            </Button>
          ) : null}
        </Box>
      </SmallModalContainer>
    </Dialog>
  )
}

export const TitleTypography = styled(Typography)`
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
`
