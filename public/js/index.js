function loadFile(event) {
    var image = document.querySelector("#output");
    if (event.target.files.length >= 1) {
        image.style.display = "block";
        image.setAttribute("src", URL.createObjectURL(event.target.files[0]));
    } else {
        console.log("ok");
        image.style.display = "none";
        image.setAttribute("src", "");
    }
}
const successBtn = document.querySelector(".msg button");
successBtn.addEventListener("click", () => {
    document.querySelector(".msg").style.display = "none";
});
