import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Navbar extends Component {
    state = {};
    render() {
        return (
            <nav className="navbar sidenav navbar-expand-lg navbar-dark bg-darks ">
                <NavLink className="center-block mr-4" to="#">
                    <img
                        className="img-responsive logo"
                        src={require("./onlibrary2.png")}
                        alt=""
                    />
                </NavLink>
                <div className="sidenav-divider mb-2" />
                <div className="" id="">
                    <ul className="navbar-nav mr-auto mb-auto">
                        <li className="nav-item">
                            <NavLink
                                className="nav-link ml-2"
                                to="/Search"
                                activeStyle={{ color: "#fff" }}
                                exact
                            >
                                <i className="fas fa-search mr-2" />Search{" "}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className="nav-link ml-2 "
                                to="/"
                                activeStyle={{ color: "#fff" }}
                                exact
                            >
                                <i className="fas fa-home mr-2" />Home{" "}
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink
                                className={'nav-link ' + (this.props.isAdmin ? '' : 'disabled')}
                                to="/Add-Book"
                                activeStyle={{ color: "#fff" }}
                                exact
                            >
                                <i className="fas fa-plus fa-07x" />
                                <i className="fas fa-book mr-2" />Add Book
                            </NavLink>
                        </li>
                    </ul>
                    <div className="sidenav-divider my-2" />

                    <ul className="navbar-nav mr-auto mt-auto">
                        <li className="nav-item">
                            <a
                                style={{ cursor: "pointer" }}
                                className="nav-link ml-2 "
                                onClick={() => this.props.onLogout()}
                            >
                                <i className="fas fa-sign-out-alt mr-2" />Log Out{" "}
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navbar;
