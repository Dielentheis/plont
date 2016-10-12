'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user');
var Plant = require('./models/plant');
var Plot = require('./models/plot');

Plot.belongsToMany(Plant, {through: 'plot_plants'});
Plant.belongsToMany(Plot, {through: 'plot_plants'});
Plant.belongsToMany(User, {through: 'user_plants'});
User.belongsToMany(Plant, {through: 'user_plants'});
User.hasMany(Plot);
Plot.belongsTo(User);
