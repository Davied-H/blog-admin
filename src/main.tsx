import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./404.tsx";
import AdminLayout from "./layout/AdminLayout";
import MainLayout from "./layout/MainLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Retrieval from "./pages/Admin/Retrieval";
import Login from "./pages/Login";
import "./main.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/admin/",
        element: <AdminLayout />,
        children: [
          {
            path: "dashboard",
            element: <Dashboard />,
          },
          {
            path: "retrieval",
            element: <Retrieval />,
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },

  {
    path: "*",
    element: <NotFoundPage />, // 404 路由
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router} />,
);
