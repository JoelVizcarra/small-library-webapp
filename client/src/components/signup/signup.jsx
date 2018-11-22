import React, { Component } from "react";
import { NavLink } from "react-router-dom";




class Signup extends Component {
    state = {
        email: '',
        password: '',
        confirmPassword: ''
    };
    handleOnChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleSignup = () => {
        if (this.state.password !== this.state.confirmPassword) {
            alert("The given passwords don't match");
            return;
        }

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
        fetch('/api/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: formBody
        }).then(res => res.json())
            .then(data => {
                if (data.error == null && data != null) {
                    alert(data.status + ": " + data.user);
                } else {
                    alert(data.error);
                }

            });
    }
    render() {
        return (
            <div>
                <div
                    className="container">
                    <div className="container text-center inline-block p-4 px-5 mx-auto">
                        <p>Please register with an email and password.</p>
                        <div className="form-group">
                            <input onChange={this.handleOnChange.bind(this)} type="email" className="form-control email-text" id="email" name="email" aria-describedby="emailHelp" placeholder="Enter email" required />
                        </div>
                        <div className="form-group">
                            <input onChange={this.handleOnChange.bind(this)} type="password" className="form-control password-text" name="password" id="password" placeholder="Password" required />
                        </div>
                        <div className="form-group">
                            <input onChange={this.handleOnChange.bind(this)} type="password" className="form-control password-text" name="confirmPassword" id="confirmPassword" placeholder="Confirm password" required />
                        </div>
                        <button onClick={this.handleSignup.bind(this)} className="btn badge-pill w-100 btn-ls"><i className="fas fa-user-plus mr-2"></i>Sign up</button>
                    </div>
                    <div className="container text-center">
                        <p>Already have an account?</p>
                        <NavLink className=" btn btn-light m-2" to="/login" exact><span className="fa fa-sign-in-alt m-2"></span>Log in</NavLink>
                    </div >
                </div >
            </div>
        );
    }
}

export default Signup;
