import classNames from 'classnames/bind';
import * as React from 'react';

import styles from './styles.css';

const cx = classNames.bind(styles);

interface PanelComponentClassNameProps {
  className?: string;
}

export const Panel: React.FC<PanelComponentClassNameProps> = ({
  children,
  className,
}) => {
  return <div className={cx('panel', className)}>{children}</div>;
};

export const PanelHeader: React.FC<PanelComponentClassNameProps> = ({
  children,
  className,
}) => {
  return <div className={cx('panel-header', className)}>{children}</div>;
};

export const PanelBody: React.FC<PanelComponentClassNameProps> = ({
  children,
  className,
}) => {
  return <div className={cx('panel-body', className)}>{children}</div>;
};
