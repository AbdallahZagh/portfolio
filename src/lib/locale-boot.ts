export const LOCALE_STORAGE_KEY = "az-locale";

/**
 * Runs inline in <head>, before first paint. It only sets `lang`/`dir` (so the
 * page is already laid out the right way round) and, for Arabic, parks the body
 * until the provider has swapped the copy, so English text never flashes in RTL.
 * A 3s fallback un-parks the page if scripts fail to load.
 */
export const localeBootScript = `(function(){try{var l=localStorage.getItem("${LOCALE_STORAGE_KEY}");if(l==="ar"){var d=document.documentElement;d.lang="ar";d.dir="rtl";d.setAttribute("data-locale-pending","");setTimeout(function(){d.removeAttribute("data-locale-pending")},3000)}}catch(e){}})();`;
