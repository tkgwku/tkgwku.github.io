
const canvas = document.getElementById("MPcanvas")
const color_fill_list = ["#c8e1fb", "#dccbf8", "#ded5ef", "#f6d4e4", "#f4d3d6", "#fbe1cc", "#fbefc9", "#d0e9d6", "#cef0e6", "#cde8ed"]
const color_list = ["#007bff","#6610f2","#e83e8c","#dc3545","#fd7e14","#ffc107","#28a745","#20c997","#6f42c1","#17a2b8"]
const boxWidth = 0.3
const canvasWidth = 600
const radius_list = [1,2,3,4,5,8,10,20]
var mp_radius = 2

function drawRect(){
	clearCanvas()
	let ratio = canvasWidth/(getMaxX() - getMinX())
	$(canvas).attr("min-height", Math.round((getMaxY() - getMinY()) * ratio))
	$("#MPbackground").css({"min-height":Math.round((getMaxY() - getMinY()) * ratio)+50+"px"})
    $(canvas).attr("width", canvasWidth)
    let div = $('<div>')
	for (let i = 0; i < MPtree.length;i++){
		let id = MPtree[i].id
		let x = MPtree[i].x
		let y = MPtree[i].y
		let mm = MPtree[i].mm
		let color = color_list[(mm % color_list.length)]
		
		let l = false
		let r = false
		let u = false
		let d = false
		
		for (let j = 0; j < MPtree.length;j++){
			let x1 = MPtree[j].x
			let y1 = MPtree[j].y
			if (mm === MPtree[j].mm){
				if (id !== MPtree[j].id){
					if (!l && isLeftNeighbor(x,y,x1,y1)){
						l = true
					}
					if (!r && isRightNeighbor(x,y,x1,y1)){
						r = true
					}
					if (!u && isUpNeighbor(x,y,x1,y1)){
						u = true
					}
					if (!d && isDownNeighbor(x,y,x1,y1)){
						d = true
					}
					if (l && r && u && d){
						color = color_fill_list[mm % color_list.length]
						break
					}
				}
			}
		}
		let canv_x = translateX(x)
		let canv_y = translateY(y)
        $("<div>")
            .css({
                "background-color":color,
                "position":"absolute",
                "width":mp_radius+"px",
                "height":mp_radius+"px",
                "left":canv_x+"px",
                "top":canv_y+"px"})
            .attr({
                "data-toggle":"tooltip",
                "data-placement":"bottom",
                "title":"MP("+x+", "+y+")"})
            .appendTo(div)
	}
	for (let j = 0; j < ncond.length;j++){
		let xf = translateX(ncond[j].x1)
		let xl = translateX(ncond[j].x2)
		let yf = translateY(ncond[j].y1)
		let yl = translateY(ncond[j].y2)
		let width = xf==xl ? mp_radius : Math.abs(xf-xl)
		let height = yf==yl ? mp_radius : Math.abs(yf-yl)
		let left = xf==xl ? xf : Math.min(xf,xl)
		let right = yf==yl ? yf : Math.min(yf,yl)
        $("<div>")
            .css({
                "background-color":"#8973a8",
                "position":"absolute",
                "width":width+"px",
                "height":height+"px",
                "left":left+"px",
                "top":right+"px"})
            .attr({
                "data-toggle":"tooltip",
                "data-placement":"bottom",
                "title":"境界条件 ("+ncond[j].x1+", "+ncond[j].y1+" - "+ncond[j].x2+", "+ncond[j].y2+"), "+ncond[j].xfix+", "+ncond[j].yfix})
            .appendTo(div)
    }
    div.appendTo($(canvas))
	$('[data-toggle="tooltip"]').tooltip()
}

function setRadius(i){
    mp_radius = radius_list[i]
	$("#mpRadiusPx").text(mp_radius+"")
}

function isLeftNeighbor(x,y,x1,y1){
	return x <= x1 && x1 <= x+boxWidth && y-boxWidth/2 <= y1 && y1 <= y+boxWidth/2
}
function isRightNeighbor(x,y,x1,y1){
	return x-boxWidth <= x1 && x1 <= x && y-boxWidth/2 <= y1 && y1 <= y+boxWidth/2
}
function isUpNeighbor(x,y,x1,y1){
	return y <= y1 && y1 <= y+boxWidth && x-boxWidth/2 <= x1 && x1 <= x+boxWidth/2
}
function isDownNeighbor(x,y,x1,y1){
	return y-boxWidth <= y1 && y1 <= y && x-boxWidth/2 <= x1 && x1 <= x+boxWidth/2
}

//from mp XY to canvas XY
function translateX(x){
	let ratio = canvasWidth/(getMaxX() - getMinX())
	return Math.round(x * ratio)
}
function translateY(y){
	let ratio = canvasWidth/(getMaxX() - getMinX())
	let height = (getMaxY() - getMinY()) * ratio
	return Math.round(height - y * ratio)
}


function getMaxX(){
	let max = -100000 
	for (let i = 0; i < MPtree.length;i++){
		max = Math.max(MPtree[i].x, max)
	}
	return max
}
function getMaxY(){
	let max = -100000
	for (let i = 0; i < MPtree.length;i++){
		max = Math.max(MPtree[i].y, max)
	}
	return max
}
function getMinX(){
	let min = 100000 
	for (let i = 0; i < MPtree.length;i++){
		min = Math.min(MPtree[i].x, min)
	}
	return min
}
function getMinY(){
	let min = 100000 
	for (let i = 0; i < MPtree.length;i++){
		min = Math.min(MPtree[i].y, min)
	}
	return min
}

		
function clearCanvas(){
    $(canvas).html("")
}