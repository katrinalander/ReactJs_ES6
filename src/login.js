import React from 'react';

import { observer } from "mobx-react";
// import * as mobx from 'mobx';
import mobx, { observable, computed } from "mobx";

class TodoLogin{
    @observable username ='';

    constructor(){
        mobx.autorun(() => console.log(">>>"+this.username+"<<<"));
    }

    setLogin(name){
        console.log("previous username is: "+this.username+" set new username: "+name);
        this.username = name;
        window.sessionStorage.setItem("username",name);
    }

    @computed get getLogin(){
        if(window.sessionStorage.getItem('username')===undefined){
            console.log("get username: "+this.username);
            return this.username;
        }
        return window.sessionStorage.getItem('username');
    }
}
const doLogin = new TodoLogin();
// const username = doLogin.getLogin;//

@observer
class Login extends React.Component{
    constructor(props){
        super(props);
        this.name=this.getUsername();
    }

    render(){
        return(
            <div>
                <div>
                    <label>Please Enter Your Username to Login:</label>
                </div>
                <p>!!! {doLogin.username}</p>
                <input
                    type="text"
                    placeholder="username"
                    onChange={e => this.name=e.target.value}/>
                <button type="submit" style={style} onClick={this.newUsername}>Submit</button>
                <button style={style} onClick={this.getUsername}>Get user name: {doLogin.username}</button>
            </div>
        )
    }

    getUsername = () =>{
        this.name=doLogin.getLogin;
        // var xhr = new XMLHttpRequest();
        // xhr.
    };

    newUsername = () =>{
        // console.log("this.name="+this.name+"doLogin.username"+doLogin.username);
        // doLogin.username = this.name;
        doLogin.setLogin(this.name);
    }
}

const style = {
    margin: 15,
};

export default Login;