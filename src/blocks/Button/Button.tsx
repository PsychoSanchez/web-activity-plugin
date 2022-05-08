import classNames from 'classnames/bind';
import * as React from 'react';

import styles from './styles.css';

const cx = classNames.bind(styles);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  buttonType: ButtonType;
}

export enum ButtonType {
  Primary,
  Secondary,
}

const BUTTON_TO_STYLE_MAP = {
  [ButtonType.Primary]: cx('primary'),
  [ButtonType.Secondary]: cx('secondary'),
};

export const Button: React.FC<ButtonProps> = ({
  className,
  buttonType,
  children,
  ...props
}) => (
  <button
    className={cx('main', className, BUTTON_TO_STYLE_MAP[buttonType])}
    {...props}
  >
    {children}
  </button>
);
