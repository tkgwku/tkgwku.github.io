/*
 * utils.js
 *
 * copyright; github.com@tkgwku, all rights reserved.
 */
 
function push_alert(msg, lvl){
	let style = "primary"
	if (lvl < 0){
		style = "secondary"
	} else if(lvl === 0) {
		style = "primary"
	} else if (lvl === 1) { 
		style = "success"
	} else if (lvl === 2) {
		style = "warning"
	} else if (lvl > 3) {
		style = "danger"
	}
	$("<div>", {
		"class": "alert alert-"+style+" alert-dismissible fade show"
	}).html(msg).append($("<button>", {
		"type": "button",
		"class": "close", 
		"data-dismiss": "alert"
	}).html("&times;")).appendTo("#alertbox")
}