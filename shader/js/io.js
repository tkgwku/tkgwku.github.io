
var fileread_state = false

var input_apdi_file = null
var input_mp_file = null

var copied_apditree
var copied_mptree
var copied_vertextree

var zip
var zip_renban_folder
var zip_status = "ready"
var zip_filename
var zip_filecount = 0
var zip_resolution = 1920

function add_zip_que(svgEl, isLast){
	zip_filecount++
	zip_filename = "MPM"+zip_filecount+".jpg"
	$("#visu_zip_comment").text("フレームをロード中："+zip_filecount+" frame")
	svgclone = svgEl.cloneNode(true)
	let vb = svgclone.getAttribute("viewBox").split(" ").map((str)=>{return parseInt(str)})
	if ($("#visu_transparent").prop("checked")){
		$(svgclone).find("[data-remove=background]").remove()
	}
	const ch = $(svgclone).find("circle[data-hl=circle_highlight]")[0]
	if (typeof ch !== typeof undefined) {
		ch.setAttribute("r", vmp_radius)
		ch.removeAttribute("stroke")
		ch.removeAttribute("stroke-width")
		ch.removeAttribute("data-hl")
	}
	const ti = $(svgclone).find("text[id=visu_data_indi]").remove()
	//$("#visu_zip_comment").text("フレームをBase64に変換中："+zip_filecount+" frame")
	let s = new XMLSerializer().serializeToString(svgclone)
	let uri = 'data:image/svg+xml;base64,' + window.btoa(s)
	let imgwidth, imgheight
	if (vb[2] > vb[3]){
		//wider
		imgwidth = zip_resolution
		imgheight = Math.round(zip_resolution * vb[3] / vb[2])
	} else {
		//deeper
		imgheight = zip_resolution
		imgwidth = Math.round(zip_resolution * vb[2] / vb[3])
	}
	let image = new Image(imgwidth, imgheight)
	image.setAttribute("data-name", zip_filename)
	if (isLast) image.setAttribute("data-isLast", "true")
	image.onload = function(e) {
		$("#visu_zip_comment").text("フレームを監視中："+zip_filecount+" frame")
		let canvas = document.createElement('canvas')
		canvas.width = e.target.width
		canvas.height = e.target.height
		let context = canvas.getContext('2d')
		context.drawImage(e.target, 0, 0)
		let pngURI = canvas.toDataURL('image/png').replace("data:image/png;base64,", "")
		zip_renban_folder.file(e.target.getAttribute("data-name"), pngURI, {base64: true});
		if (e.target.hasAttribute("data-isLast")){
			$("#visu_zip_comment").text("zipファイルを生成中... 合計"+zip_filecount+"ファイル")
			zip.generateAsync({type:"blob"}).then(function(content) {
				$("#visu_zip_comment").text("URLを生成中...")
				saveBlob(content, "連番.zip")
				$("#visu_zip_comment").text("")
			});
		}
	}
	image.src = uri
	$("#visu_zip_comment").text("フレームをPNGに変換中："+zip_filecount+" frame")
}

