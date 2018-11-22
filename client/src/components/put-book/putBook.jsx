import React, { Component } from 'react';
import $ from 'jquery';

class AddBook extends Component {

    state = {
        _id: this.props.match.params.id,
        title: this.props.match.params.title,
        author: this.props.match.params.author,
        edition: this.props.match.params.edition,
        year: this.props.match.params.year,
        stock: this.props.match.params.stock,
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
        form.append("_id", this.state._id);
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
            "method": "PUT",
            "headers": {
                "authorization": "Bearer " + this.props.token
            },
            "processData": false,
            "contentType": false,
            "mimeType": "multipart/form-data",
            "data": form
        }
        $.ajax(settings).done(function (res) {
            alert('The book data was successfully updated.');

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
                        <h1>Update Book</h1>
                    </div>
                    <div className="form-group">
                        <label>Book Title</label>
                        <input onChange={this.handleOnChange.bind(this)} type="text" className="form-control" name="title" placeholder="Title" value={this.state.title} />
                    </div>
                    <div className="form-group">
                        <label>Book Author</label>
                        <input onChange={this.handleOnChange.bind(this)} type="text" className="form-control" name="author" placeholder="Author" value={this.state.author} />
                    </div>
                    <div className="form-row">
                        <div className="form-group col-md-4">
                            <label>Edition Number</label>
                            <input onChange={this.handleOnChange.bind(this)} type="number" className="form-control" value={this.state.edition} name="edition" min="1" max="200" step="1" placeholder="1" />
                        </div>
                        <div className="form-group col-md-4">
                            <label>Year of Publication</label>
                            <input onChange={this.handleOnChange.bind(this)} type="number" className="form-control" value={this.state.year} name="year" min="1500" max="2019" step="1" placeholder="2000" />
                        </div>
                        <div className="form-group col-md-4">
                            <label>Stock</label>
                            <input onChange={this.handleOnChange.bind(this)} type="number" className="form-control" value={this.state.stock} name="stock" step="1" min="0" max="99999" placeholder="1" />
                        </div>
                    </div>
                    <label>Select the cover image. (.jpg (400x400) less than 3MB)</label>
                    <div className="custom-file mb-3">
                        <input type="file" onChange={this.handleFileChange.bind(this)} id="customFileInput" className="custom-file-input" accept="image/jpeg" required />
                        <label className="custom-file-label">Choose file...</label>
                        <small>Don't upload an image if you want to keep the actual cover image.</small>
                    </div>

                    <div className="text-center mt-3">
                        <button onClick={this.handleAddBook.bind(this)} className="btn btn-success">Update Book</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddBook;