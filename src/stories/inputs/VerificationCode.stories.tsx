import { ComponentMeta } from '@storybook/react'
import { Alert, Grid } from '@mui/material'
import CardSnippet from 'src/@core/components/card-snippet'

import React, { ChangeEvent, useState } from 'react'
import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
import { styled } from '@mui/material/styles'
import Cleave from 'cleave.js/react'

export default {
  title: 'Input Fields/Verification Code',
  component: Cleave,
} as ComponentMeta<typeof Cleave>

export const Default = () => {
  const [isBackspace, setIsBackspace] = useState<boolean>(false)
  /* 원하는 form으로 data를 바꾸어도 됨 */
  const defaultValues: { [key: string]: string } = {
    val1: '',
    val2: '',
    val3: '',
    val4: '',
    val5: '',
    val6: '',
  }
  const CleaveInput = styled(Cleave)(({ theme }) => ({
    maxWidth: 50,
    textAlign: 'center',
    height: '50px !important',
    fontSize: '150% !important',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '&:not(:last-child)': {
      marginRight: theme.spacing(2),
    },
    '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
      margin: 0,
      WebkitAppearance: 'none',
    },
  }))

  const handleChange = (event: ChangeEvent) => {
    if (!isBackspace) {
      /* 여기에서 setState수행 */

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (
        form.length !== index + 1 &&
        form[index].value &&
        form[index].value.length
      ) {
        form.elements[index + 1].focus()
      } else {
        return
      }
      event.preventDefault()
    }
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Backspace') {
      setIsBackspace(true)

      // @ts-ignore
      const form = event.target.form
      const index = [...form].indexOf(event.target)
      if (index >= 1) {
        if (!(form[index].value && form[index].value.length)) {
          form.elements[index - 1].focus()
        }
      }
    } else {
      setIsBackspace(false)
    }
  }

  const renderInputs = () => {
    return Object.keys(defaultValues).map((val, index) => {
      return (
        <CleaveInput
          key={index}
          // value={val}
          options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
          /* @ts-ignore */
          onKeyDown={handleKeyDown}
          onChange={(event: ChangeEvent) => handleChange(event)}
        />
      )
    })
  }
  return (
    <>
      <Grid item xs={12}>
        <CardSnippet
          title='Verification Code'
          code={{
            tsx: source,
            jsx: source,
          }}
        >
          <Alert severity='info'>
            하단의 코드는 예시입니다. 컴포넌트 명과 데이터, 컬럼의 값은 필요한
            값으로 대체하여 사용해주세요.
          </Alert>
          <div style={{ marginTop: '14px' }}>
            <form>
              <CleaveWrapper>{renderInputs()}</CleaveWrapper>
            </form>
          </div>
        </CardSnippet>
      </Grid>
    </>
  )
}
const source = (
  <pre className='language-jsx'>
    <code className='language-jsx'>{`
  // ** Custom Components Imports
  import React, { ChangeEvent, useState } from 'react'
  import CleaveWrapper from 'src/@core/styles/libs/react-cleave'
  import { styled } from '@mui/material/styles'
  import Cleave from 'cleave.js/react'
  

  export const Default = () => {
    const [isBackspace, setIsBackspace] = useState<boolean>(false)
    /* 원하는 form으로 data를 바꾸어도 됨 */
    const defaultValues: { [key: string]: string } = {
      val1: '',
      val2: '',
      val3: '',
      val4: '',
      val5: '',
      val6: '',
    }
    const CleaveInput = styled(Cleave)(({ theme }) => ({
      maxWidth: 50,
      textAlign: 'center',
      height: '50px !important',
      fontSize: '150% !important',
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      '&:not(:last-child)': {
        marginRight: theme.spacing(2),
      },
      '&::-webkit-outer-spin-button, &::-webkit-inner-spin-button': {
        margin: 0,
        WebkitAppearance: 'none',
      },
    }))
  
    const handleChange = (
      event: ChangeEvent,
    ) => {
      if (!isBackspace) {
          /* 여기에서 setState수행 */
  
        // @ts-ignore
        const form = event.target.form
        const index = [...form].indexOf(event.target)
        if (form[index].value && form[index].value.length) {
          form.elements[index + 1].focus()
        }
        event.preventDefault()
      }
    }
  
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Backspace') {
        setIsBackspace(true)
  
        // @ts-ignore
        const form = event.target.form
        const index = [...form].indexOf(event.target)
        if (index >= 1) {
          if (!(form[index].value && form[index].value.length)) {
            form.elements[index - 1].focus()
          }
        }
      } else {
        setIsBackspace(false)
      }
    }
  
    const renderInputs = () => {
      return Object.keys(defaultValues).map((val, index) => {
        return (
          <CleaveInput
            key={index}
            // value={val}
            options={{ blocks: [1], numeral: true, numeralPositiveOnly: true }}
            /* @ts-ignore */
            onKeyDown={handleKeyDown}
            onChange={(event: ChangeEvent) => handleChange(event)}
          />
        )
      })
    }
    return (
    /* form 엘리먼트로 감싸주어야 함. */
      <form>
        <CleaveWrapper>{renderInputs()}</CleaveWrapper>
      </form>
    )
  }
  `}</code>
  </pre>
)
