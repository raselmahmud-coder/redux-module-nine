import { useSelector } from "react-redux/es/exports";
const useAuth = () => {
  const { auth } = useSelector((state) => state);
  const { accessToken, user } = auth || {};
  if (accessToken && user) {
    return true;
  } else {
    return false;
  }
};

export default useAuth;
