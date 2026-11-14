(function () {
  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  const systemDark = matchMedia("(prefers-color-scheme: dark)");

  const current = () => (root.dataset.theme === "latte" ? "latte" : "mocha");

  function storedTheme() {
    try {
      const value = localStorage.getItem("theme");
      return value === "latte" || value === "mocha" ? value : null;
    } catch (e) {
      return null;
    }
  }

  function sync() {
    if (button) {
      button.setAttribute("aria-pressed", String(current() === "mocha"));
    }
  }

  // The view-transition snapshot covers the large viewport on phones (under the URL bar too).
  function snapshotSize() {
    const probe = document.createElement("div");
    probe.style.cssText =
      "position:fixed;top:0;left:0;width:100vw;height:100lvh;visibility:hidden;pointer-events:none";
    document.body.append(probe);
    const { width, height } = probe.getBoundingClientRect();
    probe.remove();
    return { width: Math.max(width, innerWidth), height: Math.max(height, innerHeight) };
  }

  function setTheme(theme, persist) {
    if (persist) {
      try {
        localStorage.setItem("theme", theme);
      } catch (e) { }
    }
    if (theme === current()) {
      sync();
      return;
    }

    const apply = () => {
      root.classList.add("theme-switching");
      root.dataset.theme = theme;
      sync();
    };
    const settle = () => root.classList.remove("theme-switching");

    if (!document.startViewTransition || reducedMotion.matches) {
      apply();
      requestAnimationFrame(() => requestAnimationFrame(settle));
      return;
    }

    // A circle grows out of the toggle and paints the new theme over the old one.
    const rect = button && button.getBoundingClientRect();
    const { width, height } = snapshotSize();
    const x = rect ? rect.left + rect.width / 2 : width / 2;
    const y = rect ? rect.top + rect.height / 2 : 0;
    const radius = Math.hypot(Math.max(x, width - x), Math.max(y, height - y));

    const transition = document.startViewTransition(apply);
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: Math.min(900, Math.max(450, 300 + radius * 0.27)),
          easing: "cubic-bezier(0.61, 1, 0.88, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
    transition.finished.finally(settle);
  }

  sync();
  if (button) {
    button.addEventListener("click", () => setTheme(current() === "mocha" ? "latte" : "mocha", true));
  }
  systemDark.addEventListener("change", (event) => {
    if (!storedTheme()) {
      setTheme(event.matches ? "mocha" : "latte", false);
    }
  });
})();

(function () {
  const BIO_TEXT =
    "Systems engineer, Linux enjoyer and part-time computer archaeologist";
  const bioTarget = document.getElementById("bio-text");
  const cursor = document.getElementById("bio-cursor");

  if (!bioTarget || !cursor) {
    return;
  }

  let index = 0;
  const typingSpeed = 50;

  function typeNext() {
    if (index <= BIO_TEXT.length) {
      bioTarget.textContent = BIO_TEXT.slice(0, index);
      index += 1;
      setTimeout(typeNext, typingSpeed);
    }
  }

  function blinkCursor() {
    cursor.style.opacity = cursor.style.opacity === "0" ? "1" : "0";
  }

  function updateParallax(event) {
    const terminal = document.querySelector(".terminal");
    if (!terminal) {
      return;
    }
    const rect = terminal.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const offsetX = (event.clientX - centerX) / rect.width;
    const offsetY = (event.clientY - centerY) / rect.height;
    terminal.style.setProperty("--shadow-x", `${offsetX * 10}px`);
    terminal.style.setProperty("--shadow-y", `${offsetY * 8}px`);
  }

  function resetParallax() {
    const terminal = document.querySelector(".terminal");
    if (terminal) {
      terminal.style.setProperty("--shadow-x", "0px");
      terminal.style.setProperty("--shadow-y", "0px");
    }
  }

  typeNext();
  setInterval(blinkCursor, 530);
  window.addEventListener("mousemove", updateParallax);
  window.addEventListener("mouseleave", resetParallax);
})();
