import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./hooks/reduxHooks";
import { useMinLoader } from "./hooks/useMinLoader";
import { verifyUserThunk } from "./features/auth/authThunk";

import MainPage from "./pages/MainPage";
import BuyOnlinePage from "./pages/BuyOnlinePage";
import CheckoutPage from "./pages/CheckoutPage";
import FoodDetailPage from "./pages/FoodDetailPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import MainLayout from "./layouts/MainLayout";
import FullScreenLoader from "./components/common/FullScreenLoader";

function App() {
  const dispatch = useAppDispatch();
  const authLoading = useAppSelector((state) => state.auth.loading);
  const minDuration = useAppSelector((state) => state.auth.minLoaderDuration ?? 1000);

  const showLoader = useMinLoader(authLoading, minDuration);

  useEffect(() => {
    dispatch(verifyUserThunk());
  }, [dispatch]);

  return (
    <>
      {showLoader && <FullScreenLoader text="Processing..." />}
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/buy-online" element={<BuyOnlinePage />} />
            <Route path="/buy-online/:foodId" element={<FoodDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;