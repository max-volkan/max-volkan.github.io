let lastScrollTop = 0; // Keep track of last scroll position

window.addEventListener("scroll", function() {
  let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  if (currentScroll > lastScrollTop) {
    // Scroll Down
    if (currentScroll > 150) { // Adjust the 150 to where you want the header to hide
      document.querySelector('header').classList.add('header-hidden');
    }
  } else {
    // Scroll Up
    document.querySelector('header').classList.remove('header-hidden');
  }
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
}, false);