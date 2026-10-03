interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 px-4 py-5 sm:flex-row sm:items-start sm:justify-between sm:px-6 sm:py-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-fg-primary sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-base text-fg-secondary">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
