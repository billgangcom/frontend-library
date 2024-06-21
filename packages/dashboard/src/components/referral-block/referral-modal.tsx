import * as Ariakit from '@ariakit/react'
import { useAction } from '@reatom/npm-react'
import { z } from 'zod'
import { Info } from '../../assets/icons.js'
import { Button } from '../../common/button.js'
import { Input } from '../../common/input.js'
import { Modal } from '../../common/modal.js'
import { validateFormStore } from '../../utils/validateFormStore.js'
import { postReferral } from './model.js'

const referralValidation = z.object({
  referralCode: z.string().min(3, {
    message: 'Referral Code should have minimum length of 3',
  }),
})
const ReferralModal = () => {
  const formStore = Ariakit.useFormStore({
    defaultValues: { referralCode: '' },
  })

  const dialogStore = Ariakit.useDialogStore({ defaultOpen: false })
  const referralCode = formStore.useValue(formStore.names.referralCode)
  const submit = useAction(postReferral)

  formStore.useSubmit(() => {
    submit({ referralCode })
    dialogStore.hide()
  })
  formStore.useValidate((state) =>
    validateFormStore(state, referralValidation, formStore),
  )
  return (
    <>
      <Button onClick={dialogStore.show}>Join the referral program </Button>
      <Modal store={dialogStore} title="Create an affiliate code">
        <Ariakit.Form store={formStore}>
          <Ariakit.FormLabel
            className="text-sm text-textSecondary"
            name={formStore.names.referralCode}
          >
            Affiliate Code
          </Ariakit.FormLabel>
          <Ariakit.FormInput
            name={formStore.names.referralCode}
            render={<Input placeholder="Enter code here (e.g Join)" />}
          />
          <Ariakit.FormError
            className="text-signalDanger"
            name={formStore.names.referralCode}
          />
          <div className="p-3 bg-surface0 flex rounded-xl items-center mb-8 mt-4">
            <div className="h-[20px] w-[20px] mr-[10px] flex-center">
              <Info />
            </div>
            <div className="text-sm text-textSecondary">
              Once you join our referral program, you’ll gain access to special
              deals, rewards, and potentially earn a percentage (%) of revenue.
            </div>
          </div>
          <div className="justify-end flex">
            <Ariakit.DialogDismiss
              render={
                <Button variant="secondary" className="mr-3">
                  Cancel
                </Button>
              }
            />
            <Ariakit.FormSubmit render={<Button>Create</Button>} />
          </div>
        </Ariakit.Form>
      </Modal>
    </>
  )
}

export default ReferralModal
