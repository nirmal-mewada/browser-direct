import clsx from 'clsx'

const Button: React.FC<React.ComponentPropsWithoutRef<'button'>> = ({
  className,
  disabled,
  type = 'button',
  ...restProperties
}) => {
  return (
    <button
      className={clsx(
        className,
        disabled && 'opacity-40',
        !disabled && 'active:opacity-75',
        'px-2 py-1',
        'rounded-lg',
        'leading-none',
        'inline-flex items-center',
        'shadow-sm',
        'bg-white dark:bg-[#56555C]',
        'border',
        'border-b-[#C1BFBF] dark:border-b-[#56555C]',
        'border-l-[#D4D2D2] dark:border-l-[#56555C]',
        'border-r-[#D4D2D2] dark:border-r-[#56555C]',
        'border-t-[#DAD8D8] dark:border-t-[#6E6D73]',
      )}
      disabled={disabled}
      // eslint-disable-next-line react/button-has-type -- type is forwarded from props, defaulting to 'button'
      type={type}
      {...restProperties}
    />
  )
}

export default Button
