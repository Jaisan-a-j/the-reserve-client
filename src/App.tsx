import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useAppSelector } from "./hooks/reduxHooks";
import MainPage from "./pages/MainPage";
import BuyOnlinePage from "./pages/BuyOnlinePage";
import MainLayout from "./layouts/MainLayout";
import AuthPage from "./pages/AuthPage";
import FullScreenLoader from "./components/common/FullScreenLoader";

function App() {
  const authLoading = useAppSelector((state) => state.auth.loading);
  const minLoaderDuration = useAppSelector(
    (state) => state.auth.minLoaderDuration ?? 1000,
  );
  const [authLoaderVisible, setAuthLoaderVisible] = useState(false);
  const authStartRef = useRef<number | null>(null);
  const authTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const authVisibleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (authLoading) {
      if (authTimerRef.current) {
        clearTimeout(authTimerRef.current);
        authTimerRef.current = null;
      }
      if (authVisibleTimerRef.current) {
        clearTimeout(authVisibleTimerRef.current);
        authVisibleTimerRef.current = null;
      }
      authStartRef.current = Date.now();

      authVisibleTimerRef.current = setTimeout(() => {
        setAuthLoaderVisible(true);
        authVisibleTimerRef.current = null;
      }, 0);

      return () => {
        if (authVisibleTimerRef.current) {
          clearTimeout(authVisibleTimerRef.current);
          authVisibleTimerRef.current = null;
        }
      };
    }

    if (authLoaderVisible && authStartRef.current !== null) {
      const elapsed = Date.now() - authStartRef.current;
      const remaining = Math.max(0, (minLoaderDuration ?? 1000) - elapsed);
      if (authVisibleTimerRef.current) {
        clearTimeout(authVisibleTimerRef.current);
        authVisibleTimerRef.current = null;
      }
      authTimerRef.current = setTimeout(() => {
        setAuthLoaderVisible(false);
        authTimerRef.current = null;
        authStartRef.current = null;
      }, remaining);
    }

    return () => {
      if (authTimerRef.current) {
        clearTimeout(authTimerRef.current);
        authTimerRef.current = null;
      }
      if (authVisibleTimerRef.current) {
        clearTimeout(authVisibleTimerRef.current);
        authVisibleTimerRef.current = null;
      }
    };
  }, [authLoading, authLoaderVisible, minLoaderDuration]);

  const showLoader = authLoading || authLoaderVisible;
  const loaderText = "Processing...";

  return (
    <>
      {showLoader && <FullScreenLoader text={loaderText} />}
      <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<MainPage />} />
            <Route path="/buy-online" element={<BuyOnlinePage />} />
          </Route>
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
