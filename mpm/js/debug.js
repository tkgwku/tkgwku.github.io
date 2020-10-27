
//__mutiply_color(["#007bff","#6610f2","#6f42c1","#e83e8c","#dc3545","#fd7e14","#ffc107","#28a745","#20c997","#17a2b8"], 0.4, 120)
//__mutiply_color(["#007bff","#6610f2","#6f42c1","#e83e8c","#dc3545","#fd7e14","#ffc107","#28a745","#20c997","#17a2b8"], 0.2, 200)

function __mutiply_color(colors, mul, offs){
	c=[]
	for (let i = 0; i < colors.length;i++){
		let s = colors[i]
		let r = parseInt(s.substring(1, 3), 16)
		let g = parseInt(s.substring(3, 5), 16)
		let b = parseInt(s.substring(5, 7), 16)
		r = Math.round(r*mul+offs)
		g = Math.round(g*mul+offs)
		b = Math.round(b*mul+offs)
		r = r > 255 ? 255 : r
		g = g > 255 ? 255 : g
		b = b > 255 ? 255 : b
		rs = r < 16 ? "0"+r.toString(16) : r.toString(16)
		gs = g < 16 ? "0"+g.toString(16) : g.toString(16)
		bs = b < 16 ? "0"+b.toString(16) : b.toString(16)
		s = "#"+rs+""+gs+""+bs
		c.push(s)
		$("<div>").css({"background-color":s,"color":"white"}).text(s).appendTo("body")
	}
	console.log(c)
}

/*function addRect(x1,y1,x2,y2){
	let aspect_ratio = Math.abs(y2-y1) / Math.abs(x2-x1) // 9/16
	//let width = Math.round($(window).width()*0.3)
	let width = 400
	let height = Math.round(width * aspect_ratio)
	if (parseInt($(canvas).attr("height")) < height) {
		$(canvas).attr("height", height+100)
	}
	if (parseInt($(canvas).attr("width")) < width) {
		$(canvas).attr("width", width+100)
	}
	let canvX1 = x1//TODO
	ctx.strokeStyle = color_list[color_index % color_list.length]
	ctx.lineWidth = 2
	ctx.strokeRect(50, 50, width, height)
	ctx.fillStyle = color_fill_list[color_index % color_list.length]
	ctx.fillRect(51,51,width-2,height-2)
	color_index++
}*/
		