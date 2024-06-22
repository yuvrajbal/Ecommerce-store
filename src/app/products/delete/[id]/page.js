"use client";
import { useRouter } from "next/navigation";
import Container from "../../../../../components/container";

export default function DeleteProductPage() {
  const router = useRouter();
  function goBack() {
    // Go back to the previous page
    router.push("/products");
  }
  return (
    <Container>
      Do you want to delete this product?
      <button>Yes</button>
      <button onClick={goBack}>No</button>
    </Container>
  );
}
