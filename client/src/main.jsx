import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "swiper/css";
import "./index.css";
import App from "./App.jsx";
import { store } from "./store/index.js";
import { Skeleton } from "./components/ui/Skeleton.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback={<Skeleton className="mx-auto mt-10 h-96 max-w-6xl rounded-[2rem]" />}>
          <App />
        </Suspense>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
