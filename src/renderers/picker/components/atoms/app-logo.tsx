import clsx from 'clsx'

type Props = React.ComponentPropsWithoutRef<'img'> & {
  readonly name: string
  readonly className?: string
  readonly icon: string | undefined
}

const AppLogo = ({ name, className, icon }: Props): JSX.Element => {
  return (
    <img
      alt=""
      className={clsx(className, 'no-drag', !icon && 'hidden')}
      data-testid={name}
      src={icon || ''}
    />
  )
}

export default AppLogo
