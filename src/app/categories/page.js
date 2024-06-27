"use client";
import { useEffect, useState } from "react";
import Container from "../../../components/container";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withSwal } from "react-sweetalert2";
function Categories({ swal }) {
  const [editedCategory, setEditedCategory] = useState(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  });

  async function saveCategory(event) {
    event.preventDefault();
    const data = { name, parentCategory };
    try {
      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put("/api/categories", data);
        setEditedCategory(null);
      } else {
        await axios.post("/api/categories", data);
      }
      setName("");
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
          axios.delete("/api/categories?_id=" + _id);
        }
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
      <form onSubmit={saveCategory} className="flex gap-1">
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
          <option>No parent category</option>
          {categories.map((category) => (
            <option value={category._id}>{category.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="btn-primary
        py-1"
        >
          Save
        </button>
      </form>
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
    </Container>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
