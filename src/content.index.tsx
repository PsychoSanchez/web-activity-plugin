import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { ContentApp } from './content/App';

function spawnAppElement() {
  const app = document.createElement('div');
  app.id = 'brott-app';

  document.body.appendChild(app);

  return app;
}

const app = spawnAppElement();

ReactDOM.render(<ContentApp />, app);
