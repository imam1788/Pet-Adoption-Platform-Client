import MainLayout from "@/layouts/MainLayout";
import App from "../App";
import Home from "../pages/Home/Home";
import { createBrowserRouter } from "react-router";
import Login from "@/auth/Login";
import Register from "@/auth/Register";

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children:[
      {
        path: '/',
        Component: Home
      },
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]
  }
])