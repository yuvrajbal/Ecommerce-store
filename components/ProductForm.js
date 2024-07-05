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
  categories: existingCategories,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || "");
  const [selectedCategories, setSelectedCategories] = useState(
    existingCategories || []
  );
  const [isLoading, setisLoading] = useState(false);
  const [productProps, setProductProps] = useState(existingProperties || {});
  const [images, setImages] = useState(existingImages || []);
  const [saveStatus, setsaveStatus] = useState("Save");
  const [isFormModified, setIsFormModified] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  console.log();
  const dragControls = useDragControls();

  const [initialFormValues, setInitialFormValues] = useState({
    title: existingTitle || "",
    description: existingDescription || "",
    price: existingPrice || "",
    images: existingImages || [],
    selectedCategories: existingCategories || [],
    properties: existingProperties || {},
  });

  useEffect(() => {
    setInitialFormValues({
      title: existingTitle || "",
      description: existingDescription || "",
      price: existingPrice || "",
      images: existingImages || [],
      selectedCategories: existingCategories || [],
      properties: existingProperties || {},
    });
  }, [
    existingTitle,
    existingDescription,
    existingPrice,
    existingImages,
    existingCategories,
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
    // if (!isFormModified) {
    //   return;
    // }
    setisLoading(true);
    try {
      const data = {
        title,
        description,
        price,
        images,
        properties: productProps,
      };
      if (selectedCategories.length > 0) {
        data.categories = selectedCategories;
      } else {
        data.categories = [];
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
      // router.push("/products");
    }
  }

  const startDrag = (e) => {
    dragControls.start(e);
  };

  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setAllCategories(response.data);
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
        selectedCategories !== initialFormValues.selectedCategories ||
        JSON.stringify(productProps) !==
          JSON.stringify(initialFormValues.properties)
    );
  }, [title, description, price, images, selectedCategories, productProps]);

  useEffect(() => {
    if (isFormModified) {
      setsaveStatus("Save");
    }
  }, [isFormModified]);

  function handleCategoryChange(value, index) {
    const newCategories = [...selectedCategories];
    newCategories[index] = value;
    setSelectedCategories(newCategories);
  }

  function handleRemoveCategory(index) {
    const newCategories = selectedCategories.filter((_, i) => i !== index);
    setSelectedCategories(newCategories);
  }

  function handleAddCategory() {
    setSelectedCategories([...selectedCategories, ""]);
  }
  function setProductProperties(propertyName, value) {
    setProductProps((prev) => {
      const newProperties = { ...prev };
      newProperties[propertyName] = value;
      return newProperties;
    });
  }

  const propertiesToFill = [];
  if (selectedCategories.length > 0) {
    console.log({ selectedCategories });
    selectedCategories.forEach((categoryId) => {
      // console.log({ category });
      let category = allCategories.find(({ _id }) => _id === categoryId);
      console.log("category properties", category?.properties);
      if (category?.properties) {
        propertiesToFill.push(...category.properties);
        console.log({ propertiesToFill });
      }
    });
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
        {selectedCategories.map((category, index) => (
          <div key={index} className="flex gap-1 mt-2">
            <select
              value={category}
              className="mb-0"
              onChange={(e) => handleCategoryChange(e.target.value, index)}
            >
              <option value="">Select Category</option>
              {allCategories.length > 0 &&
                allCategories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <button
              type="button"
              className="btn-red flex gap-1 items-center"
              onClick={() => handleRemoveCategory(index)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          className="btn-default mt-2"
          onClick={handleAddCategory}
        >
          Add a new Category
        </button>

        {/* <select
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
        </select> */}

        {propertiesToFill.length > 0 &&
          propertiesToFill.map((p) => (
            <div className="">
              <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
              <div>
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
            </div>
          ))}
        <label> Photos</label>
        <div className="mb-2 ">
          <div className="">
            <Reorder.Group
              axis="x"
              values={images}
              onReorder={setImages}
              className="flex flex-row gap-3"
              as="ul"
            >
              {images && images.length > 0 ? (
                images.map((image, index) => (
                  <Reorder.Item
                    key={image}
                    value={image}
                    dragControls={dragControls}
                    className="max-w-fit shadow-sm rounded-sm border border-gray-200 bg-white"
                  >
                    <div
                      className="relative h-24 mb-2 cursor-grab "
                      onPointerDown={(e) => startDrag(e)}
                    >
                      <img
                        key={index}
                        src={image.url || image}
                        alt="product image"
                        className="object-cover rounded-2xl mt-3   pointer-events-none text-sm"
                      />

                      <button
                        type="button"
                        className="absolute -top-5 -right-2 bg-red-400 text-white rounded-full "
                        onClick={() => handleImageDelete(image.url || image)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="size-4"
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
          className="mt-2 ut-button:bg-white ut-button:text-primary ut-button:border ut-button:border-primary ut-button:shadow-md"
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
