import React from "react";
import { Input } from 'semantic-ui-react';

const InputSearchButton = (props) => (
    <Input 
        value={props.findUserID}
        action={{ 
                icon: 'search',
                color: 'blue',
            }}
        onChange= {e => props.setFindUserID(e.target.value)}
        placeholder='Search UserID' 
    />
);

export default InputSearchButton