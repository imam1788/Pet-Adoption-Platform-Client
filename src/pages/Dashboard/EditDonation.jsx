import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import Swal from "sweetalert2";
import TiptapEditor from "./TiptapEditor";

const EditDonation = () => {
  const { id } = useParams(); // donation campaign ID from URL
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch existing campaign data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    axiosSecure.get(`/donation-campaigns/${id}`)
      .then((res) => {
        const data = res.data;

        formik.setValues({
          petName: data.petName || "",
          petImage: null, // We'll keep null here until user uploads a new one
          targetAmount: data.targetAmount || "",
          lastDate: data.lastDate ? data.lastDate.split("T")[0] : "", // format yyyy-mm-dd
          description: data.description || "",
          longDesc: data.longDesc || "",
        });
        setImagePreview(data.petImage || null);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load donation campaign data", "error");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const formik = useFormik({
    initialValues: {
      petName: "",
      petImage: null,
      targetAmount: "",
      lastDate: "",
      description: "",
      longDesc: "",
    },
    enableReinitialize: true, // Important: allow formik to reset values when fetched
    validationSchema: Yup.object({
      petName: Yup.string().required("Pet name is required"),
      // petImage is optional here because user may keep old image
      targetAmount: Yup.number().required("Target amount is required"),
      lastDate: Yup.date().required("Last date is required"),
      description: Yup.string().required("Description is required"),
      longDesc: Yup.string().required("Long description is required"),
    }),
    onSubmit: async (values) => {
      try {
        setImageUploading(true);

        let imageUrl = imagePreview; // default to existing image

        // If user selected new image, upload it
        if (values.petImage) {
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
          imageUrl = data?.data?.url;
        }

        // Prepare updated data (exclude ownerEmail and donatedAmount)
        const updatedData = {
          petName: values.petName,
          petImage: imageUrl,
          targetAmount: Number(values.targetAmount),
          lastDate: values.lastDate,
          description: values.description,
          longDesc: values.longDesc,
        };

        // Send PATCH request to update
        await axiosSecure.patch(`/donation-campaigns/${id}`, updatedData);

        Swal.fire("Success", "Donation campaign updated!", "success");
        navigate("/dashboard/my-campaigns");
      } catch (error) {
        console.error("Update donation error:", error);
        Swal.fire("Error", "Failed to update donation campaign", "error");
      } finally {
        setImageUploading(false);
      }
    },
  });

  if (loading) {
    return <p className="p-6 text-center">Loading campaign data...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Edit Donation Campaign</h2>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Pet Name */}
        <div>
          <label className="block font-medium mb-1">Pet Name</label>
          <input
            type="text"
            name="petName"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.petName}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.petName && formik.errors.petName && (
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
          {formik.touched.petImage && formik.errors.petImage && (
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
            onBlur={formik.handleBlur}
            value={formik.values.targetAmount}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.targetAmount && formik.errors.targetAmount && (
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
            onBlur={formik.handleBlur}
            value={formik.values.lastDate}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.lastDate && formik.errors.lastDate && (
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
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="w-full border px-3 py-2 rounded"
          />
          {formik.touched.description && formik.errors.description && (
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
          {formik.touched.longDesc && formik.errors.longDesc && (
            <p className="text-red-500 text-sm">{formik.errors.longDesc}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={imageUploading}
          className="bg-primary text-white px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50"
        >
          {imageUploading ? "Uploading..." : "Update Campaign"}
        </button>
      </form>
    </div>
  );
};

export default EditDonation;
