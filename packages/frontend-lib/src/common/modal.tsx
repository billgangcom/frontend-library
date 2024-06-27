import * as Ariakit from '@ariakit/react'
import { CrossIcon } from '../assets/icons.js'
import { Dialog } from '../common/dialog.js'

type ModalProps = {
  store: Ariakit.DialogStore
  children: React.ReactNode
  title: string
}

export const Modal: React.FC<ModalProps> = ({ store, children, title }) => {
  return (
    <Ariakit.DialogProvider store={store}>
      <Ariakit.Dialog
        render={<Dialog />}
        backdrop={<div className="bg-[rgba(37,37,37,0.24)]" />}
      >
        <div className="py-4 px-6 border-borderDefault border-b flex">
          <div className="text-xl font-bold">{title}</div>
          <Ariakit.DialogDismiss className="ml-auto">
            <CrossIcon />
          </Ariakit.DialogDismiss>
        </div>
        <div className="py-4 px-6">{children}</div>
      </Ariakit.Dialog>
    </Ariakit.DialogProvider>
  )
}
