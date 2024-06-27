import { apiOrdersUrl, request } from './index.js'

type OrdersMethodsType = {
  shopDomen: string
}
type CustomFields = {
  [key: string]: string
}

type PartOrderForCreateOrderRequest = {
  productId: number
  productVariantId: number
  quantity: number
}

type OrderRequest = {
  customerEmail: string
  gateway: string
  parts: PartOrderForCreateOrderRequest[]
  recaptcha: string
  coupon?: string | null
  customFields: CustomFields
  discordSocialConnectId?: string | null
}
export const ordersMethods = ({ shopDomen }: OrdersMethodsType) => {
  const postOrders = (body: OrderRequest) =>
    request(`v1/orders/${shopDomen}`, {
      apiUrl: apiOrdersUrl,
      method: 'POST',
      body,
      useToken: false,
    })

  const getOrder = (id: string) =>
    request(`v1/orders/${shopDomen}/${id}`, {
      apiUrl: apiOrdersUrl,
      useToken: false,
    })
  const getOrderWithToken = (id: string, token: string) =>
    request(`v1/orders/${shopDomen}/${id}/${token}`, {
      apiUrl: apiOrdersUrl,
      useToken: false,
    })
  return { postOrders, getOrder, getOrderWithToken }
}
