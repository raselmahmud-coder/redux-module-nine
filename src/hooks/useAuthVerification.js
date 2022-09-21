import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../features/auth/authSlice";

const useAuthVerification = () => {
  const dispatch = useDispatch();
  const [authLoading, setAuthLoading] = useState(true);
  useEffect(() => {
    const localAuth = localStorage.getItem("auth");
    if (localAuth) {
      const { accessToken, user } = JSON.parse(localAuth) || {};
      if (accessToken && user) {
        dispatch(login({ accessToken, user }));
      }
    }

    setAuthLoading(false);
  }, [dispatch]);

  return authLoading;
};

export default useAuthVerification;
