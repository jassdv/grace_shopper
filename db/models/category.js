'use strict'

const {STRING} = require('sequelize')

module.exports = db => db.define('categories', {
  name: STRING,
})

module.exports.associations = (Category, {Product}) => {
  // Category.belongsToMany(Product, {through: 'ProductCategory'})
  Category.hasMany(Product)
}
