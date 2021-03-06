import React from 'react'
import { Link } from 'react-router'

const Product = (props) => {
  const product = props.selectedProduct
  const reviews = props.selectedProduct.reviews
  const userId = props.userId
  const addProductToCart = props.onAddProductToCart

  const starMaker = (rating) => {
    let stars = ' '
    for (let i = 1; i <= rating; i++) {
      stars += ' \u2B50'
    }
    return stars
  }

  return (
    <div className="container">
      <h2>{ product.name }</h2>
        <div className="col-xs-5">
          <img src={product.picture}/>
          <h4>${product.price}</h4>
          <h5>{product.description}</h5>
          <button type="button" className="btn btn-default" onClick={() => { return addProductToCart(product, userId) }}>Add To Cart</button>
        </div>
        <div className="col-xs-5">
          <h3>Reviews:</h3>
          {
            reviews && reviews.map(review => (
              <div key={review.id} className="well">
                <h4>{review.title}{starMaker(review.stars)}</h4>
                <h5>{review.text}</h5>
              </div>
            ))
          }
          <h3></h3>
          <h4>Add your review below!</h4>
          {
            <form>
              <div className="form-group">
                <h5>Title:</h5>
                <input type="text" name="product_name" className="form-control"/>
              </div>
              <div className="form-group">
                <h5>Review:</h5>
                <input type="text" name="product_name" className="form-control" placeholder="Hint: you loved it"/>
              </div>
            </form>
          }
        </div>
    </div>
  )
}

export default Product
