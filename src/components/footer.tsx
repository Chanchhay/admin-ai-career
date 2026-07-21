import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 dark:bg-slate-950 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.8fr_1fr_1fr_1fr]">
          <div className="space-y-2">
            <div className=" bg-white dark:bg-slate-900 w-fit">
              <Image
                src="/images/logo.png"
                alt="KaWork Logo"
                width={160}
                height={96}
                className="h-24 w-40 object-contain"
              />
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-xs">
              Empowering learners through innovative education and technology. Providing the latest methodology with high-quality training and mentoring.
            </p>
          </div>

          <div>
            <p className="text-base font-semibold text-green-600 mb-4">Follow us</p>
            <div className="text-sm text-slate-700 dark:text-slate-300 space-y-3">
              <p><span className="font-medium">Customer Service:</span> +855-81697501</p>
              <p><span className="font-medium">Working Hours:</span> 08:30 - 18:00</p>
              <p>No. 24, Street 562, Sangkat kak I, Khan Toul Kork, Phnom Penh.</p>
            </div>
          </div>

          <div>
            <p className="text-base font-semibold text-green-600 mb-4">Explore</p>
            <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-2">
              <li><Link href="/" className="hover:text-green-600 transition">Home</Link></li>
              <li><Link href="/jobs" className="hover:text-green-600 transition">Find Job</Link></li>
              <li><Link href="/recruiter/jobs/new" className="hover:text-green-600 transition">Post Job</Link></li>
              <li><Link href="/register" className="hover:text-green-600 transition">Register</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-base font-semibold text-green-600 mb-4">Sponsor and Organize</p>
            <div className="mt-2">
              <Image
                src="/images/istad.png"
                alt="ISTAD Logo"
                width={160}
                height={80}
                className="h-20 w-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 dark:border-slate-800 pt-6">
          <p className="text-sm text-slate-600 dark:text-slate-400">© 2026 កាវងារ | Sponsored and organized by ISTAD</p>
        </div>
      </div>
    </footer>
  );
}
