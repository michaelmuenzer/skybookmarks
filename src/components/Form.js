import {
  Button,
  Icon,
  Form,
  Input,
  Loader,
  Dimmer,
  Segment,
  Divider,
  Grid,
  Label,
} from 'semantic-ui-react';
import Links from './Links';

// WorkshopForm is a simple form used for the Skynet Workshop
const WorkshopForm = (props) => {
  return (
    <>
      <Segment>
        <Dimmer active={props.loading}>
          <Loader active={props.loading} />
        </Dimmer>

        {props.loggedIn === false && (
          <Button color="green" onClick={props.handleMySkyLogin}>
            Login with MySky
          </Button>
        )}
        {props.loggedIn === null && <Button>Loading MySky...</Button>}
        {props.loggedIn === true && (
          <>
            <Button onClick={props.handleMySkyLogout}>
              Logout of MySky
            </Button>
            <Divider />
            {props.activeTab == 0 && (     
              <>
                <Form onSubmit={props.handleNewBookmarkSubmit}>
                  <Form.Field>
                    <label>
                      UserID <i>(Shared across MySky)</i>
                    </label>
                    <Input
                      placeholder="You must Login with MySky..."
                      value={props.userID}
                      disabled
                      icon="user circle"
                      iconPosition="left"
                    />  
                  </Form.Field>
                  <Form.Field>
                    <label>Stored Bookmarks File Path</label>
                    <Input
                      placeholder="You must Login with MySky..."
                      value={props.filePath}
                      disabled
                      icon="file"
                      iconPosition="left"
                    />
                  </Form.Field>
                  <Divider />
                  <Form.Field>
                    <label>Your Bookmarks</label>
                  </Form.Field>
                  <Form.Group inline>
                    <Button
                      icon
                      labelPosition='left'
                      variant="success"
                      disabled={props.loggedIn !== true || !props.filePath}
                      onClick={(e) => {
                        props.loadData(e);
                      }}
                    >
                      <Icon name='refresh' />
                      Refresh
                    </Button>
                  </Form.Group>
                  <Form.Field>
                    <div>
                      {props.bookmarks.map((bookmark) => (
                        <Grid key={bookmark.lastUpdatedTimestamp} columns='equal'>
                          <Grid.Column width={4}>
                            <Form.Input
                              placeholder={bookmark.bookmarkName}
                              onChange={(e) => {
                                props.updateBookmark(e.target.value, bookmark)
                              }}
                            />
                          </Grid.Column>
                          <Grid.Column width={9}>
                            <a href={bookmark.bookmarkUrl} target="_blank">{bookmark.bookmarkUrl}</a>
                          </Grid.Column>
                          <Grid.Column width={1}>
                            <Button
                              icon
                              style={{ marginLeft: '20px' }}
                              variant="success"
                              disabled={
                                props.loggedIn !== true ||
                                !props.filePath
                              }
                              onClick={(e) => {
                                props.handleSaveAndRecord(e, bookmark);
                              }}
                            >
                              <Icon name='save' />
                            </Button>
                          </Grid.Column>
                        </Grid>
                      ))}
                    </div>
                  </Form.Field>
                  <Divider />
                  <Form.Field>
                      <label>New Bookmark</label>
                    </Form.Field>
                  <Form.Group>
                    <Form.Input
                      placeholder="Name"
                      value={props.bookmarkName}
                      onChange={(e) => {
                        props.setBookmarkName(e.target.value);
                      }}
                    />
                    <Form.Input
                      placeholder="URL"
                      value={props.bookmarkUrl}
                      onChange={(e) => {
                        props.setBookmarkUrl(e.target.value);
                      }}
                    />
                  </Form.Group>
                  <Button primary type="submit">
                    Add
                  </Button>
                  <Label pointing="left" basic color="green">
                    Store public bookmark associated to MySky.
                  </Label>
                </Form>
            </>
            )}
            {props.activeTab == 1 && (        
              <>
              <Form onSubmit={props.handleFindUserSubmit}>
                  <Form.Field>
                    <label>
                      UserID
                    </label>
                    <Input
                      placeholder="Enter UserID"
                      icon="user circle"
                      iconPosition="left"
                      onChange={(e) => {
                        props.setFindUserID(e.target.value)
                      }}
                    />  
                  </Form.Field>
                  <Button primary type="submit">
                    Show bookmarks
                  </Button>
                  <Divider />
                  <Form.Field>
                    <label>Bookmarks</label>
                  </Form.Field>
                  <Form.Field>
                    <div>
                      {props.findUserBookmarks.map((bookmark) => (
                        <Grid key={bookmark.lastUpdatedTimestamp} columns='equal'>
                          <Grid.Column>
                            <p>{bookmark.bookmarkName}</p>
                          </Grid.Column>
                          <Grid.Column>
                            <a href={bookmark.bookmarkUrl} target="_blank">{bookmark.bookmarkUrl}</a>
                          </Grid.Column>
                        </Grid>
                      ))}
                    </div>
                  </Form.Field>
                </Form>
              </>
            )}
          </>                
        )}
      </Segment>
      <Links
        bookmarkSkylink={props.bookmarkSkylink}
      />
    </>
  );
};

export default WorkshopForm;
