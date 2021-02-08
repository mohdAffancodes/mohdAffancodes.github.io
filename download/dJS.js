var main = document.querySelector(".main");

if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
    alert("Sorry.Our website is not comtible with your device." + "\r\n" + "And the applications are not made for mobile.")
    main.style.visibility = "hidden";
}