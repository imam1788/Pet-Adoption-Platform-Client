import { useParams, useNavigate } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import TiptapEditor from "./TiptapEditor";

const petCategories = [
  { value: "dog", label: "Dog" },
  { value: "cat", label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "fish", label: "Fish" },
  { value: "other", label: "Other" },
];

const UpdatePet = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch the pet data
  const { data: petData, isLoading } = useQuery({
    queryKey: ["pet", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/pets/${id}`);
      return res.data;
    },
  });

  // TipTap editor setup
  const editor = useEditor({
    extensions: [StarterKit],
    content: petData?.longDesc || "<p>Loading...</p>",
  });

  useEffect(() => {
    if (editor && petData?.longDesc) {
      editor.commands.setContent(petData.longDesc);
    }
  }, [editor, petData]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      petName: petData?.name || "",
      petAge: petData?.age || "",
      category: petCategories.find((c) => c.value === petData?.category) || null,
      location: petData?.location || "",
      shortDesc: petData?.shortDesc || "",
      longDesc: petData?.longDesc || "",
      image: null, // Will only update if new image uploaded
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
    }),
    onSubmit: async (values) => {
      try {
        setImageUploading(true);
        let imageUrl = petData.image;

        if (values.image) {
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
          if (data.success) {
            imageUrl = data.data.url;
          } else {
            throw new Error("Image upload failed");
          }
        }

        const updatedPet = {
          name: values.petName,
          age: values.petAge,
          category: values.category.value,
          location: values.location,
          shortDesc: values.shortDesc,
          longDesc: editor?.getHTML(),
          image: imageUrl,
        };

        await axiosSecure.patch(`/pets/${id}`, updatedPet);
        navigate("/dashboard/my-pets");
      } catch (error) {
        console.error("Update error:", error);
        alert("Update failed");
      } finally {
        setImageUploading(false);
      }
    },
  });

  if (isLoading || !editor) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-md shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Update Pet</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Pet Name */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Pet Name</label>
          <input
            type="text"
            name="petName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.petName}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formik.touched.petName && formik.errors.petName && (
            <p className="text-red-500 dark:text-red-400">{formik.errors.petName}</p>
          )}
        </div>

        {/* Pet Age */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Pet Age (in years)</label>
          <input
            type="number"
            name="petAge"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.petAge}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formik.touched.petAge && formik.errors.petAge && (
            <p className="text-red-500 dark:text-red-400">{formik.errors.petAge}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Pet Category</label>
          <Select
            options={petCategories}
            name="category"
            onChange={(option) => formik.setFieldValue("category", option)}
            value={formik.values.category}
            className="react-select-container"
            classNamePrefix="react-select"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "transparent",
                borderColor: state.isFocused ? "#2563eb" : "#374151",
                color: "inherit",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#1f2937",
                color: "white",
              }),
              singleValue: (base) => ({
                ...base,
                color: "white",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isFocused ? "#2563eb" : "transparent",
                color: "white",
              }),
            }}
          />
          {formik.touched.category && formik.errors.category && (
            <p className="text-red-500 dark:text-red-400">{formik.errors.category}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Pet Location</label>
          <input
            type="text"
            name="location"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.location}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formik.touched.location && formik.errors.location && (
            <p className="text-red-500 dark:text-red-400">{formik.errors.location}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Short Description</label>
          <input
            type="text"
            name="shortDesc"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.shortDesc}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {formik.touched.shortDesc && formik.errors.shortDesc && (
            <p className="text-red-500 dark:text-red-400">{formik.errors.shortDesc}</p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label className="block font-medium mb-1 text-gray-700 dark:text-gray-300">Long Description</label>
          <TiptapEditor
            editor={editor}
            value={formik.values.longDesc}
            onChange={(value) => formik.setFieldValue("longDesc", value)}
            className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded"
          />
          {formik.touched.longDesc && formik.errors.longDesc && (
            <p className="text-red-500 dark:text-red-400">{formik.errors.longDesc}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300">Pet Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => {
              const file = e.currentTarget.files[0];
              formik.setFieldValue("image", file);
              setImagePreview(URL.createObjectURL(file));
            }}
            className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
          />
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="w-32 mt-2 rounded" />
          ) : (
            <img src={petData.image} alt="Current" className="w-32 mt-2 rounded" />
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={imageUploading}
          className="bg-primary text-white dark:text-black px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50 transition"
        >
          {imageUploading ? "Updating..." : "Update Pet"}
        </button>
      </form>
    </div>
  );
};

export default UpdatePet;
