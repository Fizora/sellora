import Link from "next/link";
import Navbar from "./components/navbar";
import Paraf from "./components/paraf";
import { LucideSend } from "lucide-react";
import BlurText from "./components/animation/BlurText";

export default function Home() {
  return (
    <main className="min-h-screen mx-auto max-w-5xl p-4">
      <Navbar />
      {/* hero section */}
      <section className="my-40 flex flex-col items-center gap-3 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
          <BlurText
            text="Welcome To Sellora ✨"
            delay={200}
            animateBy="words"
            direction="top"
            className="mb-8"
          />
        </h1>
        <p className="max-w-md">
          Sellora is a platform for analyzing and reporting on the sale of your
          products online.
        </p>
        <Link
          href={"/auth/register"}
          className="w-max bg-blue-600 border-2 border-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-2 hover:bg-blue-800 hover:border-blue-800  shadow-md shadow-blue-200 hover:shadow-blue-300 transition-colors duration-300"
        >
          <LucideSend size={18} />
          Get Started
        </Link>
      </section>
    </main>
  );
}
