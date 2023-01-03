import React from 'react'
import { ComponentMeta } from '@storybook/react'
import Dialog from 'src/pages/components/dialogs'
import { Alert, Divider } from '@mui/material'

export default {
  title: 'Dialog/Dialogs',
  component: Dialog,
} as ComponentMeta<typeof Dialog>

export const Default = () => {
  return (
    <div>
      <Alert severity='info'>
        Dialog는 <code>open</code>이라는 prop이 <code>true</code>일 때만 열리는
        형태의 모달입니다. <br />
        Dialog를 사용하실 땐 페이지에 해당 컴포넌트를 심어놓고 <code>open</code>
        값을 디폴트로 <code>false</code>를 준 뒤, <br />
        Dialog를 보여줘야 할 때 <code>true</code>를 주어 동적으로 열리게
        만듭니다.
        <br />
        <strong>
          Dialog의 장점은, 부모 컴포넌트로부터 물려받은 state의 값이 변할 때마다
          동기적으로 그 값을 보여줄 수 있다는 것입니다.
          <br />
          반면, <code>ModalContext</code>를 사용해 열어주는 모달은,{' '}
          <code>setModal</code>을 할 시점의 state만을 보여줄 수 있습니다.
          <br />
          이것을 방지하려면 Modal컴포넌트 내부에 state를 심는 방법을 사용해야
          합니다.
        </strong>
      </Alert>
      <Divider />
      <Dialog />
    </div>
  )
}
