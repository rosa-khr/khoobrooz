const nav = document.getElementById("mainNav");

if (nav) {
  const toggle = nav.querySelector(".menu-toggle");

  toggle?.addEventListener("click", () => {
    const isOpen = nav.dataset.open === "true";
    nav.dataset.open = String(!isOpen);
    toggle.setAttribute("aria-expanded", String(!isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.dataset.open = "false";
      toggle?.setAttribute("aria-expanded", "false");
    });
  });
}
