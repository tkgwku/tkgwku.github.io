/*
 * components.js
 *
 * copyright; github.com@tkgwku, all rights reserved.
 */

var mptree = {}
var apditree = {}
var vertextree = {}
var boundarray = []

function APDI(mpin, v1, v2, v3, v4) {
	this.mp = mpin
	this.v1 = v1
	this.v2 = v2
	this.v3 = v3
	this.v4 = v4
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
function MP(mm, pos){
	this.mm = mm
	this.pos = pos
	this.id = null
}
MP.prototype.addToTree = function(){
	let _s = this.pos.toString()
	if (!mptree.hasOwnProperty(_s)){
		mptree[this.pos.toString()] = this
	}
}
function Pos(x,y){
	this.x = x
	this.y = y
}
Pos.prototype.toString = function(){
	return "(" + this.x + "," + this.y + ")"
}

function Boundary(pos1, pos2, xfix, yfix){
	this.pos1 = pos1
	this.pos2 = pos2
	this.xfix = xfix//boolean
	this.yfix = yfix
}