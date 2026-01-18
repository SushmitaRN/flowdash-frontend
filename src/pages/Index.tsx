import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole) {
      navigate(`/${userRole}`);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return null;
};

export default Index;
