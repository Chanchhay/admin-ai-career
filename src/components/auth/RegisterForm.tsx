"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function RegisterForm() {
  const [accountType, setAccountType] = useState<"job-seeker" | "recruiter">(
    "job-seeker",
  );
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    username?: string;
    email?: string;
    password?: string;
  }>({});
  const [touched, setTouched] = useState<{
    fullName?: boolean;
    username?: boolean;
    email?: boolean;
    password?: boolean;
  }>({});

  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      username?: string;
      email?: string;
      password?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", {
        accountType,
        fullName,
        username,
        email,
        password,
      });
      // Handle registration logic here
    }
  };

  const handleBlur = (
    field: "fullName" | "username" | "email" | "password",
  ) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side with gradient background and illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-blue-100 to-blue-200 items-center justify-center p-8">
        <div className="relative">
          <Image
            src="/images/login-illustration.png"
            alt="Register illustration"
            width={450}
            height={450}
            priority
            className="w-full h-auto drop-shadow-lg"
          />
        </div>
      </div>

      {/* Right side with white background and form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            Create Account
          </h1>
          <p className="text-gray-600 mb-8">
            Choose your account type and start your journey with us
          </p>

          {/* Account Type Selection */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <label
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                accountType === "job-seeker"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setAccountType("job-seeker")}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="accountType"
                  value="job-seeker"
                  checked={accountType === "job-seeker"}
                  onChange={() => setAccountType("job-seeker")}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-900">Job seeker</span>
                {accountType === "job-seeker" && (
                  <span className="ml-auto text-green-500 text-xl">✓</span>
                )}
              </div>
              <p className="text-xs text-gray-600">
                People looking for work by company
              </p>
            </label>

            <label
              className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                accountType === "recruiter"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 bg-white"
              }`}
              onClick={() => setAccountType("recruiter")}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="accountType"
                  value="recruiter"
                  checked={accountType === "recruiter"}
                  onChange={() => setAccountType("recruiter")}
                  className="w-4 h-4"
                />
                <span className="font-semibold text-slate-900">Recruiter</span>
                {accountType === "recruiter" && (
                  <span className="ml-auto text-green-500 text-xl">✓</span>
                )}
              </div>
              <p className="text-xs text-gray-600">
                Companies that need to recruit individuals
              </p>
            </label>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="rounded-lg border p-3 flex items-center justify-center"
            >
              <Image
                src="/images/google.png"
                alt="Google"
                width={20}
                height={20}
              />
            </button>

            <button
              type="button"
              className="rounded-lg border p-3 flex items-center justify-center"
            >
              <Image
                src="/images/github.png"
                alt="GitHub"
                width={30}
                height={30}
              />
            </button>
            {/* <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition">
              <span className="text-sm font-medium">Facebook</span>
            </button> */}
            {/* <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition">
              <span className="text-sm font-medium">Git Hub</span>
            </button> */}
            {/* <button type="button" className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition">
              <span className="text-sm font-medium">Telegram</span>
            </button> */}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                onBlur={() => handleBlur("fullName")}
                className={`w-full rounded-lg border p-3 text-sm ${
                  touched.fullName && errors.fullName
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.fullName && errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => handleBlur("username")}
                className={`w-full rounded-lg border p-3 text-sm ${
                  touched.username && errors.username
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.username && errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email")}
                className={`w-full rounded-lg border p-3 text-sm ${
                  touched.email && errors.email
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.email && errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-900 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                className={`w-full rounded-lg border p-3 text-sm ${
                  touched.password && errors.password
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              />
              {touched.password && errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition mt-6"
            >
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-green-600 font-semibold hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
