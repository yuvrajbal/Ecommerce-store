"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UploadButton } from "./uploadthing";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [goToProducts, setgoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
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

  function uploadImages(event) {
    const files = event.target?.files;
    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
      }
      try {
        axios
          .post("/api/products/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            console.log("response from server", response.data);
            setImages(response.data.files);
          });
      } catch (error) {
        console.error("An error occurred while uploading the images:", error);
      }
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

        <label> Photos</label>
        <div className="mb-2">
          {/* <label className="flex  items-center justify-center text-center size-24 border text-gray-500 bg-gray-50 rounded-lg text-sm cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            Upload
            <input
              type="file"
              className="hidden"
              onChange={uploadImages}
              multiple
            />
          </label> */}
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              // Do something with the response
              console.log("Files: ", res);
              alert("Upload Completed");
            }}
            onUploadError={(error) => {
              // Do something with the error.
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>

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
