'use strict'

const db = require('APP/db')
const User = db.model('users')
const Orders = db.model('orders')
const Oauth = db.model('oauths')
const Review = db.model('reviews')
const OrderItem = db.model('orderItem')
const Products = db.model('products')

const { mustBeLoggedIn, forbidden, selfOnly, isAdmin, selfOrAdmin } = require('./auth.filters')

// The forbidden middleware will fail *all* requests to list users.
// Remove it if you want to allow anyone to list all users on the site.
//
// If you want to only let admins list all the users, then you'll
// have to add a role column to the users table to support
// the concept of admin users.
// forbidden('listing users is not allowed')
// consider me because you can't get all users right now. Remove this and add validation that assertAdmin -- KHCL
// req.user (from deserializeUser) tells us if there is a logged in user. And they will have all the properties that a user instance has -- KHCL

module.exports = require('express').Router()
  .get('/', forbidden('you are not an admin'),
    (req, res, next) =>
      User.findAll()
        .then(users => res.json(users))
        .catch(next))
  .post('/', // expect some validation on who can set admin if used for signup conditional about should we login -- KHCL
    (req, res, next) =>
      User.create(req.body)
      .then(user => res.status(201).json(user))
      .catch(next))
  .get('/:id',
    selfOrAdmin,
    (req, res, next) => {
      User.findById(req.params.id, {include: [{model: Orders, include: [{model: OrderItem, include: [Products]}]}]})
      .then(user => res.json(user))
      .catch(next)
    })
  // MPM adding a new route below to get all orders by a user
  .get('/:id/orders', /* mustBeLoggedIn, */
    (req, res, next) => {
      const userId = req.params.id
      Orders.findAll({
        where: {
          user_id: userId
        }
      }).then(orders => res.json(orders))
      .catch(next)
    })
  .get('/:id/orders/:orderId', mustBeLoggedIn, // this could be handled in orders route with conditional before sending response -- KHCL */
    (req, res, next) => {
      const userId = req.params.id
      const orderId = req.params.orderId
      Orders.findOne({
        where: {
          id: orderId,
          user_id: userId
        } // may just return the first order anyway -- KHCL
      }).then((order) => res.json(order))
      .catch(next)
    })
  .put('/:id', selfOnly, (req, res, next) => { // instead of selfOnly, use selfOrAdmin???
    // MPM fix User.update, but we'll also need to do a selfOrAdmin check, right?
    const userId = req.params.id
    const data = req.body // can they change their own isAdmin? -- KHCL
    User.update({data}, { where: {id: userId} })
    .spread((affectedUsers) => User.findById(userId))
    .then((user) => res.json(user))
    .catch(next)
  })
  // fix this one too
  .delete('/:id', forbidden('Only an admin can do that'), (req, res, next) => { // security -- kHCL
    const userId = req.params.id
    User.destroy({ where: {id: userId} })
      .then((affectedRows) => {
        if (affectedRows === 0) {
          res.status(404)
          // ???not sending error object which potentially might log useless errors without stack trace. Also not going catch, going to next .then -- KHCL
        } else {
          return User.findAll()
        }
      })
      .then(users => res.json(users))
      .catch(next) // catch(next) -- KHCL
  })
