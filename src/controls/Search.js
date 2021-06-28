import React, { Component } from "react";
import Input from "./Input";

class Search extends Component {
  render() {
    const { handleChange, search } = this.props;

    return (
      <div className="row">
        <div className="col s12">
          <Input
            type="text"
            onChange={handleChange}
            name="search"
            id="Search"
            icon="search"
            value={search}
          />
        </div>
      </div>
    );
  }
}

export default Search;
