import { useState, useEffect, useCallback } from 'react';

import WorkshopForm from './components/Form';
import scrape from './website-scraper/index';
import sanitizeFilename from 'sanitize-filename';

import { Header, Tab, Container } from 'semantic-ui-react';
import { ContentRecordDAC } from '@skynetlabs/content-record-library';

import { SkynetClient } from 'skynet-js';

// We'll define a portal to allow for developing on localhost.
// When hosted on a skynet portal, SkynetClient doesn't need any arguments.
// Also don't forget to remove homepage from package.json
//const portal = 'https://siasky.net/';
//const client = new SkynetClient(portal);
const client = new SkynetClient();

// Choose a data domain for saving files in MySky, you can use localhost during development
//const dataDomain = 'localhost';
const dataDomain = '025hekt.hns';

const contentRecord = new ContentRecordDAC();

function App() {
  // Define app state helpers
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [bookmarkUrl, setBookmarkUrl] = useState('');
  const [bookmarkName, setBookmarkName] = useState('');
  const [bookmarks, setBookmarks] = useState([]);
  const [findUserBookmarks, setFindUserBookmarks] = useState([]);
  const [bookmarkSkylink, setBookmarkSkylink] = useState('');
  const [userID, setUserID] = useState('');
  const [findUserID, setFindUserID] = useState('');
  const [mySky, setMySky] = useState(null);
  const [loggedIn, setLoggedIn] = useState(null);

  // choose a personal folder name for saving files in MySky
  const dataKey = 'bookmarks';

  const filePath = dataDomain + '/' + dataKey;

  const loadBookmarks = useCallback(async (props) => {
    if(mySky) {    
      setLoading(true);
      console.log('Loading user data from SkyDB');

      // Use getJSON to load the user's information from SkyDB
      const { data } = await mySky.getJSON(filePath);

      if (data) {
        setBookmarks(data);
        console.log('User data loaded from SkyDB!');
      } else {
        console.error('No user data found on SkyDB');
      }

      setLoading(false);
    }
  }, [filePath, mySky])

  // On initial run, start initialization of MySky
  useEffect(() => {
    async function initMySky() {
      try {
        // load invisible iframe and define app's data domain
        // needed for permissions write
        const mySky = await client.loadMySky(dataDomain);

        // load necessary DACs and permissions
        await mySky.loadDacs(contentRecord);

        const loggedIn = await mySky.checkLogin();

        setMySky(mySky);
        setLoggedIn(loggedIn);

        if (loggedIn) {
          setUserID(await mySky.userID());

          await loadBookmarks();
        }
      } catch (e) {
        console.error(e);
      }
    }

    // call async setup function
    initMySky();
  }, [filePath, loadBookmarks]);

  const handleFindUserSubmit = async (event) => {
    event.preventDefault();
    console.log('Find user bookmarks form submitted');
    setLoading(true);

    try {
      var findUserBookmarks = await client.file.getJSON(findUserID, filePath);

      if (findUserBookmarks && findUserBookmarks.data) {
        setFindUserBookmarks(findUserBookmarks.data);
      } else {
        console.log("No bookmarks found for this users")
      }
    } catch (error) {
      console.log(`error with getJSON: ${error.message}`);
    }

    setLoading(false);
  }

  const handleNewBookmarkSubmit = async (event) => {
    event.preventDefault();
    console.log('New bookmark form submitted');
    setLoading(true);

    console.log('Store bookmark');

    const options = {
      urls: [bookmarkUrl],
      directory: './'
    };
    
    const resources = await scrape(options);
    let webDirectory = {};
    var creationTimestamp = Date.now();
    var lastUpdatedTimestamp = creationTimestamp;
    
    resources.forEach(function(resource) {
      const filename = resource.getFilename();

      const resourceFile = new File(
        [resource.getText()],
        filename,
        {
          type: 'text/' + resource.getType(),
        }
      );

      webDirectory[filename] = resourceFile;
    });

    const dirName = sanitizeFilename(bookmarkUrl, {replacement: '_'}) + "_" + creationTimestamp;
    const { skylink: dirSkylink } = await client.uploadDirectory(
      webDirectory,
      dirName
    );

    // generate a URL for our current portal
    const dirSkylinkUrl = await client.getSkylinkUrl(dirSkylink);

    console.log('Web Page Bookmark Uploaded:', dirSkylinkUrl);

    console.log('Saving user bookmark to MySky file...');

    const newBookmark = {
      bookmarkName,
      bookmarkUrl,
      creationTimestamp,
      lastUpdatedTimestamp,
      dirSkylinkUrl
    };

    setBookmarkSkylink(newBookmark.dirSkylinkUrl)

    bookmarks.push(newBookmark);
    await handleMySkyWrite(bookmarks);
    setBookmarks(bookmarks);

    // Reset form
    setBookmarkName('');
    setBookmarkUrl('');

    setLoading(false);
  };

  const handleMySkyLogin = async () => {
    // Try login again, opening pop-up. Returns true if successful
    const status = await mySky.requestLoginAccess();

    // set react state
    setLoggedIn(status);

    if (status) {
      setUserID(await mySky.userID());
    }
  };

  const handleMySkyLogout = async () => {
    // call logout to globally logout of mysky
    await mySky.logout();

    //set react state
    setLoggedIn(false);
    setUserID('');
  };

  const handleMySkyWrite = async (jsonData) => {
    // Use setJSON to save the user's information to MySky file
    try {
      await mySky.setJSON(filePath, jsonData);
    } catch (error) {
      console.log(`error with setJSON: ${error.message}`);
    }

    try {
      await contentRecord.recordNewContent({
        skylink: jsonData[jsonData.length - 1].dirSkylinkUrl,
        metadata: { action: 'addNewBookmark' },
      });
    } catch (error) {
      console.log(`error with CR DAC: ${error.message}`);
    }
  };

  // loadData will load the users data from SkyDB
  const loadData = async (event) => {
    event.preventDefault();
    await loadBookmarks()
  };

  const handleSaveAndRecord = async (event, bookmark) => {
    event.preventDefault();
    setLoading(true);

    console.log('Saving user data to MySky');

    try {
      // Write data with MySky
      await mySky.setJSON(filePath, bookmarks);

      // We currently only allow changing the name of the bookmark
      await contentRecord.recordInteraction({
        skylink: bookmark.dirSkylinkUrl,
        metadata: { action: 'updatedBookmarkName' },
      });
    } catch (error) {
      console.log(`error with setJSON: ${error.message}`);
    }

    setLoading(false);
  };

  const updateBookmark = async (newBookmarkName, bookmark) => {
    var newBookmarks = bookmarks;
    var newBookmark = newBookmarks.find(x => x === bookmark)
    newBookmark.bookmarkName = newBookmarkName;
    newBookmark.lastUpdatedTimestamp = Date.now();
    setBookmarks(newBookmarks);
  };

  // define args passed to form
  const formProps = {
    mySky,
    handleNewBookmarkSubmit,
    handleFindUserSubmit,
    handleMySkyLogin,
    handleMySkyLogout,
    handleSaveAndRecord,
    updateBookmark,
    loadData,
    bookmarkName,
    bookmarkUrl,
    bookmarks,
    findUserBookmarks,
    activeTab,
    bookmarkSkylink,
    loading,
    loggedIn,
    filePath,
    dataDomain,
    userID,
    findUserID,
    setLoggedIn,
    setBookmarkName,
    setBookmarkUrl,
    setFindUserID,
  };

  // handleSelectTab handles selecting the part of the workshop
  const handleSelectTab = (e, { activeIndex }) => {
    setActiveTab(activeIndex);
  };

  const panes = [
    {
      menuItem: 'My Bookmarks',
      render: () => (
        <Tab.Pane>
          <WorkshopForm {...formProps} />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Find user',
      render: () => (
        <Tab.Pane>
          <WorkshopForm {...formProps} />
        </Tab.Pane>
      ),
    },
  ];

  return (
    <Container>
      <Header
        as="h1"
        content="Sky Bookmarks"
        textAlign="center"
        style={{ marginTop: '1em', marginBottom: '1em' }}
      />
      <Tab
        menu={{ fluid: true, horizontal: "true", tabular: true }}
        panes={panes}
        onTabChange={handleSelectTab}
        activeIndex={activeTab}
      />
    </Container>
  );
}

export default App;
