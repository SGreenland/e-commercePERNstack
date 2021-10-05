import React from "react";
import useStore from "../Store";
import {cartStore} from "../Store";

function Product({ name, price, image, qty, description, detail }) {
  const cartItems = cartStore((state) => state.cartItems);
  let product = {name, qty, price, description}

  function animateCart() {
     document.getElementById("carty").style.animation = "bounce 250ms";

     setTimeout(() => document.getElementById("carty").style.animation = "none", 500)
    
  }
  


  function addToCart() {

    cartItems.push(product);

    
    for (let i=0; i<cartItems.length; i++) {
      if (cartItems[i].name === name) {
        cartItems[i].qty++
        cartItems[i].price = cartItems[i].qty * price
      }
      
    }
      
    

    const state = useStore.getState().itemCount;
    cartStore.setState({cartItems: cartItems})

    useStore.setState({ itemCount: state + 1 });
    animateCart();
  }

  return (
    <div className="product">
      <div id="innerProd">
      <div style={{fontWeight: "500"}}>{name}<span style={{fontWeight: "lighter"}}> {detail}</span></div>
      <div id="prodImg">{image}
      <div id="prodDescrip">{description}</div>
      </div>
      
      <div>£{price}0</div>
      <button className="addToCart" onClick={addToCart}>
        Add to Cart
      </button>
      </div>
    </div>
  );
}

export default Product;
