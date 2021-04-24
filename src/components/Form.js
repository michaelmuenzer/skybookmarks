import {
  Button,
  Icon,
  Form,
  Loader,
  Dimmer,
  Divider,
  Grid,
} from 'semantic-ui-react';

import InputSearchButton from './InputSearchButton';

const ContentForm = (props) => {
  return (
    <>
        <Dimmer active={props.loading}>
          <Loader active={props.loading} />
        </Dimmer>

        {props.loggedIn === true && (
          <>
            {props.activeTab == 0 && (     
              <>
                <Form>
                  <Form.Field>
                    <label>Your Bookmarks</label>
                  </Form.Field>
                  <Form.Field>
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
                  </Form.Field>
                </Form>
                <Divider />
                <Form onSubmit={props.handleNewBookmarkSubmit}>
                  <Form.Field>
                      <label>Add Bookmark</label>
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
                </Form>
            </>
            )}
            {props.activeTab == 1 && (        
              <>
              <Form onSubmit={props.handleFindUserSubmit}>
                  <Form.Field>
                    <InputSearchButton {...props} />
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
    </>
  );
};

export default ContentForm;
