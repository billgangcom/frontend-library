import type { Config } from 'tailwindcss'

const config: Config = {
  content: {
    relative: true,
    files: ['../../src/**/*.tsx'],
  },
  theme: {
    extend: {
      colors: {
        signalDanger: 'var(--billgang-color-signal-danger)',
        brandDefault: 'var(--billgang-color-brand-default)',
        brandLight: 'var(--billgang-color-brand-light)',
        brandLighter: 'var(--billgang-color-brand-lighter)',
        surface0: 'var(--billgang-color-surface-0)',
        surface100: 'var(--billgang-color-surface-100)',
        surface200: 'var(--billgang-color-surface-200)',
        grayish: 'var(--billgang-color-surface200)',
        textPrimary: 'var(--billgang-color-text-brandDefault)',
        textSecondary: 'var(--billgang-color-text-secondary)',
        successBackground: 'var(--billgang-color-success-background)',
        successText: 'var(--billgang-color-success-text)',
        warningBackground: 'var(--billgang-color-warning-background)',
        test: 'var(--billgang-color-success-background)', //
        warningText: 'var(--billgang-color-warning-text)',
        signalDangerBackground: 'var(--billgang-color-error-background)',
        borderDefault: 'var(--billgang-color-border-default)',
        borderHover: 'var(--billgang-color-border-hover)',
        dialogBackdrop: 'var(--billgang-color-dialog-backdrop)',
        fieldBackgroundDefault:
          'var(--billgang-color-field-background-default)',
        fieldBackgroundHover: 'var(--billgang-color-field-background-hover)',
        fieldBackgroundFocus: 'var(--billgang-color-field-background-focus)',
        fieldBorderDefault: 'var(--billgang-color-field-border-default)',
        fieldBorderHover: 'var(--billgang-color-field-border-hover)',
        fieldBorderFocus: 'var(--billgang-color-field-border-focus)',
        shadow0: 'var(--billgang-color-shadow-0)',
      },
      boxShadow: {
        shadow0: 'var(--billgang-shadow-0)',
        shadowField: 'var(--billgang-shadow-field)',
        shadowDialog: 'var(--billgang-shadow-dialog)',
      },
      fontSize: {
        xxs: '10px',
        xs: '12px',
        sm: '14px',
        base: '16px',
        lg: '20px',
        xl: '24px',
        xxl: '32px',
      },
    },
  },
}

export default config
