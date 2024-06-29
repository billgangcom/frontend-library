import {
  BillgangProvider,
  CustomerDashboard,
  getOrder,
} from '@billgangcom/frontend-lib'
import '@billgangcom/frontend-lib/styles.css'
import { useEffect } from 'react'

const shopDomen = 'oreshaver.billgang.store'
const shopId = '15124f8d-2c8c-4dda-a04c-31c16816f9b6'

function App() {
  useEffect(() => {
    const fetchData = async () => {
      console.log({
        order: await getOrder('34632caa-fa05-4ca9-989e-83e7b5539ec7'),
      })
    }
    fetchData()
  }, [])
  return (
    <>
      <BillgangProvider shopDomen={shopDomen} shopId={shopId}>
        <CustomerDashboard />
      </BillgangProvider>
    </>
  )
}

export default App
