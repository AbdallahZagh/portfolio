export function SectionHeading({
  title,
  aside,
}: {
  title: string;
  aside?: string;
}) {
  return (
    <header className="mb-10 md:mb-14">
      <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        {title}
      </h2>
      {aside ? (
        <p className="mt-3 max-w-2xl text-muted md:text-lg">{aside}</p>
      ) : null}
    </header>
  );
}
