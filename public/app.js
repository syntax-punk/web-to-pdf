window.onload = function() {
  document.theform.onsubmit = function() {
    console.log("Form submitted");
    return false;
  }
}