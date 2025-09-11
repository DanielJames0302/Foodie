import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { getAxiosErrorMessage } from "../../utils/error";

const Register = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState<string>("");

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const registerMutation = useMutation({
    mutationFn: (inputs: Object) => {
      return axios.post("http://localhost:8080/api/auth/register", inputs);
    },
    onError: (error: unknown) => {
      setErr(getAxiosErrorMessage(error, "Unable to register. Please try again."));
    },
  })

  const handleClick = async (e: any) => {
    e.preventDefault();
    try {
      await registerMutation.mutateAsync(inputs);
      setErr("");
      navigate("/login");
    } catch (error) {
      // onError will set the message; keep here just in case mutateAsync throws
      setErr(getAxiosErrorMessage(error, "Unable to register. Please try again."));
    }
  };


  return (
    <div className="h-screen bg-green-500 flex items-center justify-center">
      <div className="w-2/4 flex flex-row-reverse bg-white rounded-sm min-h-[600px] overflow-hidden">
        <div className="flex-1 bg-login-background bg-cover p-[50px] flex flex-col gap-[30px] text-white">
          <h1 className="text-3xl">Foodie</h1>
          <span className="text-lg">Do you have an account?</span>
          <Link to="/login">
            <button className="w-2/4 p-[10px] border-none bg-white font-bold cursor-pointer text-green-500">Login</button>
          </Link>
        </div>
        <div className="flex-1 p-[50px] flex gap-[50px] flex-col justify-center">
          <h1 className="text-black">Register</h1>
          <form className="flex flex-col gap-[30px] *:border-none *:border-b-black *:p-4 *:outline-none *:bg-slate-50">
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />
            {err && <p className="text-red-400">{err}</p>}
          </form>
          <button className="w-2/4 p-[10px] border-none bg-green-500 text-white font-bold cursor-pointer" onClick={handleClick}>Register</button>
        </div>
      </div>
    </div>
  );
};

export default Register;