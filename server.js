var http = require('http');
var express = require('express');
var path = require('path');
const fs = require('fs');
const fs1 = require('fs');
const bodyParser = require('body-parser');
const { POINT_CONVERSION_COMPRESSED } = require('constants');
const app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));
//kreiranje instance sequelize
const sequelize = require("./model/sequelize");

require('./model/modeli')(sequelize);

sequelize.sync({ alter: true }).then(() => {
  console.log("Svi modeli su importovani")
});

//rute sa spirale 3
require('./v1rute')(app);

require('./v2rute')(app);

if (require.main === module) app.listen(3000);

module.exports = app;