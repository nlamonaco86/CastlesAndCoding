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
const Handlebars = require('handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');

app.engine("handlebars", exphbs({ defaultLayout: "main", handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set("view engine", "handlebars");

require("./routes/html-routes")(app);
require("./routes/api-routes")(app);

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

app.listen(port, () => {
    console.log(`The adventure has begun at: http://localhost:${port}`);
});