const API_URL = import.meta.env.PROD 
  ? import.meta.env.VITE_API_URL || "https://smart-attendance-tracker-0cyy.onrender.com" 
  : "/api";

export default API_URL;
