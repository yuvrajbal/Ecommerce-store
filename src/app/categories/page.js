"use client";
import { useEffect, useState } from "react";
import Container from "../../../components/container";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withSwal } from "react-sweetalert2";
import { set } from "mongoose";
function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [properties, setProperties] = useState([]);

  // useEffect(() => {
  //   axios.get("/api/categories").then((response) => {
  //     setCategories(response.data);
  //   });
  // });

  useEffect(() => {
    let isCancelled = false; // Add a flag to indicate if the component is unmounted

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/categories");
        if (!isCancelled) {
          setCategories(response.data);
        }
      } catch (error) {
        if (!isCancelled) {
          console.error("Error fetching categories:", error);
        }
      }
    };

    fetchCategories();

    return () => {
      isCancelled = true; // Set the flag to true when the component unmounts
    };
  }, [editCategory]);

  async function saveCategory(event) {
    event.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(","),
      })),
    };
    try {
      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put("/api/categories", data);
        setEditedCategory(null);
      } else {
        await axios.post("/api/categories", data);
      }
      setName("");
      setParentCategory("");
      setProperties([]);
      toast.success("Category saved successfully", {
        position: "bottom-right",
      });
    } catch (error) {
      toast.error("An error occurred while saving the category", {
        position: "bottom-right",
      });
    }
  }
  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(
      category.properties.map(({ name, values }) => ({
        name,
        values: values.join(","),
      }))
    );
  }

  function deleteCategory(category) {
    swal
      .fire({
        title: "Are you sure?",
        text: `Do you want to delete the category ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: "Cancel",
        confirmButtonText: "Yes, Delete!",
        confirmButtonColor: "#d55",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          const { _id } = category;
          try {
            axios.delete(`/api/categories?_id=${_id}`);
          } catch (error) {
            console.error(error);
          }
        }
      });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    console.log(index, property, newName);
    const updatedProperties = [...properties];
    updatedProperties[index] = { ...property, name: newName };
    setProperties(updatedProperties);
  }

  function handlePropertyValuesChange(index, property, newValues) {
    console.log(index, property, newValues);
    const updatedProperties = [...properties];
    updatedProperties[index] = { ...property, values: newValues };
    setProperties(updatedProperties);
  }

  function removeProperty(indextoRemove) {
    setProperties((prev) => {
      return prev.filter((_, i) => i !== indextoRemove);
    });
  }
  return (
    <Container>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit Category ${editedCategory.name}`
          : "Create new category"}
      </label>
      <form onSubmit={saveCategory} className="">
        <ToastContainer autoClose={2000} theme="dark" pauseOnHover={false} />
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            onChange={(e) => setName(e.target.value)}
            className="mb-0 p-1"
            value={name}
          />
          <select
            className="mb-0 max-w-full"
            onChange={(e) => setParentCategory(e.target.value)}
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className="mb-2 mt-2">
          <label className="block">Properties</label>
          <button onClick={addProperty} type="button" className="btn-default  ">
            Add a new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mt-2 ">
                <input
                  className="mb-0"
                  type="text"
                  value={property.name}
                  onChange={(event) =>
                    handlePropertyNameChange(
                      index,
                      property,
                      event.target.value
                    )
                  }
                  placeholder="property name (ex flavour)"
                />
                <input
                  className="mb-0"
                  type="text"
                  value={property.values}
                  onChange={(event) =>
                    handlePropertyValuesChange(
                      index,
                      property,
                      event.target.value
                    )
                  }
                  placeholder="values, comma separated"
                />
                <button
                  onClick={() => removeProperty(index)}
                  className="btn-red"
                  type="button"
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className="flex gap-1">
          {editedCategory && (
            <button
              type="button"
              className="btn-default"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="btn-primary
        py-1"
          >
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
                <td className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-default flex gap-1"
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
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteCategory(category);
                    }}
                    className="btn-red flex gap-1"
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
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Container>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
