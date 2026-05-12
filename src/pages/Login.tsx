import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import logo from "../assets/icon.jpeg";
import loginHero from "../assets/beverages.jpeg";
import FormButton from "../components/common/Button";
import FormInput from "../components/reservation/FormInput";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 md:p-6">
      <div className="bg-white w-full max-w-[1000px] min-h-[600px] md:rounded-3xl shadow-2xl flex overflow-hidden">
        <div className="hidden md:flex md:w-1/2 relative bg-[#7c5dfa]/5 items-center justify-center p-12">
          <div className="relative z-10 text-center">
            <img
              src={logo}
              alt="The Reserve"
              className="w-20 h-20 mx-auto mb-4 object-contain rounded-2xl"
            />
            <h1 className="text-3xl font-serif font-bold text-[#1e293b]">
              The Reserve
            </h1>
            <p className="text-[#7c5dfa] tracking-[0.2em] uppercase text-xs mt-2 font-semibold">
              Dine. Reserve. Enjoy.
            </p>

            <div className="mt-12 rounded-2xl overflow-hidden shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <img
                src={loginHero}
                alt="Dining Table"
                className="w-full h-64 object-cover"
              />
            </div>
          </div>
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 justify-center">
          <div className="md:hidden text-center mb-8">
            <img
              src={logo}
              alt="The Reserve"
              className="w-16 h-16 mx-auto mb-2 rounded-xl"
            />
            <h1 className="text-2xl font-serif font-bold text-[#1e293b]">
              The Reserve
            </h1>
          </div>

          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#1e293b] mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-500">Login to continue your experience</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm text-gray-700">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                className="w-5 h-5"
                alt="Google"
              />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm text-gray-700">
              <img
                src="https://www.svgrepo.com/show/475647/facebook-color.svg"
                className="w-5 h-5"
                alt="Facebook"
              />
              Facebook
            </button>
          </div>

          <div className="relative flex items-center mb-8">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm uppercase tracking-widest">
              OR
            </span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <FormInput
              label="Email"
              type="email"
              icon={Mail}
              placeholder="Enter your email"
            />

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm font-semibold text-[#7c5dfa] hover:underline"
                >
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#7c5dfa] focus:bg-white outline-none transition-all"
                />
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="grid">
              <FormButton content="Login" />
            </div>
          </form>

          <p className="text-center mt-8 text-gray-600">
            Don't have an account?{" "}
            <a href="#" className="text-[#7c5dfa] font-bold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
