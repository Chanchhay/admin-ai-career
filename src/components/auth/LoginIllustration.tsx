import Image from "next/image";

export default function LoginIllustration() {
  return (
    <section className="hidden bg-sky-100 lg:flex items-center justify-center">

      <Image
        src="/images/login-illustration.png"
        width={550}
        height={550}
        alt="Login"
      />

    </section>
  );
}