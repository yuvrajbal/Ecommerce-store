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

  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  });

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
        <div className="flex gap-1">
          <input
            type="text"
            placeholder="Category name"
            onChange={(e) => setName(e.target.value)}
            className="mb-0 p-1"
            value={name}
          />
          <select
            className="mb-0"
            onChange={(e) => setParentCategory(e.target.value)}
            value={parentCategory}
          >
            <option value="">No parent category</option>
            {categories.map((category) => (
              <option value={category._id}>{category.name}</option>
            ))}
          </select>
        </div>
        <div className=" mb-2 mt-2">
          <label className="block">Properties</label>
          <button onClick={addProperty} type="button" className="btn-default  ">
            Add a new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div className="flex gap-1 mt-2">
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
                  className="btn-default"
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
                <td className="flex gap-2">
                  <button
                    onClick={() => editCategory(category)}
                    className="btn-primary p-0"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteCategory(category);
                    }}
                    className="btn-primary"
                  >
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
