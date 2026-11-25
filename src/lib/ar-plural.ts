const rules = new Intl.PluralRules("ar");

type Forms = {
  zero?: string;
  one: string;
  two: string;
  few: string;
  many: string;
  other: string;
};

/** Picks the right Arabic number form (zero, one, two, 3-10, 11-99, 100+) for a count. */
export function arCount(n: number, forms: Forms) {
  const category = rules.select(n) as keyof Forms;
  return forms[category] ?? forms.other;
}

/** "خطأ واحد", "خطآن", "3 أخطاء", "11 خطأً" ... */
export function arBugs(n: number) {
  return arCount(n, {
    zero: `${n} أخطاء`,
    one: "خطأ واحد",
    two: "خطآن",
    few: `${n} أخطاء`,
    many: `${n} خطأً`,
    other: `${n} خطأ`,
  });
}
