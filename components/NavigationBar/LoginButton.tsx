"use client";
import React, { useState } from "react";
import { showModal } from "@/lib/showModal";
import { Mail, X, Lock, Eye, EyeOff, CircleUser, LogOut } from "lucide-react";
import SignUp from "../shared/SignUp";
import axios from "axios";
import useUserStore from "@/lib/userStore";
import Link from "next/link";

const LoginButton = () => {
  const { currentUser, setCurrentUser } = useUserStore();

  const [focusedInput, setFocusedInput] = useState<string | null>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [createAccountMessage, setCreateAccountMessage] = useState("");

  const handleLogin = async () => {
    setIsLoading(true);
    await axios
      .post(`/api/user/checkLogin`, {
        email: email,
        password: password,
      })
      .then((res) => {
        setIsLoading(false);
        setCurrentUser(res.data.user);
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogOut = () => {
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <div>
      {/* Login Button UI after user log in */}
      {currentUser ? (
        <div className="dropdown dropdown-bottom dropdown-end">
          <div
            role="button"
            tabIndex={0}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div aria-label="success" className="status status-success"></div>
            <h1>{currentUser.username}</h1>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
          >
            <li>
              <Link href={"/user-profile"}>
                <CircleUser size={15} /> View Profile
              </Link>
            </li>
            <li>
              <button onClick={handleLogOut}>
                <LogOut size={15} />
                Log Out
              </button>
            </li>
          </ul>
        </div>
      ) : (
        // Login Button UI when user is not logged in
        <div>
          <button
            className="btn btn-soft btn-primary hidden sm:block"
            onClick={() => showModal("open_login_modal")}
          >
            Login
          </button>

          <dialog
            id="open_login_modal"
            className="modal modal-bottom sm:modal-middle"
          >
            {isSignUp ? (
              <SignUp
                onClose={() => setIsSignUp(false)}
                message={setCreateAccountMessage}
              />
            ) : (
              <div className="modal-box relative p-8 rounded-xl">
                <form method="dialog">
                  <button
                    className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                    onClick={() => setCreateAccountMessage("")}
                  >
                    <X size={20} />
                  </button>
                </form>

                <h3 className="text-2xl font-semibold mb-2">Welcome Back</h3>
                <p
                  className={`text-sm text-gray-500 ${
                    !createAccountMessage && "mb-10"
                  }`}
                >
                  Log in to save your works
                </p>

                {createAccountMessage && (
                  <div className="my-5">
                    <div className="alert alert-success text-white">
                      <span>{createAccountMessage}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail
                        size={18}
                        className={`transition-colors duration-200 ${
                          focusedInput === "email" || email
                            ? "text-violet-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedInput("email")}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Email address"
                      className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    />
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 ${
                        focusedInput === "email" ? "w-full" : "w-0"
                      }`}
                    ></div>
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock
                        size={18}
                        className={`transition-colors duration-200 ${
                          focusedInput === "password" || password
                            ? "text-violet-500"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedInput("password")}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Password"
                      className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none focus:ring-0 transition-all duration-200 text-gray-800 placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-violet-500 transition-colors duration-200"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                    <div
                      className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 ${
                        focusedInput === "password" ? "w-full" : "w-0"
                      }`}
                    ></div>
                  </div>

                  {/* Login Button */}
                  <button
                    onClick={handleLogin}
                    disabled={isLoading || !email || !password}
                    className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                      isLoading || !email || !password
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shadow-md"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Log In"
                    )}
                  </button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <p className="text-center text-sm text-gray-500">
                  Don't have an account?{" "}
                  <button
                    onClick={() => {
                      setIsSignUp(true);
                      setCreateAccountMessage("");
                    }}
                    className="cursor-pointer font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-purple-700 transition-all duration-200"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            )}
          </dialog>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
