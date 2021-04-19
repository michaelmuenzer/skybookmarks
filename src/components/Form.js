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

const ContentForm = (props) => {
  return (
    <>
      <Segment>
        <Dimmer active={props.loading}>
          <Loader active={props.loading} />
        </Dimmer>

        {props.loggedIn === true && (
          <>
            {props.activeTab == 0 && (     
              <>
                <Form onSubmit={props.handleNewBookmarkSubmit}>
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
    </>
  );
};

export default ContentForm;
