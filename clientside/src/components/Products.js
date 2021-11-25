import React from "react";
import Product from "./Product";
import useStore from "../Store";

function Products() {
  const products = useStore((state) => state.products);

  return (
    <div className="products">
      {products.length
        ? products.map((product) => (
            <Product
              name={product.name}
              key={Math.floor(Math.random() * 1000)}
              detail={product.details}
              price={product.price}
              image={product.image}
              qty={product.qty}
              description={product.description}
            />
          ))
        : "Couldn't find product"}
    </div>
  );
}

export default Products;
