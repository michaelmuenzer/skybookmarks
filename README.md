## TODO: What is it?

Social bookmarking
- Store copy of webpage on [Skynet](https://support.siasky.net/the-technology/developing-on-skynet). Booksmarks always representing what people saw.

Store web-pages persistent forever
Store bookmarks at SkyID + changeable bookmarks
Content record library:
- Save bookmarks
- Record changes of bookmarks

## Prerequisites

1. [NodeJS](https://nodejs.org/en/download/) installed.
1. [Yarn](https://yarnpkg.com/getting-started/install) installed. (`npm install -g yarn`)
1. Clone this repo.

## Setup for local development

1. For local React App projects, we need to remove `"homepage": ".",` from the `package.json`.
1. When working locally, we want our App to only communicate with siasky.net. Find the line that says

```javascript
const client = new SkynetClient();
```

and replace it with

```javascript
const portal = 'https://siasky.net/';
const client = new SkynetClient(portal);
```
1. Open your terminal to the cloned repo folder and run `yarn install` to
   install the project's dependencies.
1. Run `yarn start` to see our app's starting layout. If your browser doesn't
   launch, visit [localhost:3000](localhost:3000). Create React App will
   auto-reload when you save files. (Use <kbd>Ctrl</kbd>+<kbd>C</kbd> in the
   terminal to stop your app.)
1. **Test it out!** Now Sign up for an account on MySky and update your bookmark list. They are stored on in [SkyDB](https://support.siasky.net/key-concepts/skydb) and are publicly shared in the system! You can also use the [Content Record Viewer](http://skey.hns.siasky.net/) tool to see your content record.

## Deploy the Web App on Skynet

Congratulations! You have a fully functioning Skapp! Deployment is currently configured with a Github action. You can nevertheless deploy your own instance by doing the following:

1. We need to be sure to have `"homepage": ".",` in the `package.json`.

1. We need to be sure to have the following enabled:

```javascript
const client = new SkynetClient();
```

1. Build the application with `yarn build`

1. Upload the newly created `build` folder to [https://siasky.net](http://siasky.net). (Make sure you select 'Do you want to upload an entire directory?')

## Where to go from here?

Think of new features this page can offer and feel free to create PRs for them. Here are some ideas you could build upon:
- Overview of the most bookmarkes pages accross all users
- Bookmark deletion
- Browser extension to set bookmarks more conveniently
- Categorizing bookmarks and building a search engine / discovery features on top

### Available Scripts

In the project directory, you can run:

**yarn start**

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

**yarn build**

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.