function changeFrameHeight() {
	var ifm = document.getElementById("iframePage");
	ifm.height = document.documentElement.clientHeight;
}

window.onresize = function () {
	changeFrameHeight();
}

document.getElementById("iframePage").onload = changeFrameHeight;


function playmus() {
	var mus = document.getElementById("musmus");
	if (mus.pause)
		mus.play();
};