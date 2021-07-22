//Formatが統一 (header, timestampなし)
class FormatReader{
	constructor(format, fn){
		this.format = this.resolve_format(format)
		this.reader = new FileReader()
		this.reader.addEventListener("load", (e)=>{
			try {
				let data = []
				const str = e.target.result
				const lines = str.split("\n")
				for (let i  = 0; i < lines.length; i++){
					const line = lines[i].toLowerCase()
					if (line.replace(/\s+/g, "").length < 1) {
						//空の行もok
						continue
					}
					for (let j = 0;j < this.format.length/3;j++){
						const mode = this.format[j*3]
						const start = this.format[j*3+1]
						const end = this.format[j*3+2]
						if (mode === "F") {
							const fdata = parseFloat(line.substring(start, end))
							if (isNaN(fdata)) throw `[error] couldn't read file: ${this.file.name}`
							data.push(fdata)
						} else if (mode === "I") {
							const idata = parseInt(line.substring(start, end))
							if (isNaN(idata)) throw `[error] couldn't read file: ${this.file.name}`
							data.push(idata)
						} else if (mode === "A") {
							data.push(line.substring(start, end))
						}
					}
				}
				fn.call(this, data)
			} catch (exc) {
				push_alert(exc.toString(), 3, "readerror")
			}
		})
	}

	read(file){
		this.file = file//for sharing filename
		this.reader.readAsText(file)
	}
	
	resolve_format(format){
		let pos = 0
		let result = []
		let splitted = format.replace(/[\(\) ]/g, "").split(",")
		for (let i  = 0; i < splitted.length; i++){
			if (/[FE]/i.test(splitted[i])){
				let m = splitted[i].match(/(\w*)[FE](\w*)\.?(\w*)/i)
				if (!m) console.error(`[FormatReader] format resolve error: ${str}, ${splitted[i]}`)
				let count = m[1]?parseInt(m[1]):1
				let length = m[2]?parseInt(m[2]):1
				for (let j = 0; j < count; j++){
					result.push("F", pos, pos+length)
					pos += length
				}
			} else if (/[IAX]/i.test(splitted[i])){
				let m = splitted[i].match(/(\w*)([IAX])(\w*)/i)
				if (!m) console.error(`[FormatReader] format resolve error: ${str}, ${splitted[i]}`)
				let count = m[1]?parseInt(m[1]):1
				let mode = m[2]
				let length = m[3]?parseInt(m[3]):1
				for (let j = 0; j < count; j++){
					if (mode.toUpperCase() !== "X") result.push(mode, pos, pos+length)
					pos += length
				}
			} else {
				console.error(`[FormatReader] format not found error: ${str}, ${splitted[i]} F,E,I,A,X is supported.`)
			}
		}
		return result
	}
}

//各行のByte数が確定している
//header-->data-->header-->data-->...が繰り返す
class FormatSliceReader extends FormatReader{
	constructor(file, format, headercount=1, datacount, fn){
		this.file = file
		this.format = super.resolve_format(format)
		try {
			this.file.slice(0,1000).text().then(text => {
				const lines = text.split("\n")
				this.blockbyte = 0
				for (let k = 0;k < this.headercount;k++){
					this.blockbyte += byteSize(lines[k])+2
				}
				this.blockbyte += datacount*(byteSize(lines[k+1])+2)
			})
		} catch (e) {
			push_alert(e.toString(), 3, "blockbyteerror")
		}
	}

	read(index){
		try {
			const startbyte = index * this.blockbyte
			const endbyte = (index+1) * this.blockbyte-2
			this.file.slice(startbyte, endbyte).text().then(text => {
				const lines = text.split("\n")
				let header = []
				let data = []
				for (let k = 0;k < this.headercount;k++){
					header.push(lines[k])
				}
				for (let i = 0;i < this.datacount;i++){
					const line = lines[i+k]
					for (let j = 0;j < this.format.length/3;j++){
						const mode = this.format[j*3]
						const start = this.format[j*3+1]
						const end = this.format[j*3+2]
						if (mode === "F") {
							data.push(parseFloat(line.substring(start, end)))
						} else if (mode === "I") {
							data.push(parseInt(line.substring(start, end)))
						} else if (mode === "A") {
							data.push(line.substring(start, end))
						}
					}
				}
				fn.call(this, data, header)
			});
		} catch (e) {
			push_alert(e.toString(), 3, "readerror")
		}
	}
}
