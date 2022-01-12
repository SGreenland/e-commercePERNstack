import React, { useState, useEffect } from "react";
import { Homepage } from "../App";
import useStore from "../Store";

function OrdersPage() {
  const [orders, setOrders] = useState("");
  const isValidUser = useStore((state) => state.isValidUser);
  async function getOrders() {
    const response = await fetch(
      "https://samsfruitstore-pernstack.herokuapp.com/get_orders",
      {
        credentials: "include",
      }
    );

    if (response.ok) {
      const orders = await response.json();

      setOrders(
        orders.map((order) => {
          return (
            <tr>
              <td>{order.order_id}</td>
              <td>£{(order.amount / 100).toFixed(2)}</td>
              <td>{order.order_date}</td>
            </tr>
          );
        })
      );
    }
  }

  useEffect(() => {
    isValidUser && getOrders();
  }, []);

  return (
    <>
      <Homepage />
      <div className="mainContainer" style={{ paddingTop: "10px" }}>
        <table>
          <thead>
            <th>Order_Id</th>
            <th>Total</th>
            <th>Date</th>
          </thead>
          {orders.length > 0 ? (
            orders
          ) : (
            <td colSpan="3" style={{ textAlign: "center" }}>
              {!isValidUser
                ? "You must be logged in to view any past orders."
                : "Your haven't placed any orders yet!"}
            </td>
          )}
        </table>
      </div>
    </>
  );
}

export default OrdersPage;
