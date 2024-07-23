import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";

const Login = () => {

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [err, setErr] = useState<String>('');
  const {login} : any = useContext(AuthContext);

  const navigate = useNavigate()

  const handleChange = (e: any) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate('/')
    } catch (err: any) {
      setErr(err.message);
    }
  };

  return (
    <div className="h-screen bg-green-500 flex items-center justify-center">
      <div className="w-2/4 flex bg-white round-sm min-h-[500px] overflow-hidden">
        <div className="flex-1 p-[50px] flex flex-col gap-[10px] bg-white bg-login-background">
          <h1 className="text-3xl text-white">Foodie</h1>
          <span className="text-xl text-white font-bold">Don't you have an account?</span>
          <Link to="/register">
            <button className="w-1/2 p-[10px] border-none bg-white text-green-300 font-bold cursor-pointer">Register</button>
          </Link>
        </div>
        <div className="flex-1 p-[50px] flex-col gap-[20px] justify-center">
          <h1 className="text-black mb-2">Login</h1>
          <form className="flex flex-col gap-[30px]" onSubmit={handleLogin}>
            <input
              className="bg-slate-50 border-none outline-none border-b-black px-[20px] py-[10px]"
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              className="bg-slate-50 border-none outline-none border-b-black px-[20px] py-[10px]"
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            {err && <p className="text-red-400">{err}</p>}
            <button className="w-1/2 p-[10px] border-none bg-green-300 text-white font-bold cursor-pointer" type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;