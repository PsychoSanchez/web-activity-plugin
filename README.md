# web-activity-tracker

This is a simple web activity tracker Chrome extension that can be used to track user activity on websites. It is built using Tailwind, React, Typescript and using Chrome extension manifest V3.

<span>
<img width="250" alt="Screenshot 2022-12-04 at 16 18 20" src="https://user-images.githubusercontent.com/10772182/205500355-7f6c466e-8a07-427d-aced-44305b0bf1cf.png">
<img width="250" alt="Screenshot 2022-12-04 at 16 19 15" src="https://user-images.githubusercontent.com/10772182/205500328-292588fc-d07f-417f-9240-d64bc1efd28f.png">
<img width="250" alt="Screenshot 2022-12-04 at 16 17 52" src="https://user-images.githubusercontent.com/10772182/205500423-6cb4b75f-1a74-4215-be6f-652b0a18df25.png">
</span>


## Privacy

Extension does not share collected data from the user. It stores data locally on the user's machine.

- Data is stored in the browser's storage. ([chrome.storage](https://developer.chrome.com/docs/apps/manifest/storage/), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API))])
- Data is not sent to any server.
- Data is only used to display the activity on the website.
- Data is not shared with any third party.

## Features

- Tracks activity on websites as well as local files (PDFs).
- Supports activity tracking on audible websites with idle behavior (like Youtube, Netflix, Spotify, Discord) without extra permissions
- Displays total activity on every website on a specific date or week with a second precision.
- Minute by minute activity timeline for a specific website or all websites on a specific date or week.
- Overall activity heat calendar
- Graph of top 5 active websites.
- Compares daily activity with current week average.

### Installing from source

- Clone the repository
- Run `npm install`
- Run `npm run build`
- Go to `chrome://extensions/`
- Enable developer mode
- Click on `Load unpacked` and select the `dist` folder

## Development

Install [nvm](https://github.com/nvm-sh/nvm)

Clone the repository and run the following commands:

```bash
nvm use
npm install
npm start
```

Build production version

```bash
npm run build
```

## Testing

```bash
npm run test
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

GPL3
