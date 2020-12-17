const mongoose = require("mongoose");
const db = require("../models");
const { v4: uuidv4 } = require('uuid');

mongoose.connect("mongodb://localhost/cncDb", { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

