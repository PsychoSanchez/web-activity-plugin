import * as React from 'react';

export const Panel: React.FC<{
  header?: JSX.Element;
}> = ({ header, children }) => {
  return (
    <div className={'panel'}>
      {header && <div className={'panel-header'}>{header}</div>}
      <div className={'panel-body'}>{children}</div>
    </div>
  );
};
