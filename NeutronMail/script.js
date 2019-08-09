// responsive menu 
var menuIcon = document.querySelector(".nav-icon i");
var menu = document.querySelector(".main-nav ul");
var header = document.querySelector(".header");

menuIcon.addEventListener("click", function(){
  menu.classList.toggle("block");
  menuIcon.classList.toggle("icon-close");
  menuIcon.classList.toggle("icon-open");
  header.classList.toggle("padding");
});

// slider
var controls = document.querySelectorAll(".dot");
var slides = document.querySelectorAll(".slide");

function toggleOpen() {
  slides.forEach(slide => {
    if(slide.dataset.num === this.dataset.key){
      slide.classList.remove("none");
    } else {
      slide.classList.add("none");
    }
  });
  controls.forEach(control => control.classList.remove("active"));
  this.classList.add("active");
}

controls.forEach(control => control.addEventListener("click", toggleOpen));