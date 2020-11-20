
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
	if (indent < slen) console.error("indent < slen")
	if (indent > 29) console.error("indent > 29")
	s="                             ".substring(0, indent-slen)+s
	return s
}

function saveAsFile(filename, content){
	var file = new Blob([content], {type: 'text/plane;'});
	if (typeof window.navigator.msSaveOrOpenBlob === "undifined") {
		window.navigator.msSaveOrOpenBlob(file, filename);
	} else {
		var a = document.createElement('a');
		var url = URL.createObjectURL(file);
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		setTimeout(() =>  {
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);  
		}, 0); 
	}
}
