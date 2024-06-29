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
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [category, setCategory] = useState(existingCategory || "");
  const [productProps, setProductProps] = useState(existingProperties || {});
  const [goToProducts, setgoToProducts] = useState(false);
  const [images, setImages] = useState(existingImages || []);
  const [isLoading, setisLoading] = useState(false);
  const [saveStatus, setsaveStatus] = useState("Save");
  const [isFormModified, setIsFormModified] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const dragControls = useDragControls();

  const [initialFormValues, setInitialFormValues] = useState({
    title: existingTitle || "",
    description: existingDescription || "",
    price: existingPrice || "",
    images: existingImages || [],
    category: existingCategory || "",
    properties: existingProperties || {},
  });

  useEffect(() => {
    setInitialFormValues({
      title: existingTitle || "",
      description: existingDescription || "",
      price: existingPrice || "",
      images: existingImages || [],
      category: existingCategory || "",
      properties: existingProperties || {},
    });
  }, [
    existingTitle,
    existingDescription,
    existingPrice,
    existingImages,
    existingCategory,
    existingProperties,
  ]);

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
      const data = {
        title,
        description,
        price,
        images,
        properties: productProps,
      };
      if (category) {
        data.category = category;
      } else {
        data.category = null;
      }

      console.log("sending data put", data);
      if (_id) {
        // Update the existing product
        await axios.put(`/api/products/${_id}`, data);
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
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }, []);

  useEffect(() => {
    setIsFormModified(
      title !== initialFormValues.title ||
        description !== initialFormValues.description ||
        price !== initialFormValues.price ||
        images.length !== initialFormValues.images.length ||
        images.some(
          (image, index) => image !== initialFormValues.images[index]
        ) ||
        category !== initialFormValues.category ||
        JSON.stringify(productProps) !==
          JSON.stringify(initialFormValues.properties)
    );
  }, [title, description, price, images, category, productProps]);

  useEffect(() => {
    if (isFormModified) {
      setsaveStatus("Save");
    }
  }, [isFormModified]);

  function setProductProperties(propertyName, value) {
    setProductProps((prev) => {
      const newProperties = { ...prev };
      newProperties[propertyName] = value;
      return newProperties;
    });
  }

  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    console.log({ catInfo });
    if (catInfo?.properties) {
      propertiesToFill.push(...catInfo.properties);
    }

    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id === catInfo.parent._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
    // console.log({ selCatInfo });
  }

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
        <label>Category</label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">Uncategorized</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
        </select>
        {propertiesToFill.length > 0 &&
          propertiesToFill.map((p) => (
            <div className="flex gap-1">
              <div>{p.name}</div>
              <select
                value={productProps[p.name]}
                onChange={(e) => setProductProperties(p.name, e.target.value)}
                className="flex-grow"
              >
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
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