function read_input_contents(){
	const readermp = new FileReader()
	
	readermp.addEventListener('load', (e) => {
		try {
			let str = e.target.result
			let lines = str.split("\n")
			for (let i  = 0; i < lines.length; i++){
				let line = lines[i]
				if (line.replace(/\s+/g, "").length < 1) {
					continue
				}
				let id = parseInt(line.substring(0,5))
				let x = parseFloat(line.substring(5,15))
				let y = parseFloat(line.substring(15,25))
				let mm = parseInt(line.substring(25,30))
				if (isNaN(id) || isNaN(x) || isNaN(y) || isNaN(mm)){
					throw "input_mpファイルを読み込めませんでした "+(i+1)+"行目 \""+line+"\""
				}
				let pos = new Pos(x,y)
				let mp = new MP(mm, pos)
				mp.id = id
				mptree[pos.toString()] = mp
				mpid_mp_map[id] = mp
			}
			if ( input_apdi_file != null) {
				readerapdi.readAsText(input_apdi_file)
			} else {
				convertMP()
				convertInputAPDI()
				drawRect()
				//apditree = copied_apditree
				//mptree = copied_mptree
				//vertextree = copied_vertextree
				fileread_state = true
			}
		} catch (e) {
			push_alert(e.toString(), 3)
		}
	})
	
	readerapdi.addEventListener('load', (e) => {
		try {
			let str = event.target.result
			let lines = str.split("\n")
			let phase = 0
			let num_v, num_a
			for (let i  = 0; i < lines.length; i++){
				let line = lines[i]
				if (line.replace(/\s+/g, "").length < 1) {
					continue
				} else if (line.substring(0,1) === "#") {
					phase++ 
				} else {
					if (phase === 3){
						if (line.substring(0,1) === "n"){
							num_v = parseInt(line.substring(13,line.length))
						} else {
							let id = parseInt(line.substring(0,10))
							let x = parseFloat(line.substring(10,20))
							let y = parseFloat(line.substring(20,30))
							let pos = new Pos(x,y)
							let vertex = new Vertex(pos)
							if (isNaN(id) || isNaN(x) || isNaN(y)){
								throw "input_apdiファイルを読み込めませんでした "+(i+1)+"行目 \""+line+"\""
							}
							vertex.id = id
							vertextree[pos.toString()] = vertex
							vid_v_map[id] = vertex
						}
					} else if (phase === 6){
						if (line.substring(0,1) === "n"){
							num_a = parseInt(line.substring(13,line.length))
						} else {
							let id = parseInt(line.substring(0,10))
							let mpid = parseInt(line.substring(10,20))
							let v1id = parseInt(line.substring(20,30))
							let v2id = parseInt(line.substring(30,40))
							let v3id = parseInt(line.substring(40,50))
							let v4id = parseInt(line.substring(50,60))
							
							if (isNaN(id) || isNaN(mpid) || isNaN(v1id) || isNaN(v2id) || isNaN(v3id) || isNaN(v4id)){
								throw "input_apdiファイルを読み込めませんでした "+(i+1)+"行目 \""+line+"\""
							}
							
							let mp = mpid_mp_map[mpid]
							let v1 = vid_v_map[v1id]
							let v2 = vid_v_map[v2id]
							let v3 = vid_v_map[v3id]
							let v4 = vid_v_map[v4id]
							let apdi = new APDI(mp,v1,v2,v3,v4)
							apdi.id = id
							apditree[mp.pos.toString()] = apdi
						}
					}
				}
			}
			convertMP()
			convertInputAPDI()
			drawRect()
			//apditree = copied_apditree
			//mptree = copied_mptree
			//vertextree = copied_vertextree
			fileread_state = true
		} catch (e) {
			push_alert(e.toString(), 3, e.toString())
		}
	})
	readermp.readAsText(input_mp_file)
}

function indentify_int(n, indent){
	let s = n+""
	let slen = s.length
	if (indent < slen) console.error("indent < slen")
	if (indent > 29) console.error("indent > 29")
	s="                             ".substring(0, indent-slen)+s
	return s
}

function indentify_float(n, k, indent){
	let _n = Math.round(n*(10**k))/(10**k)
	let s = _n+""
	let _s = s.split(".")
	if (_s.length > 2) console.error("_s.length > 2")
	if (_s.length === 2){
		s = _s[0] +"."+ _s[1].substring(0, k)
	} else {
		if (s.length < indent-1){
			s=s+".0"
		}
	}
	let slen = s.length
	//内部で決める値
	if (indent < slen) console.error("indent < slen")
	if (indent > 29) console.error("indent > 29")
	s="                             ".substring(0, indent-slen)+s
	return s
}

function saveAsFile(filename, content, filetype){
	if (typeof filetype === typeof undefined || filetype == null) {
		filetype = 'text/plane;'
	}
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

// from:  https://gist.github.com/cacheflowe/99f4877f0daeac255ff4192ab28c84fe
function renderSVG(svgEl, renderedCallback, jpgQuality) {
	// WARNING! Inline <image> tags must have a base64-encoded image as their source. Linked image files will not work.
	// transform svg into base64 image
	let s = new XMLSerializer().serializeToString(svgEl)
	let uri = 'data:image/svg+xml;base64,' + window.btoa(s)
	let vb = svgEl.getAttribute("viewBox").split(" ").map((str)=>{return parseInt(str)})
	
	// load svg image into canvas
	let image = new Image(vb[2], vb[3])
	image.onload = function() {
		let canvas = document.createElement('canvas')
		canvas.width = image.width
		canvas.height = image.height
		let context = canvas.getContext('2d')
		context.drawImage(image, 0, 0)
		if(jpgQuality > 0.2) {
			//canvas.toBlob(renderedCallback, 'image/jpeg', jpgQuality)
			let jpgURI = canvas.toDataURL('image/jpeg', jpgQuality)
			renderedCallback(jpgURI)
			//let jpgBytestring = window.atob(jpgURI.split(",")[1])
			//let jpgType = jpgURI.match( /(:)([a-z\/]+)(;)/ )[2]
			//let jpgBytelength = jpgBytestring.length
			//let jpgContent = new Uint8Array(jpgBytelength)
			//for(let i=0, ; i < jpgBytelength; i++ ) {
			//	jpgContent[i] = jpgBytestring.charCodeAt(i) ;
			//}
			//let jpgBlob = new Blob([jpgContent], {type: jpgType})
			//renderedCallback(jpgBlob)
		} else {
			//canvas.toBlob(renderedCallback, 'image/png')
			let pngURI = canvas.toDataURL('image/png')
			renderedCallback(pngURI)
		}
	}
	image.src = uri
}
