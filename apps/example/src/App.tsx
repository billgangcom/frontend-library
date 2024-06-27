import { CustomerDashboard } from '@billgangcom/frontend-lib'
import '@billgangcom/frontend-lib/styles.css'

const shopDomen = 'oreshaver.billgang.store'
const shopId = '15124f8d-2c8c-4dda-a04c-31c16816f9b6'
function App() {
  return (
    <>
      <CustomerDashboard shopDomen={shopDomen} shopId={shopId} />
    </>
  )
}

export default App
