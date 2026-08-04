"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/lib/auth-client";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/lib/validation/register.schema";
import { useRegisterMutation } from "@/services/authApi";
import { KeycloakLoginButton } from "./AuthActions";
import { PasswordInput } from "./PasswordInput";
import { RoleSelector } from "./RoleSelector";

const defaultValues: RegisterFormValues = {
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
  const [register, registration] = useRegisterMutation();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues,
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await register({ ...values, phoneNumber: values.phoneNumber || undefined }).unwrap();
      toast.success("Account created. Continue with secure sign in.");
      await authClient.signIn.oauth2({
        providerId: "keycloak",
        callbackURL: "/auth/continue",
        errorCallbackURL: "/?error=keycloak",
      });
    } catch {
      toast.error("Unable to create the account.");
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <RoleSelector value={field.value} onChange={field.onChange} />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField control={form.control} name="firstName" label="First name" />
          <TextField control={form.control} name="lastName" label="Last name" />
        </div>
        <TextField control={form.control} name="username" label="Username" />
        <TextField control={form.control} name="email" label="Email" type="email" />
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <PasswordInput label="Password" autoComplete="new-password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <PasswordInput label="Confirm password" autoComplete="new-password" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 w-full rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {(["UNSPECIFIED", "MALE", "FEMALE", "OTHER"] as const).map(
                      (gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <TextField
            control={form.control}
            name="phoneNumber"
            label="Phone number"
          />
        </div>
        <Button type="submit" size="lg" className="h-12 w-full rounded-full" disabled={registration.isLoading}>
          {registration.isLoading ? "Creating account…" : "Create account"}
        </Button>
        <p className="flex flex-wrap items-center justify-center gap-1 text-center text-sm text-body">
          Already have an account?
          <KeycloakLoginButton
            variant="link"
            size="sm"
            className="h-auto p-0 font-semibold text-brand"
          >
            Sign in
          </KeycloakLoginButton>
        </p>
      </form>
    </Form>
  );
}

function TextField({
  control,
  name,
  label,
  type = "text",
}: {
  control: ReturnType<typeof useForm<RegisterFormValues>>["control"];
  name: "firstName" | "lastName" | "username" | "email" | "phoneNumber";
  label: string;
  type?: string;
}) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} className="rounded-xl" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
