type PageTitleProps = {
  title: string
  description?: string
}

export const PageTitle = ({ title, description }: PageTitleProps) => (
  <div className="mt-2 mb-4 ml-4">
    <div className="font-bold text-lg">{title}</div>
    {description && <div className="text-textSecondary">{description}</div>}
  </div>
)
