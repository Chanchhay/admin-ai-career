"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Gender, RegisterRequest, RegistrationRole } from "@/contracts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./PasswordInput";
import { RoleSelector } from "./RoleSelector";

type RegisterErrors = Partial<Record<keyof RegisterRequest, string>>;

const genderOptions: Gender[] = ["UNSPECIFIED", "MALE", "FEMALE", "OTHER"];

const initialForm: RegisterRequest = {
  username: "",
  password: "",
  confirmPassword: "",
  email: "",
  firstName: "",
  lastName: "",
  gender: "UNSPECIFIED",
  role: "SEEKER",
  phoneNumber: "",
};

export function RegisterForm() {
  const [form, setForm] = useState<RegisterRequest>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  const errors = useMemo<RegisterErrors>(() => {
    const nextErrors: RegisterErrors = {};

    if (form.username.trim().length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }
    if (!form.email.includes("@")) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.firstName.trim()) nextErrors.firstName = "First name is required.";
    if (!form.lastName.trim()) nextErrors.lastName = "Last name is required.";
    if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords must match.";
    }
    if (form.phoneNumber && !/^\+?[0-9 ]{8,30}$/.test(form.phoneNumber)) {
      nextErrors.phoneNumber = "Phone number may contain digits, spaces, and optional +.";
    }

    return nextErrors;
  }, [form]);

  const showErrors = submitted;
  const hasErrors = Object.keys(errors).length > 0;

  const update = <K extends keyof RegisterRequest>(key: K, value: RegisterRequest[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <RoleSelector
        value={form.role}
        onChange={(role: RegistrationRole) => update("role", role)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="First name"
          required
          value={form.firstName}
          error={showErrors ? errors.firstName : undefined}
          onChange={(value) => update("firstName", value)}
        />
        <FormField
          label="Last name"
          required
          value={form.lastName}
          error={showErrors ? errors.lastName : undefined}
          onChange={(value) => update("lastName", value)}
        />
      </div>
      <FormField
        label="Username"
        required
        value={form.username}
        error={showErrors ? errors.username : undefined}
        onChange={(value) => update("username", value)}
      />
      <FormField
        label="Email"
        required
        type="email"
        value={form.email}
        error={showErrors ? errors.email : undefined}
        onChange={(value) => update("email", value)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <PasswordInput
          label="Password"
          required
          autoComplete="new-password"
          value={form.password}
          error={showErrors ? errors.password : undefined}
          onChange={(event) => update("password", event.target.value)}
        />
        <PasswordInput
          label="Confirm password"
          required
          autoComplete="new-password"
          value={form.confirmPassword}
          error={showErrors ? errors.confirmPassword : undefined}
          onChange={(event) => update("confirmPassword", event.target.value)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-heading">
          Gender
          <select
            value={form.gender}
            onChange={(event) => update("gender", event.target.value as Gender)}
            className="mt-1 h-11 w-full rounded-md border border-input bg-surface px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </label>
        <FormField
          label="Phone number"
          value={form.phoneNumber ?? ""}
          error={showErrors ? errors.phoneNumber : undefined}
          onChange={(value) => update("phoneNumber", value)}
        />
      </div>
      {showErrors && hasErrors ? (
        <div role="alert" className="rounded-md bg-red-50 p-3 text-sm text-error">
          Fix the highlighted fields before creating a static account preview.
        </div>
      ) : null}
      {loadingDemo ? (
        <div className="rounded-md bg-brand-tint p-3 text-sm text-body">
          Loading demonstration is active. No request is being sent.
        </div>
      ) : null}
      <div className="grid gap-3">
        <Button type="submit" size="lg" disabled={loadingDemo}>
          Create account
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setLoadingDemo((current) => !current)}
        >
          Toggle loading demonstration
        </Button>
      </div>
      <p className="text-center text-sm text-body">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-brand">
          Sign in
        </Link>
      </p>
    </form>
  );
}

type FormFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  error?: string;
};

function FormField({
  label,
  value,
  onChange,
  required,
  type = "text",
  error,
}: FormFieldProps) {
  const id = label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium text-heading">
        {label}
        {required ? <span className="text-error"> *</span> : null}
      </label>
      <Input
        id={id}
        type={type}
        required={required}
        value={value}
        aria-invalid={Boolean(error)}
        className="mt-1"
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <p className="mt-1 text-xs text-error">{error}</p> : null}
    </div>
  );
}
