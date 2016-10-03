'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user');
var Plant = require('./models/plant');
var Plot = require('./models/plot');

Plot.belongsToMany(Plant, {through: 'PlotPlants'});
Plant.belongsToMany(Plot, {through: 'PlotPlants'});
User.hasMany(Plot);
Plot.belongsTo(User);
