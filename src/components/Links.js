import { Button } from 'semantic-ui-react';

// Links is a simple row containing links created during the workshop
const Links = ({ bookmarkSkylink }) => {
  return (
    <>
      {/* Show button to view user's bookmark on skynet once uploaded */}
      {bookmarkSkylink && (
        <Button basic secondary href={bookmarkSkylink} target="_blank">
          View new bookmark on Skynet
        </Button>
      )}
    </>
  );
};

export default Links;
