// import axios from "axios";
// import 'mdb-react-ui-kit/dist/css/mdb.min.css';
// import "@fortawesome/fontawesome-free/css/all.min.css";
// import { useCookies } from "react-cookie";

// const axiosClient = axios.create({
//     baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
// })

// axiosClient.interceptors.request.use((config) => {
//     const [cookies, setCookie, removeCookie] = useCookies(["ACCESS_TOKEN"]);
//     const token = cookies.ACCESS_TOKEN
//     // const token = localStorage.getItem('ACCESS_TOKEN');
//     config.headers.Authorization = `Bearer ${token}`
//     return config;
//   })

// axiosClient.interceptors.response.use((response) => {
//     const [cookies, setCookie, removeCookie] = useCookies(["ACCESS_TOKEN"]);
//     return response
//   }, (error) => {
//     const {response} = error;
//     if (response.status === 401) {
//       // localStorage.removeItem('ACCESS_TOKEN')
//       removeCookie("ACCESS_TOKEN", { path: "/" });
//       window.location.href = '/redirect';
//     } else if (response.status === 404) {
//       //Show not found
//     }
  
//     throw error;
//   })

// export default axiosClient;
import axios from "axios";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";

// Fungsi helper untuk mendapatkan dan mendekode nilai cookie
const getDecodedCookieValue = (name) => {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
};

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
});

axiosClient.interceptors.request.use((config) => {
    const token = getDecodedCookieValue("ACCESS_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    if (response && response.status === 401) {
      document.cookie = "ACCESS_TOKEN=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.href = '/redirect';
    } else if (response && response.status === 404) {
      // Handle not found error
    }

    throw error;
  }
);

export default axiosClient;

