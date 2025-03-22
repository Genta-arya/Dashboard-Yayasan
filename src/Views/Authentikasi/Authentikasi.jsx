import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { responseHandler } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const Authentikasi = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    username: "",
    password: "",
  });

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      navigate("/");
    } catch (error) {
    } finally {
      setIsLoading(false);
      responseHandler(response);
    }
  };

  return (
    <div className="flex justify-center mt-24  items-center min-h-screen bg-gray-100">
      <Card className="md:w-full w-80  md:max-w-2xl bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-extrabold text-green-800 border-b-4 border-gray-500">
            Al-Jihad Center
          </CardTitle>
          <img src="/LOGO-SMP.ico" alt="Logo" className="mx-auto mt-4" />
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                required
                id="username"
                type="text"
                placeholder="Enter your username"
              />
            </div>
            <div className="relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                required
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
                type={showPassword ? "text" : "password"}
                placeholder="********"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-3 top-9 transform -translate-y-1/4 text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <Button
              className="w-full mt-2 border hover:bg-green-800 hover:text-white transition-all"
              type="submit"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Authentikasi;
