import React from "react";
import ReactDOM from "react-dom";

import "index.scss";

import Application from "components/Application";

// Link to the root id element in the index.html to render the react app
ReactDOM.render(<Application />, document.getElementById("root"));
