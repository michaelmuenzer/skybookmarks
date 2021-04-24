<h1 align="center">Skybookmarks</h1>

<p align="center">
  <img src="public/logo512.png" alt="skybookmarks-logo" width="120px" height="120px"/>
  <br>
  Skybookmarks is a decentralized social bookmarking website built on [Skynet](https://support.siasky.net/the-technology/developing-on-skynet).
</p>

## Functionality

You can conveniently login with your SkyID and discover stored bookmarks of other users.

The following user actions are stored in the [Content record library](https://github.com/SkynetLabs/content-record-library):
- Save bookmark
- Bookmark name update

## Video Demo
TODO

## Live Demo

You can access the latest deployed version on https://025hekt.hns.siasky.net/. It is set-up using [Github actions](https://blog.sia.tech/automated-deployments-on-skynet-28d2f32f6ca1) and [HNS](https://support.siasky.net/key-concepts/handshake-names).

## Prerequisites

1. [NodeJS](https://nodejs.org/en/download/) installed.
1. [Yarn](https://yarnpkg.com/getting-started/install) installed. (`npm install -g yarn`)
1. Clone this repo.

## Setup for local development

1. For local React App projects, we need to remove `"homepage": ".",` from the `package.json`.
2. When working locally, we want our App to only communicate with siasky.net. Find the line that says

```javascript
const client = new SkynetClient();
```

and replace it with

```javascript
const portal = 'https://siasky.net/';
const client = new SkynetClient(portal);
```
3. Set your data domain for [MySky](https://siasky.net/docs/#initializing-mysky):

```javascript
const dataDomain = 'localhost';
```
4. Open your terminal to the cloned repo folder and run `yarn install` to
   install the project's dependencies.
5. Run `yarn start` to see our app's starting layout. If your browser doesn't
   launch, visit [localhost:3000](localhost:3000). Create React App will
   auto-reload when you save files. (Use <kbd>Ctrl</kbd>+<kbd>C</kbd> in the
   terminal to stop your app.)
6. **Test it out!** Now Sign up for an account on MySky and update your bookmark list. They are stored on in [SkyDB](https://support.siasky.net/key-concepts/skydb) and are publicly shared in the system! You can also use the [Content Record Viewer](http://skey.hns.siasky.net/) tool to see your content record.

## Deploy the Web App on Skynet

Congratulations! You have a fully functioning Skapp! Deployment is currently configured with a Github action. You can nevertheless deploy your own instance by doing the following:

1. Have `"homepage": ".",` set in the `package.json`

2. Do not define a portal when initializing the [Skynet client](https://siasky.net/docs/#using-the-skynet-client):

```javascript
const client = new SkynetClient();
```

3. Set your data domain for [MySky](https://siasky.net/docs/#initializing-mysky):

```javascript
const dataDomain = 'yourdomain';
```

4. Build the application with `yarn build`

5. Upload the newly created `build` folder to [https://siasky.net](http://siasky.net). (Make sure you select 'Do you want to upload an entire directory?')

## Where to go from here?

Think of new features this product can offer and feel free to create PRs for them. Here are some ideas you could build upon:
- Overview of the most bookmarked pages accross all users
- Bookmark deletion
- Browser extensions to set bookmarks more conveniently
- Categorizing bookmarks and building a search engine and discovery features on top of that
- Store a snapshot of the bookmark on Skynet (similar to [Waybackmachine](https://archive.org/web/))

## Available Scripts

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