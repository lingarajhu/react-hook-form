import { FormData } from "../types";

// simulate api call
const simulateApiCall = (
  data: FormData
): Promise<{ success: boolean; data?: FormData; message?: string }> => {
  return new Promise((resolve, reject) => {
    // simulate an error response

    setTimeout(() => {
      if (Math.random() < 0.5) {
        reject({
          success: false,
          message: "Server error occured, Please try again later",
        });
      } else {
        resolve({ success: true, data });
      }
    }, 2000);
  });
};

export default simulateApiCall;
