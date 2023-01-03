import { ComponentMeta } from '@storybook/react'

import React, { ReactNode, useContext } from 'react'
import { ModalContext } from 'src/context/ModalContext'
import SimpleModal from 'src/@core/components/modal'

import { Alert, Grid, Button } from '@mui/material'
import CardSnippet from 'src/@core/components/card-snippet'

export default {
  title: 'Dialog/Modal',
  component: SimpleModal,
  argTypes: {
    msg: {
      description:
        '모달에 보여줄 메시지를 string으로 전달하거나 ReactNode타입의 엘리먼트를 전달.',
      control: { type: 'text' },
      type: { name: 'string', required: true },
      defaultValue: 'This is simple form of modal.',
    },
    btnLabel: {
      description: '모달에 있는 버튼의 문구를 string으로 전달.',
      control: { type: 'text' },
      type: { name: 'string', required: true },
      defaultValue: 'Okay',
    },
    onClick: {
      description: '모달에 있는 버튼을 클릭했을 때의 액션을 함수로 전달.',
    },
  },
} as ComponentMeta<typeof SimpleModal>

type Props = {
  msg: string | ReactNode
  btnLabel: string
  onClick?: any
}
export const Default = (args: Props) => {
  const { setModal } = useContext(ModalContext)

  function handleOnClick() {
    setModal(<SimpleModal {...args} msg={args.msg} />)
  }
  return (
    <div>
      <Grid item xs={12}>
        <CardSnippet
          title='Modal'
          code={{
            tsx: source,
            jsx: source,
          }}
        >
          <Alert severity='info'>
            Modal은 <code>ModalContext</code>의 <code>setModal</code> 메소드를
            통해 간단하게 모달을 열 수 있습니다.
            <br />
            모달을 미리 페이지에 심어두고 open값을 조작할 필요 없이, <br />
            모달이 필요한 시점에 <code>setModal</code>함수에{' '}
            <code>ReactNode</code>
            타입의 엘리먼트를 전달해주면 됩니다.
            <br />
            <strong>
              <code>setModal</code>의 단점은, 부모 컴포넌트로부터 물려받은
              state의 값이 변할 때마다 동기적으로 그 값을 보여줄 수 없다는
              것입니다.
              <br />
              왜냐하면 부모로부터 물려받은 state의 값이
              <code>setModal</code>을 할 시점의 state로 고정되기 때문입니다.
              <br />
              이것을 방지하려면 Modal컴포넌트 내부에 state를 심는 방법을
              사용해야 합니다.
            </strong>
          </Alert>
          <Button
            variant='contained'
            onClick={handleOnClick}
            style={{ marginTop: '30px' }}
          >
            Show Modal
          </Button>
        </CardSnippet>
      </Grid>
    </div>
  )
}

const source = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`
import React, { ReactNode, useContext } from 'react'
import { ModalContext } from 'src/context/ModalContext'
import SimpleModal from 'src/@core/components/modal'
import { Button } from '@mui/material'

export const Default = (args: Props) => {
  const { setModal } = useContext(ModalContext)

  function handleOnClick() {
    setModal(<SimpleModal {...args} msg={args.msg} />)
  }
  return (
    <Button
      variant='contained'
      onClick={handleOnClick}
      style={{ marginTop: '30px' }}
    >
      Show Modal
    </Button>
  )
}

export default BarExample;
`}</code>
  </pre>
)
