import React, { Component } from "react";
import Book from "../book/book";
import $ from 'jquery';
import Conditional from "../conditional";
class Search extends Component {
    state = {
        loaded: 0,
        books: [],
        authors: [],
        searchBooks: [],
        searchType: 1,
        yearsPub: [],
        searchString: '',
        authorSearchFilter: '-',
        yearSearchFilter: '-',
        currentPage: 1,
        booksPerPage: 20

    };
    componentDidMount() {
        //AJAX
        fetch('/api/books', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Authorization': 'Bearer ' + this.props.token
            }
        }).then(res => res.json()).then(data => {
            if (data.error == null) {
                let authors = [...new Set(data.data.map(book => book.author))].sort();
                let yearsPub = [...new Set(data.data.map(book => book.yearPub))].sort();
                this.setState({
                    books: data.data,
                    authors,
                    yearsPub,
                    searchBooks: data.data
                });
            } else {
                alert('Oops, we had an error, please reload the page.');
            }
        }).then(() => this.setState({ loaded: 1 }));

    }
    handleClickPage(event) {
        this.setState({
            currentPage: Number(event.target.id)
        });
    }
    handleSearch(event) {
        this.setState({ searchString: event.target.value }, () => this.doSearch());

    }
    handleSearchType(event) {
        if (event.target.id === 'authorFilter')
            this.setState({ searchType: 0 }, () => this.doSearch());
        else
            this.setState({ searchType: 1 }, () => this.doSearch());
    }
    handleAuthorSearchFilter(event) {
        this.setState({ authorSearchFilter: event.target.value }, () => this.doSearch());

    }
    handleYearSearchFilter(event) {
        this.setState({ yearSearchFilter: event.target.value }, () => this.doSearch());

    }
    handleDelete = (id) => {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/books",
            "method": "DELETE",
            "headers": {
                "authorization": "Bearer " + this.props.token
            },
            "contentType": "application/x-www-form-urlencoded",
            "data": {
                '_id': id
            }
        }
        $.ajax(settings).done(function (res) {
            alert('The book was successfully deleted.');
        }).fail(function (res) {
            if (res.status == 403)
                alert('You are not an administrator, you account is read only.');
            else
                alert('Failed while deleting book, please verify your internet connection.');
        });
        this.setState({ loaded: 0 }, () => this.doSearch());

    }
    doSearch = () => {
        let searchBooks, authors, yearsPub;
        if (this.state.searchType) {
            searchBooks = this.state.books.filter(
                (book) => {
                    return book.title.toUpperCase().includes(this.state.searchString.toUpperCase());
                }
            );
        }
        else {
            searchBooks = this.state.books.filter(
                (book) => {
                    return book.author.toLowerCase().includes(this.state.searchString.toLowerCase());
                }
            );
        }
        yearsPub = [...new Set(searchBooks.map(book => book.yearPub))].sort();
        authors = [...new Set(searchBooks.map(book => book.author))].sort();
        if (this.state.yearSearchFilter !== '-') {
            searchBooks = searchBooks.filter((book) => book.yearPub == this.state.yearSearchFilter);
        }
        if (this.state.authorSearchFilter !== '-') {
            searchBooks = searchBooks.filter((book) => book.author.toLowerCase() == this.state.authorSearchFilter.toLowerCase());
        }
        this.setState({
            authors,
            yearsPub,
            searchBooks,
            currentPage: 1
        });
    }
    render() {
        const { searchBooks, currentPage, booksPerPage } = this.state;
        const indexOfLastBook = currentPage * booksPerPage;
        const indexOfFirstBook = indexOfLastBook - booksPerPage;
        const currentSearchBooks = searchBooks.slice(indexOfFirstBook, indexOfLastBook);
        const renderBooks = currentSearchBooks.map((book, index) => {
            return <Book key={index} book={book} onDelete={this.handleDelete} />;
        });
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(searchBooks.length / booksPerPage); i++) {
            pageNumbers.push(i);
        }
        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li
                    className="page-item"
                    key={number}

                >
                    <button className="page-link" key={number} id={number}
                        onClick={this.handleClickPage.bind(this)} style={{ cursor: "pointer", color: "#222" }}>{number}</button>

                </li>
            );
        });
        return (
            <div
                className={
                    this.props.className
                }
            >
                {/*SEARCH*/}
                <div className="fixed-top" style={{ marginLeft: "212px" }}>
                    <div className="fixed-top" style={{ marginLeft: "212px" }}>
                        <div>
                            <input
                                className="search bg-search"
                                id="searchInput"
                                type="text"
                                placeholder="Search..."
                                onChange={this.handleSearch.bind(this)}
                            />
                        </div>
                        <div
                            className="btn-group btn-group-toggle pull-right"
                            data-toggle="buttons"
                        >

                            <label id="bookFilter" onClick={this.handleSearchType.bind(this)} className="btn badge badge-pill search-type active">
                                <input
                                    type="radio"
                                    name="options"
                                    defaultChecked
                                />
                                Book
                            </label>

                            <label id="authorFilter" onClick={this.handleSearchType.bind(this)} className="btn badge badge-pill search-type">
                                <input
                                    type="radio"
                                    name="options"


                                />
                                Author
                            </label>
                        </div>
                    </div>

                    <div className="row filter">
                        <div className="col-6 col-md-5 col-lg-3">
                            <label htmlFor="exampleFormControlSelect1">
                                Author:
                            </label>
                            <select
                                className="form-control filter-select"
                                id="exampleFormControlSelect1"
                                onChange={this.handleAuthorSearchFilter.bind(this)}
                            >
                                <option value='-' key='-1'>-</option>
                                {this.state.authors.map((author, index) => (
                                    <option value={author} key={index + 1}>{author}</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-6 col-md-5 col-lg-3">
                            <label htmlFor="exampleFormControlSelect1">
                                Publication year:
                            </label>
                            <select
                                className="form-control filter-select"
                                onChange={this.handleYearSearchFilter.bind(this)}
                                id="exampleFormControlSelect1"
                            >
                                <option value='-' key='-1'>-</option>
                                {this.state.yearsPub.map((year, index) => (
                                    <option value={year} key={index} > {year}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="text-center my-2 mx-4 p-2">
                        <ul className="pagination">
                            {renderPageNumbers}
                        </ul>
                    </div>
                </div>
                {/*SEARCH*/}
                {/*SEARCH RESULTS*/}

                <div className="result">
                    <Conditional if={this.state.searchBooks < 1 && this.state.searchType && !this.state.loaded}>
                        <h2 className="text-center mt-5" style={{ color: "#ddd" }}>Loading...</h2>
                    </Conditional>
                    <Conditional if={this.state.searchBooks < 1 && this.state.searchType && this.state.loaded}>
                        <h2 className="text-center mt-5" style={{ color: "#ddd" }}>Can't found books with the given title.</h2>
                    </Conditional>
                    <Conditional if={this.state.searchBooks < 1 && this.state.searchType == 0 && this.state.loaded}>
                        <h2 className="text-center mt-5" style={{ color: "#ddd" }}>Can't found books with the given author.</h2>
                    </Conditional>

                    {renderBooks}

                </div>
            </div>
        );
    }
}

export default Search;
