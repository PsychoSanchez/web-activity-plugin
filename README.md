# web-activity-tracker

This is a simple web activity tracker Chrome extension that can be used to track user activity on websites. It is built with Typescript, React, ShadcnUI + Tailwind and uses Chrome extension manifest V3.

<span>
<img width="250" alt="Screenshot 2022-12-04 at 16 18 20" src="https://github.com/user-attachments/assets/041acffb-3f4a-4abe-8e3c-ec8ff81b27dd">
<img width="250" alt="Screenshot 2022-12-04 at 16 19 15" src="https://github.com/user-attachments/assets/062e1da2-cc91-4af5-95fb-64afc3518e81">
<img width="250" alt="Screenshot 2022-12-04 at 16 17 52" src="https://github.com/user-attachments/assets/44624aa2-15b4-41d3-8860-775ec1fdd918">
</span>

## Privacy

Extension does not share collected data from the user. It stores data locally on the user's machine.

- Data is stored in the browser's storage ([chrome.storage](https://developer.chrome.com/docs/apps/manifest/storage/), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API))
- Data is not shared with third-party services or servers
- Data is only used to display activity statistics to the user

## Features

- Tracks activity on websites as well as local files (PDFs).
- Supports activity tracking on audible websites with idle behavior (like Youtube, Netflix, Spotify, Discord) without extra permissions
- Displays total activity on every website on a specific date or week with a second precision.
- Minute by minute activity timeline for a specific website or all websites on a specific date or week.
- Overall activity heat calendar
- Graph of top 5 active websites.
- Compares daily activity with current week average.

## Development

Install [nvm](https://github.com/nvm-sh/nvm)

Clone the repository and run the following commands:

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
