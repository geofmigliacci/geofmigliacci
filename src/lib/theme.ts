export const THEME_STORAGE_KEY = "theme";

/** Built from the key above: a blocking script cannot import, and a drift would fail silently. */
export const THEME_BOOT_SCRIPT = `try{if(localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY,
)})==="dark")document.documentElement.classList.add("dark")}catch(e){}`;
