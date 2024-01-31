import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/home",
    element: <HomePage />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
