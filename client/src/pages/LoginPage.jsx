/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function LoginPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        const res = await axios.post("/api/v1/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.result));
        navigate("/");
      } else {
        const res = await axios.post("/api/v1/auth/register", formData);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.result));
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Make sure backend is running and connected.");
    }
  };

  return (
    <div className="md:grid md:grid-cols-7">
      <div className="col-start-1 col-end-5 min-h-screen flex items-center justify-center">
        <Card color="transparent" shadow={false}>
          <Typography variant="h4" color="blue-gray">
            {isLogin ? "Sign In" : "Create account"}
          </Typography>
          <Typography color="gray" className="mt-1 font-normal mb-4">
            {isLogin ? "Welcome back!" : "Start your journey with us today."}
          </Typography>

          {error && <Typography color="red" className="mb-4">{error}</Typography>}

          <form className="mt-8 mb-2 w-80 max-w-screen-lg" onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col gap-6 items-center">
              {!isLogin && (
                <Input size="lg" label="Name" name="name" value={formData.name} onChange={handleChange} required />
              )}
              <Input size="lg" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
              <Input type="password" size="lg" label="Password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            {!isLogin && (
              <Checkbox
                label={
                  <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center font-normal"
                  >
                    I agree the
                    <a
                      href="#"
                      className="font-medium transition-colors hover:text-blue-500"
                    >
                      &nbsp;Terms and Conditions
                    </a>
                  </Typography>
                }
                containerProps={{ className: "-ml-2.5" }}
                required
              />
            )}
            <Button type="submit" className="mt-6 bg-red-500" fullWidth>
              {isLogin ? "Sign In" : "Create account"}
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-red-500 transition-colors hover:text-red-700"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </Typography>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default LoginPage;
