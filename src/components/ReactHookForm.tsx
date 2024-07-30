/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { FormData } from "../types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import simulateApiCall from "../api/api";
import {
  useForm,
  Controller,
  useFieldArray,
  SubmitHandler,
} from "react-hook-form";

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

const ReactHookForm: React.FC = () => {
  const {
    register,
    formState: { errors, isSubmitting },
    control,
    handleSubmit,
    getValues,
    setError,
  } = useForm<FormData>({ defaultValues: initialFormData });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "hobbies",
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const response = await simulateApiCall(data);
      console.log("Success: ", response);
    } catch (error: any) {
      console.error(error);
      setError("root", { message: error.message });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ display: "flex", flexDirection: "column", gap: 6 }}
    >
      <div>
        <label>First Name</label>
        <input
          {...register("firstName", { required: "First Name is requried" })}
        />
        {errors.firstName && (
          <p style={{ color: "orangered" }}>{errors.firstName.message}</p>
        )}
      </div>

      <div>
        <label>Last Name</label>
        <input
          {...register("lastName", { required: "Last name is requried" })}
        />
        {errors.lastName && (
          <p style={{ color: "orangered" }}>{errors.lastName.message}</p>
        )}
      </div>

      <div>
        <label>Email</label>
        <input
          {...register("email", {
            required: "Email is requried",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email id" },
          })}
        />
        {errors.email && (
          <p style={{ color: "orangered" }}>{errors.email.message}</p>
        )}
      </div>

      <div>
        <label>Age</label>
        <input
          {...register("age", {
            required: "Age is requried",
            min: { value: 18, message: "Age must be greater than 18" },
          })}
        />
        {errors.age && (
          <p style={{ color: "orangered" }}>{errors.age.message}</p>
        )}
      </div>

      <div>
        <label>Gender</label>
        <select {...register("gender", { required: "Gender is requried" })}>
          <option value="">Select...</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        {errors.gender && (
          <p style={{ color: "orangered" }}>{errors.gender.message}</p>
        )}
      </div>

      <div>
        <label>Address</label>
        <input
          {...register("address.city", {
            required: "City address is requried",
          })}
          placeholder="city"
        />
        {errors.address?.city && (
          <p style={{ color: "orangered" }}>{errors.address.city.message}</p>
        )}

        <input
          {...register("address.state", {
            required: "State address is requried",
          })}
          placeholder="state"
        />
        {errors.address?.state && (
          <p style={{ color: "orangered" }}>{errors.address.state.message}</p>
        )}
      </div>

      <div>
        <label>Start Date</label>
        <Controller
          control={control}
          name="startDate"
          render={({ field }) => (
            <DatePicker
              onChange={(date: Date | null) => field.onChange(date)}
              selected={field.value}
            />
          )}
        />
      </div>

      <div>
        <label>Hobbies</label>
        {fields.map((hobby, idx) => (
          <div key={hobby.id}>
            <input
              {...register(`hobbies.${idx}.name`, {
                required: "Hobby is requried",
              })}
            />

            {errors.hobbies?.[idx]?.name && (
              <p style={{ color: "orangered" }}>
                {errors.hobbies[idx]?.name?.message}
              </p>
            )}

            {fields.length > 1 && (
              <button type="button" onClick={() => remove(idx)}>
                Remove Hobby
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => append({ name: "" })}>
          Add Hobby
        </button>
      </div>

      <div>
        <label htmlFor="sub">Subscribe Us</label>
        <input id="sub" type="checkbox" {...register("subscribe")} />
      </div>

      {getValues("subscribe") && (
        <div>
          <label>Referral Source</label>
          <input
            {...register("referral", {
              required: "Referral is requried if you are subscribibg",
            })}
            placeholder="How did you here about us?"
          />
          {errors.referral && (
            <p style={{ color: "orangered" }}>{errors.referral.message}</p>
          )}
        </div>
      )}

      {errors.root && <p style={{ color: "red" }}>{errors.root.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default ReactHookForm;
