var main = document.querySelector(".main");

if (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    )
) {
    main.style.visibility = "hidden";
    alert(
        "Sorry.Our website is not compatible with your device." +
            "\r\n" +
            "And the applications are not made for mobile."
    );
}
