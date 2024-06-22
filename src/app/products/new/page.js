"use client";
import { useState } from "react";
import Container from "../../../../components/container";
import axios from "axios";
import { useRouter } from "next/navigation";
import ProductForm from "../../../../components/ProductForm";
export default function NewProduct() {
  return (
    <Container>
      <h1>New Product</h1>
      <ProductForm />
    </Container>
  );
}
