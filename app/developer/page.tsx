import BlurText from "../components/animation/BlurText";
import Navbar from "../components/navbar";

export default function Developers() {
  return (
    <>
      <main className="min-h-screen mx-auto max-w-5xl p-4">
        <Navbar />
        <section className="mt-20 flex flex-col gap-3">
          <h1 className="text-4xl font-bold">
            <BlurText
              text="Contributor & Developer ✨"
              delay={200}
              animateBy="words"
              direction="top"
              className="mb-8"
            />
          </h1>
        </section>
      </main>
    </>
  );
}
