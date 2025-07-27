import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useAuth from "@/hooks/UseAuth";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import TiptapEditor from "./TiptapEditor";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const petCategories = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "fish", label: "Fish" },
  { value: "other", label: "Other" },
];

const AddPet = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Describe your pet here...</p>",
  });

  const formik = useFormik({
    initialValues: {
      petName: "",
      petAge: "",
      category: null,
      location: "",
      shortDesc: "",
      longDesc: "",
      image: null,
    },
    validationSchema: Yup.object({
      petName: Yup.string().required("Pet name is required"),
      petAge: Yup.number()
        .required("Age is required")
        .positive("Must be positive")
        .integer("Must be an integer"),
      category: Yup.object().required("Category is required"),
      location: Yup.string().required("Location is required"),
      shortDesc: Yup.string().required("Short description is required"),
      longDesc: Yup.string().required("Long description is required"),
      image: Yup.mixed().required("Image is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setImageUploading(true);

        const longDescHTML = editor?.getHTML() || "";

        // Upload image to imgbb
        const formData = new FormData();
        formData.append("image", values.image);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        if (!data.success) throw new Error("Image upload failed");

        const imageUrl = data.data.url;

        const newPet = {
          name: values.petName,
          age: values.petAge,
          category: values.category.value,
          location: values.location,
          shortDesc: values.shortDesc,
          longDesc: longDescHTML,
          image: imageUrl,
          adopted: false,
          date: new Date(),
          ownerEmail: user?.email,
          ownerName: user?.displayName,
        };

        const result = await axiosSecure.post("/pets", newPet);

        if (result.data.insertedId) {
          Swal.fire({
            title: "Success!",
            text: "Pet added successfully!",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });

          resetForm();
          setImagePreview(null);
          editor.commands.setContent("<p>Describe your pet here...</p>");

          setTimeout(() => {
            navigate("/dashboard/my-pets");
          }, 2000);
        }
      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong. Please try again!",
        });
      } finally {
        setImageUploading(false);
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-md shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">
        Add a Pet for Adoption
      </h2>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Pet Name */}
        <div>
          <label className="block font-medium text-gray-900 dark:text-gray-200">
            Pet Name
          </label>
          <input
            type="text"
            name="petName"
            onChange={formik.handleChange}
            value={formik.values.petName}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formik.touched.petName && formik.errors.petName && (
            <p className="text-red-500 mt-1">{formik.errors.petName}</p>
          )}
        </div>

        {/* Pet Age */}
        <div>
          <label className="block font-medium text-gray-900 dark:text-gray-200">
            Pet Age (in years)
          </label>
          <input
            type="number"
            name="petAge"
            onChange={formik.handleChange}
            value={formik.values.petAge}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formik.touched.petAge && formik.errors.petAge && (
            <p className="text-red-500 mt-1">{formik.errors.petAge}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium text-gray-900 dark:text-gray-200">
            Pet Category
          </label>
          <Select
            options={petCategories}
            name="category"
            onChange={(option) => formik.setFieldValue("category", option)}
            value={formik.values.category}
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "transparent",
                borderColor: state.isFocused ? "#6366f1" : "#d1d5db",
                color: "inherit",
                boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
                "&:hover": {
                  borderColor: "#6366f1",
                },
              }),
              singleValue: (base) => ({
                ...base,
                color: "inherit",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "white",
                color: "black",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#e0e7ff" : "white",
                color: "black",
                cursor: "pointer",
              }),
            }}
          />
          {formik.touched.category && formik.errors.category && (
            <p className="text-red-500 mt-1">{formik.errors.category}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium text-gray-900 dark:text-gray-200">
            Pet Location
          </label>
          <input
            type="text"
            name="location"
            onChange={formik.handleChange}
            value={formik.values.location}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formik.touched.location && formik.errors.location && (
            <p className="text-red-500 mt-1">{formik.errors.location}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-medium text-gray-900 dark:text-gray-200">
            Short Description
          </label>
          <input
            type="text"
            name="shortDesc"
            onChange={formik.handleChange}
            value={formik.values.shortDesc}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formik.touched.shortDesc && formik.errors.shortDesc && (
            <p className="text-red-500 mt-1">{formik.errors.shortDesc}</p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label className="block font-medium mb-1 text-gray-900 dark:text-gray-200">
            Long Description
          </label>
          <TiptapEditor
            value={formik.values.longDesc}
            onChange={(value) => formik.setFieldValue("longDesc", value)}
          />
          {formik.touched.longDesc && formik.errors.longDesc && (
            <p className="text-red-500 mt-1">{formik.errors.longDesc}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium text-gray-900 dark:text-gray-200">
            Pet Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.currentTarget.files[0];
              formik.setFieldValue("image", file);
              setImagePreview(URL.createObjectURL(file));
            }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded cursor-pointer"
          />
          {formik.touched.image && formik.errors.image && (
            <p className="text-red-500 mt-1">{formik.errors.image}</p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 mt-2 rounded border border-gray-300 dark:border-gray-600"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={imageUploading}
          className="bg-primary text-white dark:text-black px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50 transition"
        >
          {imageUploading ? "Uploading..." : "Add Pet"}
        </button>

      </form>
    </div>
  );
};

export default AddPet;
