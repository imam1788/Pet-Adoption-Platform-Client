import MainLayout from "@/layouts/MainLayout";
import App from "../App";
import Home from "../pages/Home/Home";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children:[
      {
        path: '/',
        Component: Home
      }
    ]
  }
])