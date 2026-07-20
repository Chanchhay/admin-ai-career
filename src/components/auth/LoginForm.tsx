"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

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
      console.log("Form submitted:", { email, password });
      // Handle login logic here
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <section className="flex items-center justify-center bg-white p-12">

      <div className="w-full max-w-md">

        <h1 className="text-5xl font-bold text-green-600">
          Welcome
        </h1>

        <p className="mt-3 text-gray-500">
          Sign in to continue your AI career journey.
        </p>

        <form className="mt-10 space-y-5" onSubmit={handleSubmit}>

          <div>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email")}
              className={`w-full rounded-lg border p-4 ${
                touched.email && errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {touched.email && errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password")}
              className={`w-full rounded-lg border p-4 ${
                touched.password && errors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            {touched.password && errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-between text-sm">

            <label className="flex items-center gap-2">
              <input type="checkbox"/>
              Remember me
            </label>

            <Link href="/forgot-password">
              Forgot Password?
            </Link>

          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-green-600 py-4 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
          >
            Login
          </button>

        </form>

        <div className="my-8 flex items-center">

          <div className="h-px flex-1 bg-gray-200"/>

          <span className="mx-4 text-gray-400">
            Continue with
          </span>

          <div className="h-px flex-1 bg-gray-200"/>

        </div>

        <div className="grid grid-cols-2 gap-4">

          <button type="button" className="rounded-lg border p-3 flex items-center justify-center">
            <Image src="/images/google.png" alt="Google" width={20} height={20} />
          </button>

          <button type="button" className="rounded-lg border p-3 flex items-center justify-center">
            <Image src="/images/github.png" alt="GitHub" width={30} height={30} />
          </button>
{/* 
          <button className="rounded-lg border p-3">
            LinkedIn
          </button>

          <button className="rounded-lg border p-3">
            Microsoft
          </button> */}

        </div>

        <p className="mt-8 text-center">

          Don't have an account?

          <Link
            href="/auth/register"
            className="ml-2 text-green-600 font-semibold"
          >
            Register
          </Link>

        </p>

      </div>

    </section>
  );
}