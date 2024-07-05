"use client";
import ProductForm from "../../../../../components/ProductForm";
import Container from "../../../../../components/container";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Editproduct({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);

  // useEffect(() => {
  //   if (!id) {
  //     return;
  //   }
  //   axios.get("/api/products/" + id).then((response) => {
  //     setProduct(response.data);
  //   });
  // }, [id]);

  useEffect(() => {
    let isCancelled = false; // Add a flag to indicate if the component is unmounted

    const fetchCategories = async () => {
      try {
        if (!id) {
          return;
        }
        const response = await axios.get("/api/products/" + id);
        if (!isCancelled) {
          setProduct(response.data);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching products:", error);
        }
      }
    };

    fetchCategories();

    return () => {
      isCancelled = true; // Set the flag to true when the component unmounts
    };
  }, [id]);
  console.log({ product });
  return (
    <Container>
      <h1>Edit Product {product?.title}</h1>

      {product && <ProductForm {...product} />}
    </Container>
  );
}
