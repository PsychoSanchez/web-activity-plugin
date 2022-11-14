import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { initTheme } from './popup/hooks/useTheme';
import { PopupApp } from './popup/App';

initTheme();

ReactDOM.render(<PopupApp />, document.querySelector('#app'));
