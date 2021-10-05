import React from "react";
import useStore from "../Store";
import {cartStore} from "../Store";
// import _ from 'lodash';

export default function CartItem({ item, total }) {
  const cartItems = cartStore((state) => state.cartItems);
  const products = useStore((state) => state.products);


  function removeItem() {
    let newSlice = cartItems.slice();

    newSlice.splice(newSlice.indexOf(item), 1);

    cartStore.setState({ cartItems: newSlice });

    const currentItems = useStore.getState().itemCount;
    useStore.setState({ itemCount: currentItems - 1 });
  }

  var currentItems = cartStore.getState().cartItems;
  var product = products.filter((product) => product.name === item.name);

  function addQty() {
    for (let i = 0; i < currentItems.length; i++) {
      if (currentItems[i].name === item.name) {
        currentItems[i].qty = item.qty + 1;
        currentItems[i].price = item.price + product[0].price;
      }
    }

    const updatedItems = currentItems.slice();

    cartStore.setState({ cartItems: updatedItems });

    // console.log(updatedItems);
  }

  function minusQty() {
    for (let i = 0; i < currentItems.length; i++) {
      if (currentItems[i].name === item.name && item.qty > 1) {
        currentItems[i].qty = item.qty - 1;
        currentItems[i].price = item.price - product[0].price;
      }
    }

    const updatedItems = currentItems.slice();

    cartStore.setState({ cartItems: updatedItems });
  }

  return (
    <tr id="cartItems">
      <td>{item.name}</td>
      <td>£{item.price.toFixed(2)}</td>
      <td id="qtybtnContainer">
        <button id="qtybtn" onClick={minusQty}>
          -
        </button>
        <div style={{paddingInline: "3px"}}>{item.qty}</div>
        <button id="qtybtn" onClick={addQty}>
          +
        </button>
      </td>
      <td className="deleteField">
        <button className="cartBtns" onClick={removeItem}>
          delete
        </button>
      </td>
    </tr>
  );
}
