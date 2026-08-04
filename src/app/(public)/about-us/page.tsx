import { PublicFooter, PublicShell } from "@/components/layout/PublicShell";
import AboutUsPage from "@/components/public/about/AboutUs";

export default function page() {
    return (
        <PublicShell>
            <main>
                <AboutUsPage />
            </main>
            <PublicFooter />
        </PublicShell>
    );
}
