import { ctx, shopDomenAtom } from '../index.js'
import { apiOrdersUrl, request } from './index.js'

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
export const postOrders = (body: OrderRequest) =>
  request(`v1/orders/${ctx.get(shopDomenAtom)}`, {
    apiUrl: apiOrdersUrl,
    method: 'POST',
    body,
    useToken: false,
  })

export const getOrder = (id: string) =>
  request(`v1/orders/${ctx.get(shopDomenAtom)}/${id}`, {
    apiUrl: apiOrdersUrl,
    useToken: false,
  })
export const getOrderWithToken = (id: string, token: string) =>
  request(`v1/orders/${ctx.get(shopDomenAtom)}/${id}/${token}`, {
    apiUrl: apiOrdersUrl,
    useToken: false,
  })
