import React, { Component } from "react";
import Conditional from "../conditional";
import App from '../../App';
import { NavLink } from "react-router-dom";




class Login extends Component {
    state = {
        email: '',
        password: '',
        isLogin: this.props.isLogin
    };
    handleOnChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleLogin = (e) => {
        e.preventDefault();

        var details = {
            'password': this.state.password,
            'email': this.state.email
        };

        var formBody = [];
        for (var property in details) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        }).then(res => res.json())
            .then(data => {
                if (data.error == null && data != null) {
                    let user = this.parseJwt(data.token).user;
                    this.setState({ isLogin: 1, isAdmin: user.admin, token: data.token });
                    this.props.onLogin(user.admin, data.token);
                } else {
                    alert(data.error);
                }
            });
    }

    parseJwt = (token) => {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64));
    };

    render() {
        return (
            <div>
                <div
                    className="container">
                    <div className="container text-center inline-block p-4 px-5 mx-auto">
                        <form onSubmit={this.handleLogin.bind(this)}>
                            <p>Please log in with your email and password.</p>
                            <div className="form-group">
                                <input onChange={this.handleOnChange.bind(this)} type="email" className="form-control email-text" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" required />
                            </div>
                            <div className="form-group te">
                                <input onChange={this.handleOnChange.bind(this)} type="password" className="form-control password-text" name="password" id="password" placeholder="Password" required />
                            </div>
                            <button type="submit" className="btn badge-pill w-100 btn-ls"><i className="fas fa-sign-in-alt mr-2"></i>Log in</button>
                        </form>
                    </div>
                    <div className="container text-center">
                        <p>Need an account?</p>
                        <NavLink className="btn btn-light m-2" to="/signup" exact ><span className="fa fa-user-plus m-2"></span>Sign up</NavLink>
                    </div >

                </div >

            </div>
        );
    }
}

export default Login;
