"use client";

import Link from "next/link";
import { useState } from "react";
import { Code2, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./PasswordInput";

export function LoginForm() {
  const [remember, setRemember] = useState(true);

  return (
    <form className="space-y-5">
      <label className="block text-sm font-medium text-heading">
        Email address
        <Input
          type="email"
          autoComplete="email"
          placeholder="name@example.com"
          className="mt-1"
        />
      </label>
      <PasswordInput
        label="Password"
        autoComplete="current-password"
        placeholder="Enter password"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <label className="inline-flex items-center gap-2 text-body">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="size-4 rounded border-border accent-[var(--primary)]"
          />
          Keep me logged in
        </label>
        <span className="text-brand">Forgot password?</span>
      </div>
      <Button type="button" className="w-full" size="lg">
        Log in
      </Button>
      <p className="text-center text-sm text-body">
        Do not have an account?{" "}
        <Link href="/register" className="font-semibold text-brand">
          Sign up
        </Link>
      </p>
      <div className="relative py-2 text-center text-sm text-muted-fg">
        <span className="relative z-10 bg-surface px-3">Or continue with</span>
        <span className="absolute left-0 top-1/2 h-px w-full bg-border" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          ["Google", Mail],
          ["Facebook", Mail],
          ["GitHub", Code2],
          ["Telegram", Send],
        ].map(([label, Icon]) => (
          <Button key={label as string} type="button" variant="outline">
            <Icon aria-hidden="true" className="size-4" />
            {label as string}
          </Button>
        ))}
      </div>
    </form>
  );
}

export default LoginForm;
