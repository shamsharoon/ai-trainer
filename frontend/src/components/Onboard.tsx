import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Prepifi.png";

function Onboard() {
  const [formData, setFormData] = useState({
    fullName: "",
    pronouns: "",
    educationLevel: "",
    title: "",
    company: "",
    jobDescription: "",
  });

  const [errors, setErrors] = useState({
    fullName: false,
    pronouns: false,
    educationLevel: false,
    title: false,
    company: false,
    jobDescription: false,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrors({
      ...errors,
      [name]: false,
    });
  };

  const handleSubmit = () => {
    const newErrors = {
      fullName: formData.fullName === "",
      pronouns: formData.pronouns === "",
      educationLevel: formData.educationLevel === "",
      title: formData.title === "",
      company: formData.company === "",
      jobDescription: formData.jobDescription === "",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      navigate("/mockInterview", { state: { formData } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={Logo} alt="" />
      <div className="w-[30%]">
        <h2 className="font-black mt-1 text-center">PERSONAL INFO</h2>
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className={`mt-4 p-2 border w-[100%] border-gray-300 rounded placeholder-gray-400 ${
            errors.fullName ? "border-red-500" : ""
          }`}
        />
        <div className="flex justify-between gap-2">
          <select
            name="pronouns"
            value={formData.pronouns}
            onChange={handleChange}
            className={`mt-4 p-2 border w-[100%] border-gray-300 rounded text-gray-400 placeholder-gray-400 ${
              errors.pronouns ? "border-red-500" : ""
            }`}
          >
            <option value="" disabled>
              Select Pronouns
            </option>
            <option value="he/him">He/Him</option>
            <option value="she/her">She/Her</option>
            <option value="they/them">They/Them</option>
            <option value="other">Other</option>
          </select>
          <select
            name="educationLevel"
            value={formData.educationLevel}
            onChange={handleChange}
            className={`mt-4 p-2 border border-gray-300 rounded text-gray-400 ${
              errors.educationLevel ? "border-red-500" : ""
            }`}
          >
            <option value="" disabled>
              Education Level
            </option>
            <option value="highSchool">High School</option>
            <option value="associate">Associate's Degree</option>
            <option value="bachelor">Bachelor's Degree</option>
            <option value="master">Master's Degree</option>
            <option value="doctorate">Doctorate</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="w-[30%]">
        <h2 className="font-black mt-10 text-center">JOB INFO</h2>
        <div className="flex justify-between gap-2">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className={`mt-4 p-2 border w-[100%] border-gray-300 rounded placeholder-gray-400 ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={handleChange}
            className={`mt-4 p-2 border w-[100%] border-gray-300 rounded placeholder-gray-400 ${
              errors.company ? "border-red-500" : ""
            }`}
          />
        </div>
        <textarea
          name="jobDescription"
          placeholder="Job Description"
          value={formData.jobDescription}
          onChange={handleChange}
          className={`mt-4 p-2 border w-[100%] border-gray-300 rounded placeholder-gray-400 ${
            errors.jobDescription ? "border-red-500" : ""
          }`}
          rows={4}
        />
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-[10%] p-2 bg-[#5379ce] text-white rounded-full hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}

export default Onboard;
