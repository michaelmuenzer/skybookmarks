import { Button, Input } from 'semantic-ui-react';

const Auth = (props) => {
    const copyUserIDToClipboard = () => {
        const el = document.getElementById("user-id");
        el.select()
        document.execCommand("copy")
    };

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
                id="user-id"
                icon={{ name: 'copy', circular: false, link: true, onClick: ()=>{copyUserIDToClipboard()}}}
                onClick={() => copyUserIDToClipboard()}
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
  