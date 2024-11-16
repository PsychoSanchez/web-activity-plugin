# Web Activity Tracker (BroTime)

A comprehensive web activity tracker Chrome extension built with TypeScript, React, ShadcnUI, and Tailwind. This extension leverages Chrome extension manifest V3 to provide detailed insights into user activity on websites.

<span>
<img width="250" alt="Screenshot 2022-12-04 at 16 18 20" src="https://github.com/user-attachments/assets/041acffb-3f4a-4abe-8e3c-ec8ff81b27dd">
<img width="250" alt="Screenshot 2022-12-04 at 16 19 15" src="https://github.com/user-attachments/assets/062e1da2-cc91-4af5-95fb-64afc3518e81">
<img width="250" alt="Screenshot 2022-12-04 at 16 17 52" src="https://github.com/user-attachments/assets/44624aa2-15b4-41d3-8860-775ec1fdd918">
</span>

## Privacy

This extension prioritizes user privacy by ensuring that all collected data is stored locally on the user's machine. 

- Data is stored using the browser's storage mechanisms ([chrome.storage](https://developer.chrome.com/docs/apps/manifest/storage/), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)).
- No data is shared with third-party services or servers.
- Collected data is solely used to display activity statistics to the user.

## Features

- Tracks activity on websites and local files (e.g., PDFs).
- Supports activity tracking on audible websites with idle behavior (e.g., YouTube, Netflix, Spotify, Discord) without requiring extra permissions.
- Displays total activity on each website for a specific date or week with second-level precision.
- Provides a minute-by-minute activity timeline for specific websites or all websites on a given date or week.
- Includes an overall activity heat calendar.
- Features a graph of the top 5 active websites.
- Compares daily activity with the current week's average.

## Development

To set up the development environment, follow these steps:

1. Install [nvm](https://github.com/nvm-sh/nvm).
2. Clone the repository.
3. Run the following commands:

```bash
nvm install
nvm use
npm install
npm start
```

### Storybook

To test your components in isolation, you can use Storybook.

```bash
npm run storybook
```

### Installing from source

- Clone the repository
- Install NodeJS
  - Using [nvm](https://github.com/nvm-sh/nvm)
    - Run `nvm install`
    - Run `nvm use`
  - Using [NodeJS](https://nodejs.org/en/download/prebuilt-installer)
    - Install NodeJS version specified in `.nvmrc` file
- Run `npm install`
- Run `npm run build` to build production version or `npm start` to run development version
- Go to `chrome://extensions/`
- Enable developer mode
- Click on `Load unpacked` and select the `dist` folder

## Testing

```bash
npm run test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

GPL3
