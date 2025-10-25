"use client";
import React, { useState } from "react";
import { X, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const SignUp = ({
  onClose,
  message,
}: {
  onClose: () => void;
  message: (message: string) => void;
}) => {
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    setIsLoading(true);

    const result = await axios
      .post(`/api/user/createAccount`, {
        uid: uuidv4(),
        username: username,
        email: email || "",
        avatarURL: "",
        password: password,
        join_date: new Date().toISOString(),
      })
      .then((res) => {
        console.log("User created successfully", res.data);
        setTimeout(() => {
          message("Account created sucessfully! You can now login.");
          setIsLoading(false);
          onClose();
        }, 2000);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="modal-box relative p-8 rounded-xl">
      <button
        onClick={onClose}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
      >
        <X size={20} />
      </button>

      <h3 className="text-2xl font-semibold mb-2">Create Account</h3>
      <p className="text-sm text-gray-500 mb-10">Join and start learning!</p>

      <div className="space-y-6">
        {/* Username */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <User
              size={18}
              className={`transition-colors duration-200 ${
                focusedInput === "username" || username
                  ? "text-violet-500"
                  : "text-gray-400"
              }`}
            />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onFocus={() => setFocusedInput("username")}
            onBlur={() => setFocusedInput(null)}
            placeholder="Username"
            className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none text-gray-800 placeholder-gray-400"
          />
          <div
            className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 ${
              focusedInput === "username" ? "w-full" : "w-0"
            }`}
          />
        </div>

        {/* Email */}
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
            className="w-full pl-12 pr-4 py-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none text-gray-800 placeholder-gray-400"
          />
          <div
            className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300 ${
              focusedInput === "email" ? "w-full" : "w-0"
            }`}
          />
        </div>

        {/* Password */}
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
            className="w-full pl-12 pr-12 py-4 bg-gray-50/80 border border-gray-200 rounded-xl focus:outline-none text-gray-800 placeholder-gray-400"
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
          />
        </div>

        {/* Sign Up Button */}
        <button
          onClick={handleSignUp}
          disabled={isLoading || !email || !password || !username}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
            isLoading || !email || !password || !username
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] shadow-md"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Signing up...</span>
            </div>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer font-semibold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent hover:from-violet-700 hover:to-purple-700 transition-all duration-200"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
