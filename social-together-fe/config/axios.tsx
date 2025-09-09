// // axiosConfig.ts
// import useAuthStore from '@/stores/auth';
// import axios, {
//   AxiosError,
//   AxiosRequestConfig,
//   AxiosResponse,
//   InternalAxiosRequestConfig,
// } from 'axios';
// import { toast } from 'react-toastify';

// const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const instance = axios.create({
//   baseURL,
//   timeout: 5000,
//   withCredentials: true, // gửi cookie refresh token
//   headers: { 'Content-Type': 'application/json' },
// });

// let isRefreshing = false;
// let failedQueue: {
//   resolve: (value?: unknown) => void;
//   reject: (error: unknown) => void;
// }[] = [];

// const processQueue = (error: unknown, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// // ✅ Request Interceptor: Thêm accessToken vào header
// instance.interceptors.request.use(
//   (config: InternalAxiosRequestConfig) => {
//     const { accessToken } = useAuthStore.getState();
//     if (accessToken && config.headers) {
//       config.headers['Authorization'] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => Promise.reject(error)
// );

// // ✅ Response Interceptor chung (gồm cả return .data và xử lý lỗi 401)
// instance.interceptors.response.use(
//   (response: AxiosResponse) => {
//     return response.data; // ✅ Tự động lấy .data
//   },
//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

//     if (error.response) {
//       const status = error.response.status;

//       // ✅ Xử lý lỗi 401 - hết hạn token
//       if (status === 401 && !originalRequest._retry) {
//         if (isRefreshing) {
//           return new Promise((resolve, reject) => {
//             failedQueue.push({ resolve, reject });
//           })
//             .then((token) => {
//               if (originalRequest.headers) {
//                 originalRequest.headers['Authorization'] = `Bearer ${token}`;
//               }
//               return instance(originalRequest);
//             })
//             .catch((err) => Promise.reject(err));
//         }

//         originalRequest._retry = true;
//         isRefreshing = true;

//         try {
//           const { logout, setAccessToken, setUser } = useAuthStore.getState();

//           // ✅ Gọi refresh token
//           const response = await axios.post(
//             `${baseURL}refresh`, // thêm dấu `/`
//             {},
//             { withCredentials: true }
//           );

//           const data = response.data.data as {
//             accessToken: string;
//             _id?: string;
//             email?: string;
//             role?: string;
//             name?: string;
//           };

//           if (!data || !data.accessToken) {
//             throw new Error('Không nhận được accessToken mới từ server');
//           }

//           const user = data._id
//             ? {
//               _id: data._id,
//               email: data.email || '',
//               role: data.role || '',
//               name: data.name || '',
//             }
//             : null;

//           if (user) setUser(user);
//           setAccessToken(data.accessToken);

//           processQueue(null, data.accessToken);
//           isRefreshing = false;

//           if (originalRequest.headers) {
//             originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
//           }

//           return instance(originalRequest);
//         } catch (err) {
//           processQueue(err, null);
//           isRefreshing = false;
//           useAuthStore.getState().logout();
//           toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
//           return Promise.reject(err);
//         }
//       }

//       // ✅ Xử lý lỗi HTTP khác
//       switch (status) {
//         case 400:
//           toast.error('Yêu cầu không hợp lệ (400)');
//           break;
//         case 403:
//           toast.error('Không có quyền truy cập (403)');
//           break;
//         case 404:
//           toast.info('Không tìm thấy tài nguyên (404)');
//           break;
//         case 500:
//           toast.error('Lỗi máy chủ (500)');
//           break;
//         default:
//           toast.error(error.message || 'Đã xảy ra lỗi không xác định');
//       }
//     } else if (error.request) {
//       toast.error('Không thể kết nối đến máy chủ.');
//     } else {
//       toast.error('Lỗi khi gửi yêu cầu: ' + error.message);
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
// export { instance as axiosInstance };
