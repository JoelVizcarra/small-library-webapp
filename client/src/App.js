import React, { Component } from "react";
import NavbarPage from "./components/navbar/navbar";
import AddBook from "./components/add-book/addBook";
import PutBook from "./components/put-book/putBook"
import Search from "./components/search/search";
import Home from "./components/home/home";
import Login from "./components/login/login";

import Error from "./components/error/error";
import "./App.css";

import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

class App extends Component {
    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <div>
                        <NavbarPage isAdmin={this.props.isAdmin} onLogout={this.props.onLogout} />
                        <Switch>
                            <Route path="/home"
                                render={() => (
                                    <Home token={this.props.token} className={
                                        "scroll-" + (Math.floor(Math.random() * 5) + 1).toString()
                                    } />
                                )}
                                exact strict />
                            <Route
                                path="/Search" isAdmin={this.props.isAdmin}
                                render={() => (
                                    <Search token={this.props.token} className={
                                        "scroll-" + (Math.floor(Math.random() * 5) + 1).toString()
                                    } />
                                )}
                                exact strict
                            />
                            <Route path="/Add-Book" isAdmin={this.props.isAdmin}
                                render={() => (
                                    this.props.isAdmin ? (<AddBook token={this.props.token} className={
                                        "scroll-" + (Math.floor(Math.random() * 5) + 1).toString()
                                    } />) : (<Redirect to="/home" />)
                                )}
                                exact strict />
                            <Route path="/Put-Book/:id/:title/:author/:edition/:year/:stock" isAdmin={this.props.isAdmin}
                                render={(props) => (
                                    this.props.isAdmin ? (<PutBook {...props} token={this.props.token} className={
                                        "scroll-" + (Math.floor(Math.random() * 5) + 1).toString()
                                    } />) : (<Redirect to="/home" />)
                                )}
                                exact strict />
                            <Route render={() => (<Redirect to="/home" />)}
                                exact strict />
                        </Switch>
                    </div>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}
export default App;
