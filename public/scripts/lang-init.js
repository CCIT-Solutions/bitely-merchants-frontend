(function () {
  try {
    //  Locale
    const storedLocale = localStorage.getItem("locale");
    const lang =
      storedLocale || (navigator.language.startsWith("ar") ? "ar" : "ar");

    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute(
      "dir",
      lang === "ar" ? "rtl" : "ltr"
    );

    //  Theme (from Zustand persist)
    const storedTheme = localStorage.getItem("app-theme");

    let theme = "light";

    if (storedTheme) {
      try {
        const parsed = JSON.parse(storedTheme);
        theme = parsed?.state?.theme || "light";
      } catch (e) {}
    }

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  } catch (e) {
  }
})();