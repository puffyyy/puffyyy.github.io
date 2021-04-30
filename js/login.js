$('#login-button').click(function (event) {
	var userName = document.getElementById("userName").value;
	var pwd = document.getElementById("pwd").value;
	if (userName.length == 0) {
		alert("please enter your name.")
	}
	else if (userName == "gf" || userName == "高帆")
		if (compilesrc(pwd) == 1467) {
			event.preventDefault();
			$('form').fadeOut(500);
			$('.wrapper').addClass('form-success');
			$('#gfgf').fadeIn();
			requestFullScreen();
			setTimeout(function () {
				location.href = "BirthdayCake.html";
			}, 3000);
		}
		else {
			alert("Wrong Password.");
		}
	else { alert("name does not exist.") }
});
function compilesrc(code) {
	var c = code.charCodeAt(0) + code.length;
	for (var i = 1; i < code.length; i++) {
		c = c * 13 + (code.charCodeAt(i));
	}
	return c;
	// alert(escape(c));
}
function requestFullScreen(element) {
	var element = document.documentElement;
	var requestMethod = element.requestFullScreen || //W3C
		element.webkitRequestFullScreen || //Chrome等
		element.mozRequestFullScreen || //FireFox
		element.msRequestFullScreen; //IE11
	if (requestMethod) {
		requestMethod.call(element);
	}
	else if (typeof window.ActiveXObject !== "undefined") {//for Internet Explorer
		var wscript = new ActiveXObject("WScript.Shell");
		if (wscript !== null) {
			wscript.SendKeys("{F11}");
		}
	}
}
