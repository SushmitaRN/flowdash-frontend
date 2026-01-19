import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Users, BarChart3, Lock, LogIn, Loader2 } from "lucide-react";
import { useAuth } from "./AuthContext";

const COLOR_PRIMARY = "#0000cc";

const HARDCODED_CREDENTIALS = {
  projectManager: {
    email: "pm@dotspeaks.com",
    password: "pm123456",
  },
  manager: {
    email: "manager@dotspeaks.com",
    password: "manager123",
  },
  employee: {
    email: "employee@dotspeaks.com",
    password: "employee123",
  },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const quickLogin = (type: keyof typeof HARDCODED_CREDENTIALS) => {
    setEmail(HARDCODED_CREDENTIALS[type].email);
    setPassword(HARDCODED_CREDENTIALS[type].password);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter email and password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      localStorage.clear();

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.role);
      localStorage.setItem("userEmail", data.email);

      setUser({
        id: data.userId,
        email: data.email,
        role: data.role.toLowerCase(),
      });

      toast({
        title: "Login successful",
        description: `Welcome ${data.email}`,
      });

      navigate(`/${data.role.toLowerCase()}`);
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-xl border-t-4" style={{ borderTopColor: COLOR_PRIMARY }}>
        <CardHeader className="text-center">
          <img
            src="https://i0.wp.com/dotspeaks.com/wp-content/uploads/2025/07/Dotspeaks-logo.png"
            className="mx-auto w-48 mb-4"
          />
          <CardTitle style={{ color: COLOR_PRIMARY }}>
            Sign In to Your Account
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full"
              style={{ backgroundColor: COLOR_PRIMARY }}
            >
              {loading ? (
                <Loader2 className="animate-spin mr-2" />
              ) : (
                <LogIn className="mr-2" />
              )}
              Login
            </Button>
          </form>

          <div className="mt-6 border-t pt-4 space-y-2">
            <Button variant="outline" onClick={() => quickLogin("projectManager")} className="w-full">
              <Users className="mr-2 h-4 w-4" /> Project Manager
            </Button>
            <Button variant="outline" onClick={() => quickLogin("manager")} className="w-full">
              <BarChart3 className="mr-2 h-4 w-4" /> Manager
            </Button>
            <Button variant="outline" onClick={() => quickLogin("employee")} className="w-full">
              <Lock className="mr-2 h-4 w-4" /> Employee
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
