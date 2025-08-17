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
import CreateDonation from "@/pages/Dashboard/CreateDonation";
import MyDonationCampaigns from "@/pages/Dashboard/MyDonationCampaigns";
import EditDonation from "@/pages/Dashboard/EditDonation";
import MyDonations from "@/pages/Dashboard/MyDonations";
import AdoptionRequests from "@/pages/Dashboard/AdoptionRequests";
import AdminRoute from "@/routes/AdminRoute";
import ManageUsers from "@/pages/Dashboard/ManageUsers";
import ManagePets from "@/pages/Dashboard/ManagePets";
import AllDonations from "@/pages/Dashboard/AllDonations";
import Overview from "@/pages/Dashboard/Overview";
import ProfilePage from "@/pages/Dashboard/ProfilePage";

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
        element:
          <PrivateRoute>
            <PetDetails></PetDetails>
          </PrivateRoute>
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
      },
      {
        path: 'create-campaign',
        Component: CreateDonation
      },
      {
        path: 'my-campaigns',
        Component: MyDonationCampaigns
      },
      {
        path: 'edit-campaign/:id',
        Component: EditDonation
      },
      {
        path: 'my-donations',
        Component: MyDonations
      },
      {
        path: 'adoption-requests',
        Component: AdoptionRequests
      },
      {
        path: 'manage-users',
        element:
          <AdminRoute>
            <ManageUsers></ManageUsers>
          </AdminRoute>
      },
      {
        path: 'manage-pets',
        Component: ManagePets
      },
      {
        path: 'manage-donations',
        Component: AllDonations
      },
      {
        path: 'overview',
        Component: Overview
      },
      {
        path: 'profile',
        Component: ProfilePage
      }
    ]
  }
])