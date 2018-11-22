import Signup from '../components/signup/signup';
import Login from '../components/login/login';
import Conditional from "../components/conditional";
import App from "../App";



import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

class Main extends Component {
    state = {
        email: '',
        password: '',
        isLogin: 0,
        isAdmin: 0,
        token: ""
    }
    handleLogout = () => {
        this.setState({
            email: '',
            password: '',
            isLogin: 0,
            isAdmin: 0,
            token: ""
        });
    }
    handleLogin = (isAdmin, token) => {
        this.setState({
            isLogin: 1,
            isAdmin,
            token
        });
    }
    render() {
        return (
            <BrowserRouter>
                <div>
                    <div>
                        <Conditional if={!this.state.isLogin}>
                            <div
                                className="container text-center"            >
                                <div className="login-img mx-auto pt-3 mt-3 mb-4">
                                    <img
                                        className="img-fluid"
                                        src={require("./onlibrary-black.png")}
                                    />
                                </div>
                            </div>
                            <hr />
                            <Switch>
                                <Route path="/signup" component={Signup} exact strict />
                                <Route path="/login" render={() => <Login onLogin={this.handleLogin} isLogin={this.state.isLogin} onLogout={this.handleLogout} />} exact strict />
                                <Route render={() => (<Redirect to="/login" />)} />
                            </Switch>
                        </Conditional>
                        <Conditional if={this.state.isLogin}>
                            <App isLogin={this.state.isLogin} isAdmin={this.state.isAdmin} token={this.state.token} onLogout={this.handleLogout} />
                        </Conditional>
                    </div >
                </div >
            </BrowserRouter >
        );
    }
}

export default Main;