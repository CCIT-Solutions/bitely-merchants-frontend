(function () {
  const stored = localStorage.getItem("locale");
  const lang = stored || (navigator.language.startsWith("ar") ? "ar" : "ar");
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
})();