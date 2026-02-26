import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter} from "react-router";
import {RouterProvider} from "react-router";
import './index.css'; 
import Layout from './components/Layout';
import Home from './pages/Home';
import Legal from './pages/Legal';
import Register from './pages/Register';
import Login from "./pages/Login";
import Thanks from "./pages/Thanks";
import Contest from "./pages/Contest";
import Forgot from "./pages/Forgot";
import LosePage from "./pages/LosePage";
import WinPage from "./pages/WinPage";
import Result from "./pages/Result";


const router = createBrowserRouter(
  [
    {
      path: "/", Component: Layout,
      children: [
        { index: true, Component: Home },
        { path: "legal", Component: Legal },
        { path: "register", Component: Register }, 
        { path: "login", Component: Login },
        { path: "thanks", Component: Thanks },
        { path: "forgot", Component: Forgot },
        { path: "contest", Component: Contest },
        { path: "lose", Component: LosePage },
        { path: "win", Component: WinPage },
        { path: "result", Component: Result }
      ],
    },
  ],
  {
    basename: "/scratchwin",
  }
);


const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <RouterProvider router={router} />
)


console.log("Application has started successfully.");