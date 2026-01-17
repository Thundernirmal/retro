(function () {
  const BIO_TEXT =
    "Associate System Engineer at Goldman Sachs | IIT Jodhpur";
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
