import React, { Component } from 'react';

class NextPage extends Component{
    checkAutorisation(){
        if(window.sessionStorage.getItem("username")){
            return true;
        }
        return false;
    }
    render(){
        if(this.checkAutorisation()) {
            return(

                <div>
                    <h1> Hello {window.sessionStorage.getItem("username")}</h1>
                </div>
            )
        }else{
            return(
                <div>
                    <p>
                        You need to login first!
                    </p>
                </div>
            )
        }
    }
}

export default NextPage;