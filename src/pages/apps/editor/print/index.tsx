import dynamic from 'next/dynamic'
import Viewer from './viewer'

// ** React Imports
import { ReactNode } from 'react'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

const ViewerPrint = () => {
  return <Viewer />
}

ViewerPrint.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ViewerPrint.setConfig = () => {
  return {
    mode: 'light'
  }
}

export default ViewerPrint
