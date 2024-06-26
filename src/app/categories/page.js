"use client";
import { useEffect, useState } from "react";
import Container from "../../../components/container";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
export default function Categories() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  useEffect(() => {
    axios.get("/api/categories").then((response) => {
      setCategories(response.data);
    });
  }, [categories]);

  async function saveCategory(event) {
    event.preventDefault();

    try {
      await axios.post("/api/categories", { name, parentCategory });
      setCategories([...categories, { name }]);
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

  return (
    <Container>
      <h1>Categories</h1>
      <label>New category name</label>
      <form onSubmit={saveCategory} className="flex gap-1">
        <input
          type="text"
          placeholder="Category name"
          onChange={(e) => setName(e.target.value)}
          className="mb-0 p-1"
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
                <Link href={"/products"}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4 mt-1"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                    />
                  </svg>
                  Edit
                </Link>
                <Link href={"/products"}>Delete</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
