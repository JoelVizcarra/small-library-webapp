import React, { Component } from "react";
class Home extends Component {
    state = {};
    render() {
        return (
            <div
                className={
                    this.props.className
                }
            >
                <div className="container">
                    <div className="add-container">
                        <h1 className="text-center">Welcome to OnLibrary</h1>
                        <p>With this WebApp you will be capable of managing your small library, we offer the following functions:</p>
                        <ul>
                            <li>Create new users.</li>
                            <li>Adding Books. (administrator)</li>
                            <li>Search Books:
                                <ul>
                                    <li>Search by title or author.</li>
                                    <li>Year and author filter.</li>
                                </ul>
                            </li>
                            <li>Update Books. (administrator)</li>
                        </ul>
                    </div>

                </div>
            </div>

        );
    }
}

export default Home;
