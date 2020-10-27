
var ncond = []

function addNCOND(x1,y1,x2,y2,fix){
	ncond.push({
		"x1":x1,
		"y1":y1,
		"x2":x2,
		"y2":y2,
		"xfix":(fix==="sncond_x"||fix==="sncond_xy")?1:0,
		"yfix":(fix==="sncond_y"||fix==="sncond_xy")?1:0
	})
}