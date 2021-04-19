import { Button, Input } from 'semantic-ui-react';
  
const Auth = (props) => {
    return (
        <>
        {props.loggedIn === false && (
            <Button color="green" onClick={props.handleMySkyLogin}>
            Login
            </Button>
        )}

        {props.loggedIn === null && <Button>Loading MySky...</Button>}

        {props.loggedIn === true && (
            <>
            <Input
                placeholder="You must Login with MySky..."
                value={props.userID}
                disabled
                icon="user circle"
                iconPosition="left"
            />  
            <Button onClick={props.handleMySkyLogout}>
            Logout
            </Button>
            </>
        )}
        </>
    );
};
  
export default Auth;
  