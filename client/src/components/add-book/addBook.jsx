import React, { Component } from 'react';
import $ from 'jquery';

class AddBook extends Component {
    state = {
        title: '',
        author: '',
        edition: '',
        year: '',
        stock: '',
        file: null
    }
    handleFileChange = (event) => {
        var fileName = event.target.value;
        //replace the "Choose a file" label
        if (fileName == null) fileName = 'Choose file...';
        $('#customFileInput').next('.custom-file-label').html(fileName);
        this.setState({ file: event.target.files[0] });
    }
    handleOnChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    }
    handleAddBook = () => {
        var form = new FormData();
        form.append("title", this.state.title);
        form.append("author", this.state.author);
        form.append("yearPub", this.state.year);
        form.append("edition", this.state.edition);
        form.append("stock", this.state.stock);
        form.append("bookImage", this.state.file);

        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "/api/books",
            "method": "POST",
            "headers": {
                "authorization": "Bearer " + this.props.token
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }
        $.ajax(settings).done(function (res) {
            alert('The book data was successfully uploaded.');

        }).fail(function (res) {
            if (res.status == 403)
                alert('You are not an administrator, you account is read only.');
            else
                alert('Failed while uploading data, please verify the given data.');
        });
    }
    render() {
        return (
            <div
                className={
                    this.props.className
                }
            >
                <div className="add-container" >
                    <div className="text-center">
                        <h1>Add Book</h1>
                    </div>
                    <div className="form-group">
                        <label>Book Title</label>
                        <input onChange={this.handleOnChange.bind(this)} type="text" className="form-control" name="title" placeholder="Title" />
                    </div>
                    <div className="form-group">
                        <label>Book Author</label>
                        <input onChange={this.handleOnChange.bind(this)} type="text" className="form-control" name="author" placeholder="Author" />
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label>Edition Number</label>
                            <input onChange={this.handleOnChange.bind(this)} type="number" className="form-control" name="edition" min="1" max="200" step="1" placeholder="1" />
                        </div>
                        <div className="form-group col-md-4">
                            <label>Year of Publication</label>
                            <input onChange={this.handleOnChange.bind(this)} type="number" className="form-control" name="year" min="1500" max="2019" step="1" placeholder="2000" />
                        </div>
                        <div className="form-group col-md-4">
                            <label>Stock</label>
                            <input onChange={this.handleOnChange.bind(this)} type="number" className="form-control" name="stock" step="1" min="0" max="99999" placeholder="1" />
                        </div>
                    </div>
                    <label>Select the cover image (.jpg (400x400) less than 3MB)</label>
                    <div className="custom-file mb-3">
                        <input type="file" onChange={this.handleFileChange.bind(this)} id="customFileInput" className="custom-file-input" accept="image/jpeg" required />
                        <label className="custom-file-label">Choose file...</label>
                    </div>
                    <div className="text-center mt-3">
                        <button onClick={this.handleAddBook.bind(this)} className="btn btn-success">Add Book</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddBook;