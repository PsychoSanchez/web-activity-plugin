import type { Preview } from '@storybook/react';

import '!style-loader!css-loader!postcss-loader!../src/tailwind.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
