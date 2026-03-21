import BlurText from "../components/animation/BlurText";
import Navbar from "../components/navbar";

export default function Developers() {
  return (
    <>
      <main className="min-h-screen mx-auto max-w-5xl p-4">
        <Navbar />
        <section className="mt-20 flex flex-col gap-3">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-mono">
            <BlurText
              text="Contributor & Developer ✨"
              delay={200}
              animateBy="words"
              direction="top"
              className="mb-8"
            />
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            Sellora is an Software as a Service (SaaS) platform for analyzing
            and reporting on the sale of your products online.
          </p>
        </section>
      </main>
    </>
  );
}
