"use client";
import { useState, useEffect } from "react";
import Container from "../../../components/container";
import axios from "axios";
export default function ordersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/orders");
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <Container>
      <h1>list of orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>ID</th>
            <th>Recipient</th>
            <th>Products</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.name} <br />
                  {order.email} <br />
                  {order.number} <br />
                  {order.street} <br />
                </td>
                <td>
                  {order.line_items.map((item, index) => (
                    <div key={index}>
                      <strong>ID:</strong> {item.price_data.product_data.id}
                      <br />
                      <strong>Name:</strong> {item.price_data.product_data.name}
                      <br />
                      <strong>Quantity:</strong> {item.quantity} <br />
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          <tr></tr>
          <tr></tr>
        </tbody>
      </table>
    </Container>
  );
}
