
// x,y,z,val,x,y,z,val,...
function saveAsVTK(mparray){
    let lines = [
        "# vtk DataFile Version 3.0",
        "a.vtk",
        "ASCII",
        "DATASET UNSTRUCTURED_GRID"
    ]
    let pointslines = ["",`POINTS ${mparray.length/4} float`]
    let celltypeslines = ["",`CELL_TYPES ${mparray.length/4}`]
    let pointdatalines = [
        "",
        `POINT_DATA ${mparray.length/4}`,
        "SCALARS value float",
        "LOOKUP_TABLE default"
    ]
    for (let i = 0; i < mparray.length/4; i++) {
        const x = mparray[4*i];
        const y = mparray[4*i+1];
        const z = mparray[4*i+2];
        const v = mparray[4*i+3];
        pointslines.push(`${x} ${y} ${z}`)
        celltypeslines.push("1")
        pointdatalines.push(`${v}`)
    }

    const content = lines.join("\n")+pointslines.join("\n")+celltypeslines.join("\n")+pointdatalines.join("\n")
    saveAsFile("a.vtk", content)
}

function saveAsFile(filename, content, filetype='text/plane;'){
	let file = new Blob([content], {type: filetype})

	saveBlob(file, filename)
}

function saveBlob(blob, filename){
	if (navigator.msSaveOrOpenBlob) {
		navigator.msSaveOrOpenBlob(blob, filename)
	} else {
		let url = URL.createObjectURL(blob)
		saveURI(url, filename)
	}
}

function saveURI(uri, filename){
	let a = document.createElement('a')
	a.href = uri
	a.download = filename
	a.addEventListener('click', function () {
		requestAnimationFrame(function () {
			URL.revokeObjectURL(a.href);
			a.remove();
		})
	}, false);
	
	a.dispatchEvent(new MouseEvent('click'));
}
