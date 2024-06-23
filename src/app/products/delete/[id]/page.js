"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Container from "../../../../../components/container";
import axios from "axios";

export default function DeleteProductPage({ params }) {
  const { id } = params;
  const router = useRouter();
  console.log(params);
  const [productInfo, setProductInfo] = useState({});

  useEffect(() => {
    axios.get("/api/products/" + id).then((response) => {
      setProductInfo(response.data);
    });
  }, []);
  console.log(productInfo);

  function goBack() {
    // Go back to the previous page
    router.push("/products");
  }

  function deleteProduct() {
    axios.delete("/api/products/" + id).then(() => {
      goBack();
    });
  }
  return (
    <Container>
      Do you want to delete {productInfo?.title} ?
      <div className="flex gap-2">
        <button className="btn-red" onClick={deleteProduct}>
          Yes
        </button>
        <button className="btn-primary" onClick={goBack}>
          No
        </button>
      </div>
    </Container>
  );
}
