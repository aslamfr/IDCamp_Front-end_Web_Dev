function dropDown() {
  document.getElementById('dropMenu').classList.toggle('show');
}

window.onclick = function(event) {
  if (!event.target.matches('.dbutton')) {
    var dropdowns = document.getElementsByClassName("drop-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}

// reference: https://www.w3schools.com/howto/howto_js_dropdown.asp