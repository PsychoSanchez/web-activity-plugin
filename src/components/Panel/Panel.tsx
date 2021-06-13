import * as React from 'react';

export const Panel: React.FC<{
  header?: JSX.Element;
  bodyClassName?: string;
}> = ({ header, children, bodyClassName }) => {
  return (
    <div className={'panel'}>
      {header && <div className={'panel-header'}>{header}</div>}
      <div className={'panel-body ' + bodyClassName}>{children}</div>
    </div>
  );
};
