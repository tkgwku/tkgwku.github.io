/*
 * ncond.js
 *
 * copyright; github.com@tkgwku, all rights reserved.
 */
 
function addNCOND(x1,y1,x2,y2,fix){
	boundarray.push(
		new Boundary(
			new Pos(x1,y1), 
			new Pos(x2,y2), 
			(fix==="sncond_x"||fix==="sncond_xy"), 
			(fix==="sncond_y"||fix==="sncond_xy")
		)
	)
}

function convertNcond(){
	let content = ""
	if (boundarray.length !== 0) content += "# 固相境界条件 始点x, 終点x, 始点y, 終点y, x固定, y固定 (4F10.5, 2i5)\n"
	for (let i = 0; i < boundarray.length; i++){
		let x1 = boundarray[i].pos1.x
		let y1 = boundarray[i].pos1.y
		let x2 = boundarray[i].pos2.x
		let y2 = boundarray[i].pos2.y
		let xfix = boundarray[i].xfix ? 1:0
		let yfix = boundarray[i].yfix ? 1:0
		let ix1 = indentify_float(x1,5,10)
		let iy1 = indentify_float(y1,5,10)
		let ix2 = indentify_float(x2,5,10)
		let iy2 = indentify_float(y2,5,10)
		let ixfix = indentify_int(xfix,5)
		let iyfix = indentify_int(yfix,5)
		let line = ix1+ix2+iy1+iy2+ixfix+iyfix+"\n"
		content += line
	}
	$("#filecontent_sncond").text(content)
}

function removeNCOND(x1,y1,x2,y2,fix){
	let a = []
	for (let i=0;i<boundarray.length;i++){
		let b = boundarray[i]
		if (b.pos1.x === x1 
			&& b.pos1.y === y1 
			&& b.pos2.x === x2 
			&& b.pos2.y === y2 
			&& b.xfix === (fix==="sncond_x"||fix==="sncond_xy")
			&& b.yfix === (fix==="sncond_y"||fix==="sncond_xy")) {
		} else {
			a.push(b)
		}
	}
	boundarray = a
}