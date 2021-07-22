
function push_alert(msg, lvl, id){
	let style = "primary"
	if (lvl < 0){
		style = "secondary"
	} else if(lvl === 0) {
		style = "primary"
	} else if (lvl === 1) { 
		style = "success"
	} else if (lvl === 2) {
		style = "warning"
	} else if (lvl >= 3) {
		style = "danger"
	}
	let found = false
	$("#alertbox .alert-"+style).each(function(i, elem){
		if ($(elem).attr("data-id") === id){
			let c = parseInt($(elem).attr("data-count"))
			if (c === 1){
				$(elem).attr("data-count", "2").append($("<span>", {
					"class": "ml-2 badge badge-"+style
				}).text("2"))
			} else {
				$(elem).attr("data-count", (c+1)+"").find(".badge").text((c+1)+"")
			}
			found = true
		}
	})
	if (!found){
		$("<div>", {
			"data-id": id,
			"data-count": "1",
			"class": "alert alert-"+style+" alert-dismissible fade show",
			"role": "alert"
		}).html(msg).append($("<button>", {
			"type": "button",
			"class": "btn-close", 
			"data-bs-dismiss": "alert"
		})).appendTo("#alertbox")
	}
}

function byteSize(str) {
	return new Blob([str]).size;
}

function numToStr(num, range=4){
	return ""+Math.round(num*10**range)/10**range
}