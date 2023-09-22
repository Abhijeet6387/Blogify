import "./App.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateBlogPost from "./components/CreateBlogPost";
import BlogDetail from "./components/BlogDetail";
import EditBlogPost from "./components/EditBlogPost";
import Dashboard from "./components/Dashboard";
import Blogs from "./components/Blogs";
import Navbar from "./components/Navbar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "dashboard",
    element: (
      <>
        <Navbar />
        <Dashboard />
      </>
    ),
  },
  {
    path: "login",
    element: <Login />,
  },
  {
    path: "register",
    element: <Register />,
  },
  {
    path: "explore",
    element: (
      <>
        <Navbar />
        <Blogs />
      </>
    ),
  },
  {
    path: "create",
    element: (
      <>
        <Navbar />
        <CreateBlogPost />
      </>
    ),
  },
  {
    path: "details/:id",
    element: <BlogDetail />,
  },
  {
    path: "edit/:id",
    element: <EditBlogPost />,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
