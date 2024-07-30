/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { FormData } from "../types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import simulateApiCall from "../api/api";

const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  age: 18,
  gender: "",
  address: { city: "", state: "" },
  hobbies: [{ name: "" }],
  startDate: new Date(),
  subscribe: false,
  referral: "",
};

const SimpleForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [error, setError] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHobbyChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;
    const hobbies = [...formData.hobbies];
    hobbies[idx]["name"] = value;
    setFormData({
      ...formData,
      hobbies,
    });
  };

  const removeHobby = (idx: number) => {
    const hobbies = [...formData.hobbies];
    hobbies.splice(idx, 1);
    setFormData({
      ...formData,
      hobbies,
    });
  };

  const addHobby = () => {
    setFormData({
      ...formData,
      hobbies: [...formData.hobbies, { name: "" }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError({});

    const newErrors: any = {};

    if (!formData.firstName) newErrors.firstName = "First Name is Required";
    if (!formData.lastName) newErrors.lastName = "Last Name is Required";
    if (!formData.email.match(/^\S+@\S+$/i))
      newErrors.email = "Invalid email address";
    if (formData.age < 18) newErrors.age = "You must be over the 18 years";
    if (!formData.gender) newErrors.gender = "Gender must be requried";
    if (!formData.address.city)
      newErrors.address = { city: "City is requried" };
    if (!formData.address.state)
      newErrors.address = { ...newErrors.address, state: "State is requried" };
    formData.hobbies.forEach((hobby, idx) => {
      if (!hobby.name) {
        if (!newErrors.hobbies) newErrors.hobbies = [];
        newErrors.hobbies[idx] = { name: "Hobby name is requried" };
      }
    });

    if (!formData.referral && formData.subscribe)
      newErrors.referral = "Referral source is requried if you are subscribing";

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await simulateApiCall(formData);
      console.log("Success: ", response);
    } catch (error: any) {
      console.error(error);
      setError({ root: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      <div>
        <label>First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        {error.firstName && (
          <p style={{ color: "orangered" }}>{error.firstName}</p>
        )}
      </div>

      <div>
        <label>Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
        {error.lastName && (
          <p style={{ color: "orangered" }}>{error.lastName}</p>
        )}
      </div>

      <div>
        <label>Email</label>
        <input name="email" value={formData.email} onChange={handleChange} />
        {error.email && <p style={{ color: "orangered" }}>{error.email}</p>}
      </div>

      <div>
        <label>Age</label>
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
        {error.age && <p style={{ color: "orangered" }}>{error.age}</p>}
      </div>

      <div>
        <label>Gender</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {error.gender && <p style={{ color: "orangered" }}>{error.gender}</p>}
      </div>

      <div>
        <label>Address</label>
        <input
          name="address.city"
          value={formData.address.city}
          onChange={(e) =>
            handleChange({
              ...e,
              target: { ...e.target, name: "address.city" },
            })
          }
          placeholder="city"
        />
        {error.address?.city && (
          <p style={{ color: "orangered" }}>{error.address.city}</p>
        )}

        <input
          name="address.state"
          value={formData.address.state}
          onChange={(e) =>
            handleChange({
              ...e,
              target: { ...e.target, name: "address.state" },
            })
          }
          placeholder="state"
        />
        {error.address?.state && (
          <p style={{ color: "orangered" }}>{error.address.state}</p>
        )}
      </div>

      <div>
        <label>Start Date</label>
        <DatePicker
          selected={formData.startDate}
          onChange={(date: Date | null) =>
            setFormData({ ...formData, startDate: date || new Date() })
          }
        />
      </div>

      <div>
        <label>Hobbies</label>
        {formData.hobbies.map((hobby, idx) => (
          <div key={idx}>
            <input
              name="name"
              value={hobby.name}
              placeholder="Hobby name"
              onChange={(e) => handleHobbyChange(idx, e)}
            />

            {error.hobbies?.[idx]?.name && (
              <p style={{ color: "orangered" }}>{error.hobbies[idx].name}</p>
            )}

            {formData.hobbies.length > 1 && (
              <button type="button" onClick={() => removeHobby(idx)}>
                Remove Hobby
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addHobby}>
          Add Hobby
        </button>
      </div>

      <div>
        <label htmlFor="sub">Subscribe Us</label>
        <input
          id="sub"
          type="checkbox"
          checked={formData.subscribe}
          onChange={(e) =>
            setFormData({ ...formData, subscribe: e.target.checked })
          }
        />
      </div>

      {formData.subscribe && (
        <div>
          <label>Referral Source</label>
          <input
            type="text"
            value={formData.referral}
            name="referral"
            placeholder="How did you know abt us"
            onChange={handleChange}
          />
          {error.referral && (
            <p style={{ color: "orangered" }}>{error.referral}</p>
          )}
        </div>
      )}

      {error.root && <p style={{ color: "red" }}>{error.root}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default SimpleForm;
