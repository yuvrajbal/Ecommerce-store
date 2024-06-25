"use client";
import ProductForm from "../../../../../components/ProductForm";
import Container from "../../../../../components/container";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Editproduct({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios.get("/api/products/" + id).then((response) => {
      setProduct(response.data);
    });
  });
  console.log("product", { product });
  return (
    <Container>
      <h1>Edit Product {product?.title}</h1>
      {product && (
        <ProductForm
          _id={product._id}
          title={product.title}
          description={product.description}
          price={product.price}
          images={product.images}
        />
      )}
    </Container>
  );
}
