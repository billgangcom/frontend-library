import * as Ariakit from '@ariakit/react'
import { useAction, useAtom } from '@reatom/npm-react'
import { z } from 'zod'
import { D4RK } from '../assets/icons.js'
import { Button } from '../common/button.js'
import { Input } from '../common/input.js'
import { LoadingSpinner } from '../common/loading-spinner.js'
import { useReCaptcha } from '../utils/recapcha.js'
import { loginCustomer, otpRequestAtom, requestOtp } from './model.js'

import { validateFormStore } from '../utils/validateFormStore.js'
import { AuthOTPInput } from './otp-input.js'

const emailValidation = z.object({
  email: z
    .string()
    .trim()
    .min(1, { message: 'The email field cannot be empty.' })
    .email({
      message: 'Please enter a valid email.',
    }),
})
const otpValidation = z.object({
  otp: z.string().regex(/^[0-9]{6}$/, {
    message:
      'Invalid verification code. The code should be a six-digit number. Please try again',
  }),
})
type FormHeaderProps = {
  title: string
  subtitle: string
}

const FormHeader: React.FC<FormHeaderProps> = ({ title, subtitle }) => (
  <>
    <div className="font-bold text-xxl mb-1">{title}</div>
    <div className="text-textSecondary mb-6">{subtitle}</div>
  </>
)

type FormErrorProps = {
  name: string
}

const FormError: React.FC<FormErrorProps> = ({ name }) => (
  <Ariakit.FormError className="text-signalDanger mb-10" name={name} />
)

export const AuthRequestOtp = () => {
  const submit = useAction(requestOtp)
  const [{ email }, setOtpRequest] = useAtom(otpRequestAtom)

  const { executeRecaptcha } = useReCaptcha()

  const formStore = Ariakit.useFormStore({
    defaultValues: {
      email: email || '',
    },
  })

  formStore.useValidate((state) =>
    validateFormStore(state, emailValidation, formStore),
  )

  formStore.useSubmit(async (state) => {
    const recaptcha = await executeRecaptcha()
    if (!recaptcha) return
    await submit({ email: state.values.email, recaptcha })
  })
  return (
    <Ariakit.Form store={formStore}>
      <FormHeader
        title="Sign In"
        subtitle="To continue, you’ll need to enter your email address below."
      />
      <Ariakit.FormLabel
        name={formStore.names.email}
        className="text-sm text-textSecondary mb-1"
      >
        Email Address
      </Ariakit.FormLabel>
      <Ariakit.FormInput
        name={formStore.names.email}
        render={<Input placeholder="Enter your email address" />}
      />
      <FormError name={formStore.names.email.toString()} />

      <Ariakit.FormSubmit render={<Button className="w-full h-11 text-xs" />}>
        Sign In
      </Ariakit.FormSubmit>
    </Ariakit.Form>
  )
}

export const AuthLogin = () => {
  const [otpRequest, setOtpRequest] = useAtom(otpRequestAtom)
  const submit = useAction(loginCustomer)
  const { executeRecaptcha } = useReCaptcha()

  const formStore = Ariakit.useFormStore({ defaultValues: { otp: '' } })

  formStore.useValidate((state) =>
    validateFormStore(state, otpValidation, formStore),
  )

  formStore.useSubmit(async (state) => {
    const recaptcha = await executeRecaptcha()
    if (recaptcha === null) return
    await submit({
      otp: state.values.otp,
      recaptcha,
    })
  })
  const back = () => setOtpRequest({ requested: false })
  const value = formStore.useValue(formStore.names.otp)

  return (
    <Ariakit.Form store={formStore}>
      <FormHeader
        title="Check Your Email"
        subtitle={`Enter the 6-digit code we sent to ${otpRequest.email}`}
      />
      <Ariakit.FormLabel
        name={formStore.names.otp}
        className="text-sm text-textSecondary mb-1"
      >
        Code
      </Ariakit.FormLabel>

      <Ariakit.FormControl
        name={formStore.names.otp}
        render={() => {
          return (
            <AuthOTPInput
              onChange={(value) =>
                formStore.setValue(formStore.names.otp, value)
              }
              value={value}
              onComplete={formStore.submit}
            />
          )
        }}
      />
      <FormError name={formStore.names.otp.toString()} />

      <div className="flex">
        <Button
          onClick={back}
          variant="secondary"
          type="button"
          className="w-[120px] h-11 text-xs mr-4"
        >
          Back
        </Button>
        <Ariakit.FormSubmit render={<Button className="flex-1 h-11 text-xs" />}>
          Sign In
        </Ariakit.FormSubmit>
      </div>
    </Ariakit.Form>
  )
}

export const Auth = () => {
  const [otpRequest] = useAtom(otpRequestAtom)

  const [pending] = useAtom(
    (ctx) =>
      ctx.spy(loginCustomer.pendingAtom) + ctx.spy(requestOtp.pendingAtom) > 0,
  )
  return (
    <div className="w-full h-full flex-center">
      {pending ? (
        <LoadingSpinner />
      ) : (
        <div className="max-w-[480px] w-full mx-4">
          <div className="flex-center rounded-2xl bg-surface0 w-[56px] h-[56px] px-1 mb-4">
            <D4RK />
          </div>
          {otpRequest.requested ? <AuthLogin /> : <AuthRequestOtp />}
        </div>
      )}
    </div>
  )
}
