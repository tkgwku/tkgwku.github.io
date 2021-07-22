
var mps = {}
var apditree = {}
var vertextree = {}
var boundarray = []
var keybinds_onkeydown = {}

function MP(mm, pos){
	this.mm = mm
	this.pos = pos
	this.id = null
}

MP.prototype.addToMPTree = function(){
	let _s = this.pos.toString()
	if (!mps.hasOwnProperty(_s)){
		mps[this.pos.toString()] = this
	}
}

function Pos(x,y,z){
	this.x = x
	this.y = y
	this.z = z
}

Pos.prototype.toString = function(){
	let r = 10000
	let _x = Math.round(this.x*r)/r
	let _y = Math.round(this.y*r)/r
	let _z = Math.round(this.z*r)/r
	return "(" + _x + "," + _y + "," + _z + ")"
}

function APDI(mpin, v1, v2, v3, v4, v5, v6, v7, v8) {
	this.mp = mpin
	this.v1 = v1
	this.v2 = v2
	this.v3 = v3
	this.v4 = v4
	this.v5 = v5
	this.v6 = v6
	this.v7 = v7
	this.v8 = v8
	this.id = null
}

APDI.prototype.addToTree = function(){
	let _s = this.mp.pos.toString()
	if (!apditree.hasOwnProperty(_s)){
		apditree[_s] = this
	}
}

APDI.prototype.addVertexAndMP = function(){
	this.mp.addToTree()
	this.v1.addToTree()
	this.v2.addToTree()
	this.v3.addToTree()
	this.v4.addToTree()
	this.v5.addToTree()
	this.v6.addToTree()
	this.v7.addToTree()
	this.v8.addToTree()
}

function Vertex(pos){
	this.pos = pos
	this.id = null
}

Vertex.prototype.addToTree = function(){
	let _s = this.pos.toString()
	if (!vertextree.hasOwnProperty(_s)){
		vertextree[_s] = this
	}
}

function Boundary(pos1, pos2, xfix, yfix, zfix){
	this.pos1 = pos1
	this.pos2 = pos2
	this.xfix = xfix//boolean
	this.yfix = yfix
	this.zfix = zfix
}

function Directory(name){
	this.name = name
	this.children = []
}

Directory.prototype.appendChild = function(child){
	this.children.push(child)
}

Directory.prototype.getDir = function(dirname){
	for (let i = 0;i < this.children.length;i++){
		let child = this.children[i]
		if ((child instanceof Directory)&&(child.name === dirname)){
			return child
		}
	}
	return null
}

function Keybind(code, ctrl, alt, shift, func, this_arg, ...args){
	this.code = code
	this.ctrl = ctrl
	this.alt = alt
	this.shift = shift
	this.func = func
	this.this_arg = this_arg
	this.args = args
	this.id = this.code+";"+(this.ctrl?1:0)+""+(this.alt?1:0)+""+(this.shift?1:0)
}

Keybind.prototype.register_onkeydown = function(){
	keybinds_onkeydown[this.id] = this
	document.onkeydown = function(e){
		let _id = e.code+";"+(e.ctrlKey?1:0)+""+(e.altKey?1:0)+""+(e.shiftKey?1:0)
		if (keybinds_onkeydown.hasOwnProperty(_id)){
			keybinds_onkeydown[_id].call(e)
		}
	}
}

Keybind.prototype.call = function(e){
	this.func.call(this.this_arg, e, this.args)
}
