import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import Swal from "sweetalert2";
import TiptapEditor from "./TiptapEditor";

const CreateDonation = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);

  const formik = useFormik({
    initialValues: {
      petName: "",
      petImage: null,
      targetAmount: "",
      lastDate: "",
      description: "",
      longDesc: ""
    },
    validationSchema: Yup.object({
      petName: Yup.string().required("Pet name is required"),
      petImage: Yup.mixed().required("Pet image is required"),
      targetAmount: Yup.number().required("Target amount is required"),
      lastDate: Yup.date().required("Last date is required"),
      description: Yup.string().required("Description is required"),
      longDesc: Yup.string().required("Long description is required")
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        setImageUploading(true);

        // Upload image to imgbb
        const formData = new FormData();
        formData.append("image", values.petImage);
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        const imageUrl = data?.data?.url;

        // Prepare donation campaign data
        const donationData = {
          petName: values.petName,
          petImage: imageUrl,
          targetAmount: Number(values.targetAmount),
          lastDate: values.lastDate,
          description: values.description,
          longDesc: values.longDesc,
          createdAt: new Date(),
          ownerEmail: user?.email,
          donatedAmount: 0, // initialize
        };

        // Save to DB
        const result = await axiosSecure.post("/donation-campaigns", donationData);
        if (result.data.insertedId) {
          Swal.fire("Success", "Donation campaign created!", "success");
          resetForm();
          setImagePreview(null);
          navigate("/dashboard/my-campaigns");
        }

        setImageUploading(false);
      } catch (error) {
        console.error("Create donation error:", error);
        Swal.fire("Error", "Failed to create donation campaign", "error");
        setImageUploading(false);
      }
    },
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Create Donation Campaign</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Pet Name */}
        <div>
          <label className="block font-medium mb-1">Pet Name</label>
          <input
            type="text"
            name="petName"
            onChange={formik.handleChange}
            value={formik.values.petName}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.errors.petName && formik.touched.petName && (
            <p className="text-red-500 text-sm">{formik.errors.petName}</p>
          )}
        </div>

        {/* Pet Image */}
        <div>
          <label className="block font-medium mb-1">Pet Image</label>
          <input
            type="file"
            name="petImage"
            accept="image/*"
            onChange={(e) => {
              const file = e.currentTarget.files[0];
              formik.setFieldValue("petImage", file);
              setImagePreview(URL.createObjectURL(file));
            }}
            className="w-full border px-3 py-2 rounded"
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 mt-2 rounded border"
            />
          )}
          {formik.errors.petImage && formik.touched.petImage && (
            <p className="text-red-500 text-sm">{formik.errors.petImage}</p>
          )}
        </div>

        {/* Target Amount */}
        <div>
          <label className="block font-medium mb-1">Target Amount</label>
          <input
            type="number"
            name="targetAmount"
            onChange={formik.handleChange}
            value={formik.values.targetAmount}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.errors.targetAmount && formik.touched.targetAmount && (
            <p className="text-red-500 text-sm">{formik.errors.targetAmount}</p>
          )}
        </div>

        {/* Last Date */}
        <div>
          <label className="block font-medium mb-1">Last Date of Donation</label>
          <input
            type="date"
            name="lastDate"
            onChange={formik.handleChange}
            value={formik.values.lastDate}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.errors.lastDate && formik.touched.lastDate && (
            <p className="text-red-500 text-sm">{formik.errors.lastDate}</p>
          )}
        </div>

        {/* Short Description */}
        <div>
          <label className="block font-medium mb-1">Short Description</label>
          <input
            type="text"
            name="description"
            onChange={formik.handleChange}
            value={formik.values.description}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.errors.description && formik.touched.description && (
            <p className="text-red-500 text-sm">{formik.errors.description}</p>
          )}
        </div>

        {/* Long Description */}
        <div>
          <label className="block font-medium mb-1">Long Description</label>
          <TiptapEditor
            value={formik.values.longDesc}
            onChange={(value) => formik.setFieldValue("longDesc", value)}
          />
          {formik.errors.longDesc && formik.touched.longDesc && (
            <p className="text-red-500 text-sm">{formik.errors.longDesc}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={imageUploading}
          className="bg-primary text-white dark:text-black px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50 transition"
        >
          {imageUploading ? "Uploading..." : "Create Campaign"}
        </button>
      </form>
    </div>
  );
};

export default CreateDonation;
