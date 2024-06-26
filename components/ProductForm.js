"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UploadButton } from "./uploadthing";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragControls, Reorder, useDragControls } from "framer-motion";

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
  const [isLoading, setisLoading] = useState(false);
  const [saveStatus, setsaveStatus] = useState("Save");
  const [isFormModified, setIsFormModified] = useState(false);
  const router = useRouter();

  const dragControls = useDragControls();

  const [initialFormValues, setInitialFormValues] = useState({
    title: existingTitle || "",
    description: existingDescription || "",
    price: existingPrice || "",
    images: existingImages || [],
  });

  useEffect(() => {
    setInitialFormValues({
      title: existingTitle || "",
      description: existingDescription || "",
      price: existingPrice || "",
      images: existingImages || [],
    });
  }, [existingTitle, existingDescription, existingPrice, existingImages]);

  async function handleImageDelete(imageUrl) {
    const imageKey = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

    try {
      const response = await axios.post("/api/uploadthing/delete", {
        key: imageKey,
      });
      if (response.data.success) {
        setImages(images.filter((image) => image !== imageUrl));
        // setIsFormModified(true);
      }
    } catch (error) {
      console.error("An error occurred while deleting the image:", error);
    }
  }

  async function createProduct(event) {
    event.preventDefault();
    if (!isFormModified) {
      return;
    }

    setisLoading(true);

    try {
      // console.log("images updated to before sending", images);
      const data = { title, description, price, images };

      if (_id) {
        // Update the existing product
        await axios.put("/api/products/" + _id, data);
      } else {
        // Create a new product
        await axios.post("/api/products", data);
      }
      // console.log("data that is sent in req", data);

      setInitialFormValues({ ...data });
      setIsFormModified(false);
      setsaveStatus("Saved");
      toast.success("Product saved successfully", { position: "bottom-right" });
    } catch (error) {
      console.error("An error occurred while creating the product:", error);
      toast.error("An error occurred while creating the product", {
        position: "bottom-right",
      });
    } finally {
      setisLoading(false);
    }
  }

  const startDrag = (e) => {
    dragControls.start(e);
  };

  useEffect(() => {
    setIsFormModified(
      title !== initialFormValues.title ||
        description !== initialFormValues.description ||
        price !== initialFormValues.price ||
        images.length !== initialFormValues.images.length ||
        images.some((image, index) => image !== initialFormValues.images[index])
    );
  }, [title, description, price, images]);

  useEffect(() => {
    if (isFormModified) {
      setsaveStatus("Save");
    }
  }, [isFormModified]);

  return (
    <form onSubmit={createProduct}>
      <ToastContainer autoClose={2000} theme="dark" pauseOnHover={false} />
      <div className="flex flex-col  max-w-sm">
        <label>Product name</label>
        <input
          type="text"
          placeholder="product name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label> Photos</label>
        <div className="mb-2 ">
          <div className="">
            <Reorder.Group
              axis="x"
              values={images}
              onReorder={setImages}
              className="flex flex-row gap-1"
              as="ul"
            >
              {images && images.length > 0 ? (
                images.map((image, index) => (
                  <Reorder.Item
                    key={image}
                    value={image}
                    dragControls={dragControls}
                    className="max-w-fit"
                  >
                    <div
                      className="relative h-24 mb-4  cursor-grab"
                      onPointerDown={(e) => startDrag(e)}
                    >
                      <img
                        key={index}
                        src={image.url || image}
                        alt="product image"
                        className="object-cover rounded-2xl mt-3  mr-2 pointer-events-none text-sm"
                      />
                      <h1>{image.url}</h1>
                      <button
                        type="button"
                        className="absolute top-0 right-0 bg-red-400 text-white rounded-full p-0.2 size-6"
                        onClick={() => handleImageDelete(image.url || image)}
                      >
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
                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                        </svg>
                      </button>
                    </div>
                  </Reorder.Item>
                ))
              ) : (
                <p className="text-sm text-gray-600">No images uploaded</p>
              )}
            </Reorder.Group>
          </div>
        </div>

        <UploadButton
          endpoint="imageUploader"
          className="mt-6 ut-button:bg-blue-900"
          onClientUploadComplete={(res) => {
            const newImageURLs = res.map((file) => file.url);
            setImages([...images, ...newImageURLs]);
            setIsFormModified(true);
            // alert("Upload Completed");
          }}
          onUploadError={(error) => {
            // Do something with the error.
            alert(`ERROR! ${error.message}`);
          }}
        ></UploadButton>

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
          {saveStatus}
        </button>
      </div>
    </form>
  );
}
