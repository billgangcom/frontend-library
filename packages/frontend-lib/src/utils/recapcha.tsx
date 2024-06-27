import {
  type ReactNode,
  type RefObject,
  createContext,
  useContext,
  useRef,
} from 'react'
// @ts-ignore
import ReCAPTCHA from 'react-google-recaptcha'
export const SITE_KEY = '6LdQiIIpAAAAAAkhvhS9zuo5WNS5mAzZrALD9cCa'

type ReCaptchaInstance = {
  executeAsync: () => Promise<string | null>
  reset: () => void
  getValue: () => string | null
}

type ReCaptchaContextType = {
  recaptchaRef: RefObject<ReCaptchaInstance>
  executeRecaptcha: () => Promise<string | null>
}

const ReCaptchaContext = createContext<ReCaptchaContextType | undefined>(
  undefined,
)

export const ReCaptchaProvider: React.FC<{
  children: ReactNode
}> = ({ children }) => {
  const recaptchaRef = useRef<ReCaptchaInstance>(null)

  const executeRecaptcha = async () => {
    try {
      initObserver() // prevent from infinite loading by closing captcha
      const result = await recaptchaRef?.current?.executeAsync()
      await recaptchaRef?.current?.reset()
      return result ?? null
    } catch (e) {
      console.error(e)
    }
    return null
  }

  return (
    <ReCaptchaContext.Provider
      value={{
        recaptchaRef,
        executeRecaptcha,
      }}
    >
      {children}
      <ReCAPTCHA sitekey={SITE_KEY} size="invisible" ref={recaptchaRef} />
    </ReCaptchaContext.Provider>
  )
}

export const useReCaptcha = () => {
  const context = useContext(ReCaptchaContext)
  if (context === undefined) {
    throw new Error('useReCaptcha must be used within a ReCaptchaProvider')
  }
  return context
}

// Function that initializes a MutationObserver for the captcha
export const initObserver = () => {
  // Find the captcha window by first getting a list of iFrames.
  // After that we find the correct iFrame based on the src attribute
  // The actualy DIV that hides it, is a grandparent. So we get the
  // parentNode prop 2 times.
  const recaptchaWindow = [...document.getElementsByTagName('iframe')]?.find(
    (x) => x.src.includes('google.com/recaptcha/api2/bframe'),
  )?.parentNode?.parentNode as HTMLDivElement
  // Make sure it is defined (it was found in the doc) before we add the observer
  if (recaptchaWindow) {
    new MutationObserver(() => {
      // ReCaptcha changes these 3 props when going invisible.
      // To solve this, we put an observer on the attributes and
      // check if one of these 3 properties changed from their
      // initial value.
      if (
        recaptchaWindow.style.visibility !== 'visible' ||
        recaptchaWindow.style.opacity !== '1'
      ) {
        // If changed, put back on default values.
        recaptchaWindow.style.opacity = '1'
        recaptchaWindow.style.visibility = 'visible'
      }
    }).observe(recaptchaWindow, {
      attributeFilter: ['style'],
    })
  }
}
