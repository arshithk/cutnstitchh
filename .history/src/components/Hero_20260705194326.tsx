export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-black py-16 sm:py-20 lg:py-28">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-yellow-400">
            Premium Custom Apparel
          </p>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Custom uniforms made for your team.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg">
            Professional uniforms, teamwear, corporate apparel, and custom
            clothing designed with quality, comfort, and identity in mind.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="rounded-lg bg-yellow-400 px-6 py-3 font-semibold text-black transition hover:bg-yellow-300"
            >
              Get a Quote
            </a>

            <a
              href="#industries"
              className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:border-yellow-400 hover:text-yellow-400"
            >
              Explore Services
            </a>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border border-white/10">
            <img
              src="/hero.jpg"
              alt="Custom apparel and uniforms"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}