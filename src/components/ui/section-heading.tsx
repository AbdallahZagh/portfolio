/** Figma "Section head": big title, short aside at the end, hairline underneath. */
export function SectionHead({
  id,
  title,
  aside,
}: {
  id?: string;
  title: string;
  aside?: string;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-line pb-[25px] md:flex-row md:items-end md:justify-between md:gap-10">
      <h2
        id={id}
        className="text-[40px] leading-[44px] font-semibold tracking-[-0.04em] text-ink md:text-[56px] md:leading-[60px] lg:text-[72px] lg:leading-[75px] rtl:tracking-normal rtl:leading-[56px] rtl:md:leading-[78px] rtl:lg:leading-[94px]"
      >
        {title}
      </h2>
      {aside ? (
        <p className="text-[17px] leading-[26px] text-muted md:max-w-[440px] md:text-end md:text-[18px] md:leading-[27px]">
          {aside}
        </p>
      ) : null}
    </header>
  );
}

/** Older sections keep this until they are rebuilt from Figma. */
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
