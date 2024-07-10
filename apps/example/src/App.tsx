import {
  BillgangProvider,
  CustomerDashboard,
  ReCaptchaProvider,
  useCart,
  useReCaptcha,
} from '@billgangcom/frontend-lib'
import {
  fetchAnnouncements,
  fetchOrder,
  fetchProducts,
  fetchSettings,
} from '@billgangcom/frontend-lib/methods'
import '@billgangcom/frontend-lib/styles.css'
import { useEffect } from 'react'

// const shopDomain = 'oreshaver.billgang.store'
// const shopId = '15124f8d-2c8c-4dda-a04c-31c16816f9b6'

const shopDomain = 'ragingnation.org'
const shopId = '3b925423-7b65-43d7-a2d3-25c46500306c'

const shopPassword = ''
function Test() {
  const {
    cart,
    products,
    pending,
    addProductToCart,
    getTotalAndDiscount,
    getPossibleGateways,
    submitCart,
    setPaymentMethod,
    setRecapcha,
    applyCoupon,
  } = useCart('yetrajerde@gufum.com')
  const { executeRecaptcha } = useReCaptcha()

  useEffect(() => {
    const addAndPost = async () => {
      if (!pending && products.length) {
        try {
          addProductToCart({
            productId: 100000098,
            productVariantId: 100000125,
            quantity: 9,
          })
          addProductToCart({
            productId: 100000102,
            productVariantId: 100000134,
            quantity: 9,
          })
          setPaymentMethod(getPossibleGateways()[0])
          await applyCoupon('latinamods12')
          const recaptcha = await executeRecaptcha()
          if (recaptcha === null) return
          setRecapcha(recaptcha)
          await submitCart()
        } catch (error) {
          console.error(error)
        }
      }
    }
    addAndPost()
  }, [
    products,
    pending,
    addProductToCart,
    getPossibleGateways,
    submitCart,
    setPaymentMethod,
    setRecapcha,
    applyCoupon,
    executeRecaptcha,
  ])

  console.log({
    cart,
    products,
    total: getTotalAndDiscount(),
    gateways: getPossibleGateways(),
  })
  return null
}

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const requests = [
        fetchSettings(),
        fetchProducts(),
        fetchOrder('b6a16fb1-9dd9-4088-a123-d4ca697fc3ac'),
        fetchAnnouncements(),
      ]

      console.log('fetchData', await Promise.all(requests))
    }
    fetchData()
  }, [])
  return (
    <BillgangProvider
      shopDomain={shopDomain}
      shopId={shopId}
      shopPassword={shopPassword}
    >
      <CustomerDashboard />
      {/* <ReCaptchaProvider>
        <Test />
      </ReCaptchaProvider> */}
    </BillgangProvider>
  )
}

export default App
