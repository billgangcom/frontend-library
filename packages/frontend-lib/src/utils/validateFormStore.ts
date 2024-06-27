import type { FormStore, FormStoreState } from '@ariakit/react'
import get from 'lodash.get'
import type { ZodSchema } from 'zod'
export const validateFormStore = <T extends ZodSchema>(
  state: FormStoreState,
  validationSchema: T,
  formStore: FormStore,
): void => {
  const valid = validationSchema.safeParse(state.values)

  if (!valid.success) {
    const issues = valid.error.issues

    for (const issue of issues) {
      formStore.setError(get(formStore.names, issue.path), issue.message)
    }
  }
}
