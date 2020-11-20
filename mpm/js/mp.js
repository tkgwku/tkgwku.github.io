/*
 * mp.js
 *
 * copyright; github.com@tkgwku, all rights reserved.
 */

function addMP_fromGrid(mm,x1,y1,x2,y2,gridWidth,numInGrid){
	let sqrt_numInGrid = Math.round(Math.sqrt(numInGrid))
	let col = Math.round(Math.abs(x2-x1) / gridWidth)
	let row = Math.round(Math.abs(y2-y1) / gridWidth)
	for (let i = 0;i < col;i++){
		for (let j = 0;j < row;j++){
			for (let p = 0;p < sqrt_numInGrid;p++){
				for (let q = 0;q < sqrt_numInGrid;q++){
					let x = Math.min(x1,x2) + i * gridWidth + (1+2*p) * gridWidth/(2*sqrt_numInGrid)
					let y = Math.min(y1,y2) + j * gridWidth + (1+2*q) * gridWidth/(2*sqrt_numInGrid)
					let newmp = new MP(mm,new Pos(x,y))
					newmp.addToTree()
				}
			} 
		}
	}
}

function addMP_fromXY(mm,x1,y1,x2,y2,interval){
	let col = Math.round(Math.abs(x2-x1) / interval) + 1
	let row = Math.round(Math.abs(y2-y1) / interval) + 1
	for (let i = 0;i < col;i++){
		for (let j = 0;j < row;j++){
			let x = Math.min(x1,x2) + i * interval
			let y = Math.min(y1,y2) + j * interval
			let newmp = new MP(mm, new Pos(x, y))
			newmp.addToTree()
		}
	}
}

function convertMP(){
	let content = ""
	let ma = getArrangedMPArray()
	for (let i = 0; i < ma.length; i++){
		let mp_val = ma[i]
		let id = mp_val.id
		let x = mp_val.pos.x
		let y = mp_val.pos.y
		let mm = mp_val.mm
		let iid = indentify_int(id,5)
		let ix = indentify_float(x,5,10)
		let iy = indentify_float(y,5,10)
		let imm = indentify_int(mm,5)
		let line = iid+ix+iy+imm+"\n"
		content += line
	}
	$("#filecontent").text(content)
}
function getArrangedMPArray(){
	let a = []
	let keys = Object.keys(mptree)
	for (let i = 0; i < keys.length; i++){
		a.push(mptree[keys[i]])
	}
	a.sort(function(b,c){
		if( b.pos.y < c.pos.y ) {
			return -1
		}
		if( c.pos.y < b.pos.y ) {
			return 1
		}
		if( b.pos.x < c.pos.x ) {
			return -1
		}
		if( c.pos.x < b.pos.x ) {
			return 1
		}
		return 0
	})
	for (let i = 0; i < a.length; i++){
		a[i].id = i+1
	}
	return a
}
function getMP_idMap(){
	let a = []
	let b = {}
	let keys = Object.keys(mptree)
	for (let i = 0; i < keys.length; i++){
		a.push(mptree[keys[i]])
	}
	a.sort(function(b,c){
		if( b.pos.y < c.pos.y ) {
			return -1
		}
		if( c.pos.y < b.pos.y ) {
			return 1
		}
		if( b.pos.x < c.pos.x ) {
			return -1
		}
		if( c.pos.x < b.pos.x ) {
			return 1
		}
		return 0
	})
	for (let i = 0; i < a.length; i++){
		b[a[i].pos.toString()] = i+1
	}
	return b
}