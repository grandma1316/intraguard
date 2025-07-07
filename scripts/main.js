// Add a Scroll to Top Button
window.addEventListener("scroll", function () {
    let navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = "#292929";
    } else {
        navbar.style.backgroundColor = "#1e1e1e";
    }
});