import React, { Component } from "react";
import { NavLink } from "react-router-dom";

class Book extends Component {
    state = {};
    render() {
        const { _id, title, author, edition, yearPub, stock, bookImage } = this.props.book;
        return (
            <div className="card my-3 mx-xl-4 align-items-stretch col-xl-5">
                <div className="row m-2 p-2">
                    <div className="col-md-4 col-lg-4">
                        <img
                            src={bookImage}
                            alt="logo"
                            className="card-img"
                        />
                    </div>
                    <div className="col-md-7 col-lg-7 px-3">
                        <div className="card-block px-3">
                            <h4 className="card-title">
                                {title}
                            </h4>
                            <p className="card-text">
                                <strong>Author: </strong>
                                {author}
                            </p>
                            <p className="card-text">
                                <strong>Year of publication: </strong>
                                {yearPub}
                            </p>
                            <p className="card-text">
                                <strong>Edition: </strong>
                                {edition}
                            </p>
                            <p className="card-text">
                                <strong>Stock: </strong>
                                {stock}
                            </p>
                        </div>
                    </div>
                    <div className="col-md-1 col-lg-1 px-3">
                        <ul className="navbar-nav mr-auto mb-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link mx-2" to={"/Put-Book/" + _id + "/" + title + "/" + author + "/" + edition + "/" + yearPub + "/" + stock} exact><i className="fas put-book-icons fa-pencil-alt"></i></NavLink>
                            </li>
                            <li className="nav-item">
                                <i onClick={() => this.props.onDelete(_id)} className="nav-link put-book-icons fas fa-trash-alt mx-2"></i>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
}

export default Book;
