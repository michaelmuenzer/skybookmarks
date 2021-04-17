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

## Setup

1. Open your terminal to the cloned repo folder and run `yarn install` to
   install the project's dependencies.
2. Run `yarn start` to see our app's starting layout. If your browser doesn't
   launch, visit [localhost:3000](localhost:3000). Create React App will
   auto-reload when you save files. (Use <kbd>Ctrl</kbd>+<kbd>C</kbd> in the
   terminal to stop your app.)
3. **Test it out!** Now Sign up for an account on MySky and update your bookmark list. They are stored on in [SkyDB](https://support.siasky.net/key-concepts/skydb) and are publicly shared in the system! You can also use the [Content Record Viewer](http://skey.hns.siasky.net/) tool to see your content record.

## Deploy the Web App on Skynet

Congratulations! You have a fully functioning Skapp! Let's deploy
it and let the world see its wonder! Deploying an application is as easy as uploading a directory.

1. For Create React App projects, we need to add `"homepage": ".",` to the `package.json`.

2. Next, we'll return to where we initialized the `SkynetClient` in _Step 1.2_. When deployed to Skynet, we don't want our App to only communicate with siasky.net, instead we want it to communicate with the portal the app is being served from. Find the line that says

```javascript
// Initiate the SkynetClient
const client = new SkynetClient(portal);
```

and replace it with

```javascript
// Initiate the SkynetClient
const client = new SkynetClient();
```

3. Build the application with `yarn build`

4. Upload the newly created `build` folder to [https://siasky.net](http://siasky.net). (Make sure you select 'Do you want to upload an entire directory?')

5. Now any of your friends can make their own certificates!

## Where to go from here?

Now that you've deployed a Skynet app, there's many things to keep learning!

- You can [learn how to use
  Handshake](https://support.siasky.net/key-concepts/handshake-names) for a
  decentralized human-readable URL like
  [skyfeed.hns.siasky.net](https://skyfeed.hns.siasky.net).

- You can [automate
  deployment](https://blog.sia.tech/automated-deployments-on-skynet-28d2f32f6ca1)
  of your site using a [Github
  Action](https://github.com/kwypchlo/deploy-to-skynet-action).

We're always improving our [Skynet Developer
Resources](https://support.siasky.net/the-technology/developing-on-skynet),
so check that out and join [our Discord](https://discord.gg/sia) to share
ideas with other devs.

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