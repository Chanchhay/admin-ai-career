import LoginForm from "./LoginForm";
import LoginIllustration from "./LoginIllustration";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <LoginIllustration />
      <LoginForm />
    </div>
  );
}