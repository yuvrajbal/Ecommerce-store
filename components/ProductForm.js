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
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleImageDelete(imageUrl) {
    setDeleting(true);
    const imageKey = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

    try {
      const response = await axios.post("/api/uploadthing/delete", {
        key: imageKey,
      });
      if (response.data.success) {
        setImages(images.filter((image) => image !== imageUrl));
      }
    } catch (error) {
      console.error("An error occurred while deleting the image:", error);
    } finally {
      setDeleting(false);
    }
  }

  async function createProduct(event) {
    event.preventDefault();
    try {
      const data = { title, description, price, images };

      if (_id) {
        // Update the existing product
        await axios.put("/api/products/" + _id, data);
      } else {
        // Create a new product
        await axios.post("/api/products", data);
      }
      console.log("data that is sent in req", data);
      setTitle("");
      setDescription("");
      setPrice("");
      setImages([]);
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
      <div className="flex flex-col  max-w-sm">
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label> Photos</label>
        <div className="mb-2 flex flex-wrap gap-2">
          {images && images.length > 0 ? (
            images.map((image, index) => (
              <div>
                <img
                  key={index}
                  src={image.url || image}
                  alt="product image"
                  className="size-20 object-cover rounded-lg"
                />
                <button>
                  <svg
                    onClick={() => handleImageDelete(image.url || image)}
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
                      d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-600">No images uploaded</p>
          )}
        </div>
        <UploadButton
          endpoint="imageUploader"
          className="mt-6"
          onClientUploadComplete={(res) => {
            // Do something with the response

            // console.log("Files: ", res);

            const newImageURLs = res.map((file) => file.url);
            setImages([...images, ...newImageURLs]);
            alert("Upload Completed");
          }}
          onUploadError={(error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        />

        {console.log("images", images)}
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
