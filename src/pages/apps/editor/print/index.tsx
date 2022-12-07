import dynamic from 'next/dynamic'

const Viewer = dynamic<any>(() => import('./viewer').then(m => m), { ssr: false })

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
