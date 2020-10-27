
var MPtree = []
var MPcount = 0
var MPrect = []

function addToMPTree(id,x,y,mm){
	MPtree.push({
		"id": id,
		"x": x,
		"y": y,
		"mm": mm
	})
}

function addMP_fromGrid(mm,x1,y1,x2,y2,gridWidth,numInGrid){
	let sqrt_numInGrid = Math.round(Math.sqrt(numInGrid))
	let col = Math.round(Math.abs(x2-x1) / gridWidth)
	let row = Math.round(Math.abs(y2-y1) / gridWidth)
	for (let j = 0;j < row;j++){
		for (let i = 0;i < col;i++){
			for (let p = 0;p < sqrt_numInGrid;p++){
				for (let q = 0;q < sqrt_numInGrid;q++){
					MPcount++
					let x = Math.min(x1,x2) + i * gridWidth + (1+2*p) * gridWidth/(2*sqrt_numInGrid)
					let y = Math.min(y1,y2) + j * gridWidth + (1+2*q) * gridWidth/(2*sqrt_numInGrid)
					addToMPTree(MPcount,x,y,mm)
				}
			} 
		}
	}
}

function addMP_fromXY(mm,x1,y1,x2,y2,interval){
	let col = Math.round(Math.abs(x2-x1) / interval) + 1
	let row = Math.round(Math.abs(y2-y1) / interval) + 1
	for (let j = 0;j < row;j++){
		for (let i = 0;i < col;i++){
			MPcount++
			let x = Math.min(x1,x2) + i * interval
			let y = Math.min(y1,y2) + j * interval
			addToMPTree(MPcount,x,y,mm)
		}
	}
}