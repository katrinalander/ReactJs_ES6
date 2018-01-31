import React from 'react';

export default (item) => {
    return (<span>{item.accountName+' #'+item.id}</span>);
};