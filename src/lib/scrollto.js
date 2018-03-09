
let isScrolling = false;

export function scrollTo(anchor, duration) {
  if (!anchor) return;
  var scrollTop = document.documentElement.scrollTop;
  if (Math.abs(anchor.offsetTop - scrollTop) < 100) {
    return;
  }
  if (isScrolling) {
    return;
  }
  isScrolling = true;
  var step = (anchor.offsetTop - scrollTop) / (duration / 1000) / 50;

  function scroll() {
    if (Math.abs(anchor.offsetTop - scrollTop) > Math.abs(step)) {
      scrollTop += step;
      document.documentElement.scrollTop = scrollTop;
      setTimeout(scroll, 20);
      return;
    } else {
      isScrolling = false;
      return;
    }
  }
  scroll();
}