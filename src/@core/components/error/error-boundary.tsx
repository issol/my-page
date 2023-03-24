import logger from '@src/@core/utils/logger'
import React from 'react'
import DetailNoUser from './detail-no-user'
interface Props {
  children?: React.ReactNode
  FallbackComponent?: React.ReactNode
}

interface State {
  hasError: boolean
  errorCode: number | null
  from: string
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props & State) {
    super(props)

    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, errorCode: null, from: '' }
  }
  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here

    this.setState({
      errorCode: error.response.status,
      from: error.request.responseURL,
    })

    logger.debug({ error, errorInfo })
  }
  render() {
    logger.debug(
      this.state.hasError,
      this.state.errorCode === 400,
      this.state.from.includes('/api/enough/onboard/user'),
    )

    // Check if the error is thrown
    if (
      this.state.hasError &&
      this.state.errorCode === 400 &&
      this.state.from.includes('/api/enough/onboard/user')
    ) {
      return <DetailNoUser />
    } else if (this.state.hasError && this.state.errorCode !== 400) {
      return this.props.FallbackComponent
    }
    return this.props.children
  }
}

export default ErrorBoundary
