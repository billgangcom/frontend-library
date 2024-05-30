type InputProps = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  value: string
  placeholder?: string
  className?: string
  icon?: React.ReactNode
}

export const Input = ({
  onChange,
  value,
  placeholder,
  className = '',
  icon = null,
  ...props
}: InputProps) => (
  <div className={`relative w-full ${className}`}>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="block h-12 w-full rounded-xl border-none bg-surface0 p-3 align-middle placeholder:text-surface200"
      placeholder={placeholder}
      {...props}
    />
    {icon && (
      <div className="absolute inset-y-0 right-[14px] flex items-center">
        {icon}
      </div>
    )}
  </div>
)