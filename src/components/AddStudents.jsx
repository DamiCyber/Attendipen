import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import Swal from "sweetalert2";
import axios from "axios";


const AddStudents = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [classes, setClasses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Retrieve the user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          "https://attendipen-d65abecaffe3.herokuapp.com/classes",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setClasses(response.data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, [navigate]);

  // Validation schema
  const validationSchema = yup.object({
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required")
      .max(28, "Email must be at most 28 characters")
      .min(8, "Email must be at least 8 characters"),
    student_name: yup
      .string()
      .required("Full Name is required")
      .min(3, "Full Name must be at least 3 characters"),
    student_dob: yup
      .string()
      .required("DOB is required"),
    class_id: yup
      .string()
      .required("Class is required"),
    gender: yup.string().oneOf(["Male", "Female", "Other"], "Invalid gender").required("Gender is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      student_name: "",
      student_dob: "",
      gender: "",
      class_id: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const token = localStorage.getItem("token");

      if (!token) {
        Swal.fire({
          title: "Authentication Error",
          text: "Please log in to continue.",
          icon: "error",
          confirmButtonText: "OK",
        });
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          "https://attendipen-d65abecaffe3.herokuapp.com/invites/send_invite",
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire({
            title: "Addmission sent successfully",
            icon: "success",
            confirmButtonText: "OK",
          }).then(() => {

          });
        }
      } catch (error) {
        let errorMessage = "An error occurred. Please try again.";

        if (error.response) {
          errorMessage = error.response.data?.message || errorMessage;

          if (error.response.status === 401) {
            errorMessage = "Your session has expired. Please log in again.";
            localStorage.removeItem("token");
            navigate("/login");
          }
        }

        Swal.fire({
          title: "Error",
          text: errorMessage,
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  return (
       <div className="cove">
       <div className="cover-info">
         <div className="student-details">
           <h1>Student Details</h1>
         </div>
         <div className="form-container">
           <form onSubmit={formik.handleSubmit}>
             <input
               type="email"
               name="email"
               placeholder="Email"
               value={formik.values.email}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
             />
             {formik.touched.email && formik.errors.email && (
               <p className="error">{formik.errors.email}</p>
             )}

             <input
               type="text"
               name="student_name"
               placeholder="Full Name"
               value={formik.values.student_name}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
             />
             {formik.touched.student_name && formik.errors.student_name && (
               <p className="error">{formik.errors.student_name}</p>
             )}

             <input
               type="date"
               name="student_dob"
               placeholder="student dob"
               value={formik.values.student_dob}
               onChange={formik.handleChange}
               onBlur={formik.handleBlur}
             />
             {formik.touched.student_dob && formik.errors.student_dob && (
               <p className="error">{formik.errors.student_dob}</p>
             )}
             <select
               id="class_id"
               name="class_id"
               onChange={formik.handleChange}
               value={formik.values.class_id}
               disabled={loading}
               className={loading ? 'loading' : ''}
             >
               <option value="">Select a class</option>
               {classes.map((cls) => (
                 <option key={cls.id} value={cls.id}>
                   {cls.name}
                 </option>
               ))}
             </select>
             {formik.touched.class_id && formik.errors.class_id && (
               <p className="error">{formik.errors.class_id}</p>
             )}
             <div className="wrap">
               <div className="sel">
                 <select
                   name="gender"
                   value={formik.values.gender}
                   onChange={formik.handleChange}
                   onBlur={formik.handleBlur}
                 >
                   <option value="" label="Select gender" />
                   <option value="Male" label="Male" />
                   <option value="Female" label="Female" />
                   <option value="Other" label="Other" />
                 </select>
                 {formik.touched.gender && formik.errors.gender && (
                   <p className="error rbtn">{formik.errors.gender}</p>
                 )}
               </div>


               <button type="submit">Add Student</button>
             </div>

           </form>
         </div>
       </div>
     </div>
  );
};

export default AddStudents;


