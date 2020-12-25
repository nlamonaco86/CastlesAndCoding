// // Dependencies
// require('dotenv').config();
// const path = require("path");
// const express = require("express");
// const cors = require('cors');
// const mongoose = require('mongoose');
// const PORT = process.env.PORT || 8080;
// const app = express();

// // Serve static content for the app from the "public" directory
// app.use(express.static("views"));

// // Parse application body as JSON
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // Set Handlebars
// const exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// // Import the models folder
// const db = require("./models");

// //Use the given routes
// require("./routes/html-routes.js")(app);
// require("./routes/api-routes.js")(app);

// // Start the server so it can listening to client requests.
// mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

// app.listen(port, () => {
//     console.log(`The adventure has begun at: http://localhost:${port}`);
// });

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const db = require("./models");

require('dotenv').config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Serve static content for the app from the "public" directory
app.use(express.static("views"));

// Set Handlebars
const exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

require("./routes/html-routes")(app);
require("./routes/api-routes")(app);

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.listen(port, () => {
    console.log(`The adventure has begun at: http://localhost:${port}`);
});