import axios from "axios";
export const API_URL = "http://localhost:8800/api-v1";
// export const API_URL = "https://ali-jobfinder.onrender.com/api-v1";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const fetchJobSuggestions = async (uri) => {
  const res = await API(uri, {
    method: "GET",
  });

  return res?.data;
};

export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "jobfinder");
  const cloudId = "djs3wu5bg";

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudId}/image/upload/`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const updateURL = ({
  pageNum,
  query,
  cmpLoc,
  sort,
  navigate,
  location,
  jType,
  exp,
}) => {
  const params = new URLSearchParams();

  if (pageNum && pageNum > 1) {
    params.set("page", pageNum);
  }

  if (query) {
    params.set("search", query);
  }

  if (cmpLoc) {
    params.set("location", cmpLoc);
  }

  if (sort) {
    params.set("sort", sort);
  }

  if (jType) {
    params.set("jtype", jType);
  }

  if (exp) {
    params.set("exp", exp);
  }

  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};

// export function formatDateTime(date) {
//   // Check if the input is a valid Date object
//   if (!(date instanceof Date) || isNaN(date)) {
//     return "Invalid Date";
//   }

//   // Get hours and minutes
//   const hours = date.getHours().toString().padStart(2, "0");
//   const minutes = date.getMinutes().toString().padStart(2, "0");

//   // Format in 24-hour time
//   const formattedTime = `${hours}:${minutes}`;

//   return formattedTime;
// }

export function formatDateTime(val) {
  const date = new Date(val);
  const currentDate = new Date().toDateString();

  if (!(date instanceof Date) || isNaN(date)) {
    return "Invalid Date";
  }

  const isPastDate = date < currentDate;

  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const formattedTime = `${hours}:${minutes}`;

  if (isPastDate) {
    const formattedDate = `${day}/${month}`;
    return `${formattedDate} ${formattedTime}`;
  } else {
    return formattedTime;
  }
}
