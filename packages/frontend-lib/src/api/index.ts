import { logoutCustomer, tokenAtom } from '../auth/model.js'
import { ctx, shopDomenAtom, shopIdAtom } from '../index.js'
import { type Price, showError } from '../utils/index.js'
const UNAUTHORIZED_STATUS_CODE = 401
const NOT_FOUND_STATUS_CODE = 404
const SystemExceptionError = "Exception of type 'System.Exception' was thrown."

type FetchOptions = Omit<RequestInit, 'body'> & {
  params?: { [key: string]: string | string[] }
  returnHeaders?: boolean
  apiUrl?: string
  useToken?: boolean
  body?: object
}

export const PageSize = 10
type PageType = {
  PageNumber: number
}
type PageWithUrlType = PageType & {
  url: string
}

export type ReferralCode = {
  referralCode: string
}
export type Payment = {
  customerEmail: string
  price: Price
  gateway: string
}

export const apiCustomersUrl = 'https://customers-api.billgang.com'
export const apiOrdersUrl = 'https://sl-api.billgang.com'

export const getApiUrlWithShopId = () =>
  `${apiCustomersUrl}/${ctx.get(shopIdAtom)}`
export const getApiUrlWithShopDomen = () =>
  `${apiCustomersUrl}/${ctx.get(shopDomenAtom)}`

export async function request(baseURL: string, options: FetchOptions = {}) {
  const {
    params,
    returnHeaders,
    apiUrl = getApiUrlWithShopId(),
    useToken = true,
    body,
    ...fetchOptions
  } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  if (useToken) {
    const customerToken = ctx.get(tokenAtom)
    headers.Authorization = `Bearer ${customerToken}`
  }

  const url = new URL(`${apiUrl}/${baseURL}`)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (Array.isArray(value)) {
        for (const item of value) {
          url.searchParams.append(key, item)
        }
      } else if (value !== undefined) {
        url.searchParams.append(key, value)
      }
    }
  }

  let finalBody: BodyInit | null = null
  if (body) {
    finalBody = JSON.stringify(body)
  }

  const finalFetchOptions: RequestInit = {
    ...fetchOptions,
    headers,
    body: finalBody,
  }

  try {
    const response = await fetch(url.toString(), finalFetchOptions)

    if (!response.ok) {
      throw response
    }

    const data = await response.json()

    if (returnHeaders) {
      return { headers: response.headers, data }
    }

    return data
  } catch (error) {
    if (error instanceof Response) {
      if (error.status === UNAUTHORIZED_STATUS_CODE) {
        showError('Unauthorized error, token might be invalid')
        logoutCustomer(ctx)
      } else if (error.status === NOT_FOUND_STATUS_CODE) {
        showError('The server error, method not found')
      }
      if (error.json) {
        const errorData = await error.json()
        if (errorData) {
          const { errors, message } = errorData
          let errorMessage = ''
          if (errors?.length) {
            errorMessage = errors?.join('\n')
            if (errors[0] === SystemExceptionError) {
              logoutCustomer(ctx)
            }
          } else if (message) {
            errorMessage = message
          }

          if (errorMessage) {
            showError(errorMessage)
          }
        }

        console.error({ errorData })
      }
    } else {
      showError('Fetch error')
    }
    console.error(error)
    throw error
  }
}

export const fetchDashInfo = () => request('customers/dash/info')
export const fetchHome = () => request('customers/dash/dashboard/home')
export const fetchRewards = () => request('customers/rewards')
export const fetchBalance = () => request('customers/balance')
export const fetchBalanceSettings = () =>
  request('customers/balance/top-up/settings')
export const fetchReferral = () => request('customers/referral-system')

export const signupReferral = (body: ReferralCode) =>
  request('customers/referral-system/signup', {
    method: 'POST',
    body,
  })

export const postBalanceTopUp = (body: Payment) =>
  request(`v1/balance/top-up/${ctx.get(shopDomenAtom)}`, {
    apiUrl: apiOrdersUrl,
    method: 'POST',
    body,
    useToken: false,
  })
export const fetchGatewaysDetail = (gateways: string[]) =>
  request('v1/gateways', {
    apiUrl: apiOrdersUrl,
    params: {
      shopId: ctx.get(shopIdAtom),
      names: gateways,
    },
    useToken: false,
  })

export const fetchWithPages = async ({ url, PageNumber }: PageWithUrlType) => {
  const res = await request(url, {
    params: {
      PageNumber: PageNumber.toString(),
      PageSize: PageSize.toString(),
    },
    returnHeaders: true,
  })
  const totalCount = Number(res.headers.get('x-pagination-total'))
  return { list: res.data, totalCount }
}
export const fetchOrders = ({ PageNumber }: PageType) =>
  fetchWithPages({ url: 'customers/orders', PageNumber })

export const fetchTransactions = ({ PageNumber }: PageType) =>
  fetchWithPages({
    url: 'customers/balance/transactions',
    PageNumber,
  })
