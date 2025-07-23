import MainLayout from "@/layouts/MainLayout";
import App from "../App";
import Home from "../pages/Home/Home";
import { createBrowserRouter } from "react-router";
import Login from "@/auth/Login";
import Register from "@/auth/Register";
import PetListing from "@/pages/PetListing/PetListing";
import PetDetails from "@/pages/PetDetails/PetDetails";
import DonationCampaigns from "@/pages/Donation/DonationCampaigns";
import DonationDetails from "@/pages/Donation/DonationDetails";
import PrivateRoute from "@/routes/PrivateRoute";
import DashboardLayout from "@/pages/Dashboard/DashboardLayout";
import AddPet from "@/pages/Dashboard/AddPet";
import MyPets from "@/pages/Dashboard/MyPets";
import UpdatePet from "@/pages/Dashboard/UpdatePet";

export const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        path: '/',
        Component: Home
      },
      {
        path: 'pets',
        Component: PetListing
      },
      {
        path: "/pets/:id",
        Component: PetDetails
      },
      {
        path: 'donations',
        Component: DonationCampaigns
      },
      {
        path: '/donations/:id',
        element:
          <PrivateRoute>
            <DonationDetails></DonationDetails>
          </PrivateRoute>
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
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        path: 'add-pet',
        Component: AddPet
      },
      {
        path: 'my-pets',
        Component: MyPets
      },
      {
        path: 'update-pet/:id',
        Component: UpdatePet
      }
    ]
  }
])