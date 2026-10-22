import { Container } from "~/components/container";

/** TEMPORARY placeholder copy; real brand and policy copy to be supplied. */
const promises = [
  { title: "Responsibly sourced", body: "Recycled gold and traceable stones." },
  { title: "Complimentary delivery", body: "Insured and signed for, always." },
  { title: "Considered returns", body: "Thirty days to be certain." },
];

export function BrandStory() {
  return (
    <>
      <section
        aria-labelledby="story-heading"
        className="mt-24 bg-mocha text-ivory md:mt-32"
      >
        <Container className="grid gap-10 py-20 md:grid-cols-2 md:items-center md:py-28">
          <h2 id="story-heading" className="text-5xl md:text-6xl">
            Made slowly,{" "}
            <em className="font-normal text-champagne italic">worn forever.</em>
          </h2>
          <p className="max-w-lg text-lg leading-relaxed text-sand/90">
            Every Aurelle piece is shaped by hand from a single idea: that
            beauty should be quiet, lasting and entirely your own. We work with
            small ateliers who treat gold the way a tailor treats cloth.
          </p>
        </Container>
      </section>
      <section aria-label="Our promises" className="mt-16">
        <Container>
          <ul className="grid gap-8 border-y border-border py-10 text-center md:grid-cols-3">
            {promises.map((p) => (
              <li key={p.title}>
                <h3 className="text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
