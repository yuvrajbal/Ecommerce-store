"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setgoToProducts] = useState(false);
  // console.log({ _id });

  const router = useRouter();

  async function createProduct(event) {
    event.preventDefault();
    try {
      const data = { title, description, price };
      if (_id) {
        // Update the existing product
        await axios.put("/api/products/" + _id, { ...data, _id });
      } else {
        // Create a new product
        await axios.post("/api/products", data);
      }
      setTitle("");
      setDescription("");
      setPrice("");
      setgoToProducts(true);
    } catch (error) {
      console.error("An error occurred while creating the product:", error);
    }
  }
  useEffect(() => {
    if (goToProducts) {
      router.push("/products");
    }
  }, [goToProducts, router]);

  return (
    <form onSubmit={createProduct}>
      <div className="flex flex-col max-w-sm">
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Description</label>
        <textarea
          placeholder="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Price </label>
        <input
          type="text"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button className="btn-primary" type="submit">
          Save
        </button>
      </div>
    </form>
  );
}
