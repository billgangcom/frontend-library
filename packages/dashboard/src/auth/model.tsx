import { action, atom, reatomAsync } from '@reatom/framework'
import { withLocalStorage } from '@reatom/persist-web-storage'
import { apiUrlWithShopDomen, request } from '../api/index.js'

export const tokenAtom = atom('').pipe(withLocalStorage('token'))
type OtpRequest = {
  requested: boolean
  email?: string
}
export const otpRequestAtom = atom<OtpRequest>({ requested: false, email: '' })

type RequestOtpParams = {
  email: string
  recaptcha: string
}

export const requestOtp = reatomAsync(
  async (ctx, { email, recaptcha }: RequestOtpParams) => {
    const url = 'auth/otp/request'
    const result = await request(url, {
      body: {
        email,
        recaptcha,
      },
      apiUrl: apiUrlWithShopDomen,
      method: 'POST',
      useToken: false,
    })
    if (result) {
      otpRequestAtom(ctx, { requested: true, email })
    }
  },
)

export const loginCustomer = reatomAsync(async (ctx, { otp, recaptcha }) => {
  const url = 'auth/otp/login'
  const email = ctx.get(otpRequestAtom).email
  const result = await request(url, {
    method: 'POST',
    body: { email, otp, recaptcha },
    apiUrl: apiUrlWithShopDomen,
    useToken: false,
  })
  if (result.data) {
    tokenAtom(ctx, result.data)
    otpRequestAtom(ctx, { requested: false })
  }
})

export const logoutCustomer = action((ctx) => {
  tokenAtom(ctx, '')
})
