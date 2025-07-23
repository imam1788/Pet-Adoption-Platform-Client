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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Add a Pet for Adoption</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Pet Name */}
        <div>
          <label className="block font-medium">Pet Name</label>
          <input
            type="text"
            name="petName"
            onChange={formik.handleChange}
            value={formik.values.petName}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.petName && formik.errors.petName && (
            <p className="text-red-500">{formik.errors.petName}</p>
          )}
        </div>

        {/* Pet Age */}
        <div>
          <label className="block font-medium">Pet Age (in years)</label>
          <input
            type="number"
            name="petAge"
            onChange={formik.handleChange}
            value={formik.values.petAge}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.petAge && formik.errors.petAge && (
            <p className="text-red-500">{formik.errors.petAge}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium">Pet Category</label>
          <Select
            options={petCategories}
            name="category"
            onChange={(option) => formik.setFieldValue("category", option)}
            value={formik.values.category}
          />
          {formik.touched.category && formik.errors.category && (
            <p className="text-red-500">{formik.errors.category}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium">Pet Location</label>
          <input
            type="text"
            name="location"
            onChange={formik.handleChange}
            value={formik.values.location}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.location && formik.errors.location && (
            <p className="text-red-500">{formik.errors.location}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-medium">Short Description</label>
          <input
            type="text"
            name="shortDesc"
            onChange={formik.handleChange}
            value={formik.values.shortDesc}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.shortDesc && formik.errors.shortDesc && (
            <p className="text-red-500">{formik.errors.shortDesc}</p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label className="block font-medium mb-1">Long Description</label>
          <TiptapEditor
            value={formik.values.longDesc}
            onChange={(value) => formik.setFieldValue("longDesc", value)}
          />
          {formik.touched.longDesc && formik.errors.longDesc && (
            <p className="text-red-500">{formik.errors.longDesc}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium">Pet Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.currentTarget.files[0];
              formik.setFieldValue("image", file);
              setImagePreview(URL.createObjectURL(file));
            }}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.image && formik.errors.image && (
            <p className="text-red-500">{formik.errors.image}</p>
          )}
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 mt-2 rounded"
            />
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={imageUploading}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
        >
          {imageUploading ? "Uploading..." : "Add Pet"}
        </button>
      </form>
    </div>
  );
};

export default AddPet;
