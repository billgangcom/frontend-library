import { Dashboard } from '@billgang/dashboard'

// rewards user
// const shopDomen = 'dfbd.billgang.store'
// const shopId = '38332d9f-3bb6-4b3f-ac68-90151b968958'

// min
// const shopDomen = 'min.billgang.store'
// const shopId = '71676f46-2af8-4519-8901-7550f14ad15a'

// oreshaver
const shopDomen = 'oreshaver.billgang.store'
const shopId = '15124f8d-2c8c-4dda-a04c-31c16816f9b6'

function App() {
  return (
    <>
      <Dashboard shopDomen={shopDomen} shopId={shopId} />
    </>
  )
}

export default App
