
	
function Vec3d(x,y,z){
	this.x = x
	this.y = y
	this.z = z
}

Vec3d.prototype.norm = function(){
	return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z)
}

Vec3d.prototype.dot = function(v){
	return this.x*v.x+this.y*v.y+this.z*v.z
}

Vec3d.prototype.normalize = function(){
	const _a = this.norm()
	return new Vec3d(this.x/_a, this.y/_a, this.z/_a)
}

Vec3d.fromQu = function(q1){
	return new Vec3d(q1.b, q1.c, q1.d)
}

Vec3d.prototype.rotate3d = function(vec, theta){
	return Vec3d.fromQu(Qu.createRot(vec, theta).f(this))
}

Vec3d.prototype.plus = function(vec, multi){
	return new Vec3d(this.x+vec.x*multi, this.y+vec.y*multi, this.z+vec.z*multi)
}
Vec3d.prototype.multi = function(multi){
	return new Vec3d(this.x*multi, this.y*multi, this.z*multi)
}
Vec3d.prototype.toString = function(){
	return `(${numToStr(this.x)}, ${numToStr(this.y)}, ${numToStr(this.z)})`
}

/**
 * クォータニオン
 * @constructs {number} a,b,c,d
 */
function Qu(_a,_b,_c,_d){
	this.a = _a
	this.b = _b
	this.c = _c
	this.d = _d
}

Qu.createRot = function(vec, theta){
	const _a = Math.sin(theta/2) / vec.norm()
	return new Qu(Math.cos(theta/2), _a*vec.x, _a*vec.y, _a*vec.z)
}

Qu.prototype.multiply = function(q2){
	return new Qu(this.a*q2.a - this.b*q2.b - this.c*q2.c - this.d*q2.d,
			    this.b*q2.a + this.a*q2.b + this.c*q2.d - this.d*q2.c,
			    this.a*q2.c + this.c*q2.a + this.d*q2.b - this.b*q2.d,
			    this.a*q2.d + this.d*q2.a + this.b*q2.c - this.c*q2.b)
}

Qu.prototype.inv = function(){
	return new Qu(this.a, -this.b, -this.c, -this.d)
}

Qu.prototype.f = function(vec){
	return this.multiply( Qu.fromVec3d(vec) ).multiply(this.inv())
}

Qu.fromVec3d = function(vec){
	return new Qu(0, vec.x, vec.y, vec.z)
}

function Vec2d(x,y){
	this.x = x
	this.y = y
}
///////
function Line(vec1, vec2){
	this.vec1 = vec1
	this.vec2 = vec2
}

Line.prototype.draw = function(_ctx, _sys){
	let _v1 = _sys.translate(this.vec1)
	let _v2 = _sys.translate(this.vec2)
	if (!_v1 && !_v2){
		return
	} else if (!_v1) {
		_v1 = _sys.intersect(this.vec1, this.vec2)
		if (!_v1) return
	} else if (!_v2) {
		_v2 = _sys.intersect(this.vec2, this.vec1)
		if (!_v2) return
	}
	_ctx.moveTo(_v1.x, _v1.y)
	_ctx.lineTo(_v2.x, _v2.y)
}


function CanvasText(pos, text, fontsize=16, fontfamily="monospace"){
	this.pos = pos
	this.text = text
	this.fontsize = fontsize
	this.fontfamily = fontfamily
}

CanvasText.prototype.draw = function(_ctx, _sys){
	let _pos = _sys.translate_withsizefactor(this.pos)
	if (!_pos){
		return
	}
	_ctx.font = `${Math.ceil(_pos.z*this.fontsize*3)}px ${this.fontfamily}`;
	_ctx.fillText(this.text, _pos.x, _pos.y);
}

function CameraSystem(width, height){
	this.width = width
	this.height = height
	this.reset()
}

CameraSystem.prototype.reset = function(){
	this.cam = new Vec3d(0,-800,800)
	this.e_xi = new Vec3d(1,0,0)
	this.e_eta = new Vec3d(0,0.70710678118,0.70710678118)
	this.ec = new Vec3d(0,0.70710678118,-0.70710678118)
	this.zoom = 7
	
	//this.cam = new Vec3d(1963.115029370521, -1305.355576256114, 1119.982330297613)
	//this.e_xi = new Vec3d(0.7604048920988545, 0.6494493052364939, -3.3610267347050637e-18)
	//this.e_eta = new Vec3d(-0.1634860990335956, 0.1914169874275814, 0.9677974128548019)
	//this.ec = new Vec3d(-0.6285353573882136, 0.7359178872953963, -0.25173034710394837)
	//this.zoom = 18.15619722070002
	
	this.cam_len = 50
	this.rs = this.cam.plus(this.ec, this.cam_len)	
}

CameraSystem.prototype.rot = function(vec, theta){
	this.cam = this.cam.rotate3d(vec, theta)
	this.e_xi = this.e_xi.rotate3d(vec, theta)
	this.e_eta = this.e_eta.rotate3d(vec, theta)
	this.ec = this.ec.rotate3d(vec, theta)
	this.rs = this.rs.rotate3d(vec, theta)
}

CameraSystem.prototype.translate = function(rp){
	if (this.ec.dot(rp.plus(this.rs, -1)) <= 0) {return false}
	let _k = this.ec.dot(this.rs.plus(this.cam, -1)) / this.ec.dot(rp.plus(this.cam, -1))
	let _X = this.cam.multi(1-_k).plus(rp, _k).plus(this.rs, -1)
	return new Vec2d(this.width/2+this.zoom*_X.dot(this.e_xi), this.height/2-this.zoom*_X.dot(this.e_eta))
}

CameraSystem.prototype.translate_withsizefactor = function(rp){
	if (this.ec.dot(rp.plus(this.rs, -1)) <= 0) {return false}
	let _k = this.ec.dot(this.rs.plus(this.cam, -1)) / this.ec.dot(rp.plus(this.cam, -1))
	let _X = this.cam.multi(1-_k).plus(rp, _k).plus(this.rs, -1)
	return new Vec3d(this.width/2+this.zoom*_X.dot(this.e_xi), this.height/2-this.zoom*_X.dot(this.e_eta), _k*this.zoom)
}

/**
 * vec1とvec2が結ぶ直線と、カメラ平面との交点。
 * @param {vec3d} vec1, vec2 
 * @return {vec2d|boolean} カメラ座標系での交点
 */
CameraSystem.prototype.intersect = function(vec1, vec2){
	let _k = this.ec.dot(this.rs.plus(vec2, -1)) / this.ec.dot(vec1.plus(vec2, -1))
	if (_k > 1 || _k < 0) {return false}
	return this.translate(vec1.multi(_k-0.05).plus(vec2, 1.05-_k))
}

function DebugGrid(){
	this.line = []
	this.axis = []
	this.axisLabel = []
	for (let i=-5;i<=5;i++){
		this.line.push(new Line(new Vec3d(100*i, -500, 0), new Vec3d(100*i, 500, 0)))
		this.line.push(new Line(new Vec3d(-500,  100*i, 0), new Vec3d( 500, 100*i, 0)))
		//this.line.push(new Line(new Vec3d(100*i+500, 0, 0), new Vec3d(100*i+500, 1000, 0)))
		//this.line.push(new Line(new Vec3d(0,  100*i+500, 0), new Vec3d( 1000, 100*i+500, 0)))
	}
	this.axis.push(new Line(new Vec3d(-200, 0, 0), new Vec3d(200, 0, 0)))
	this.axis.push(new Line(new Vec3d(0, -200, 0), new Vec3d(0, 200, 0)))
	this.axis.push(new Line(new Vec3d(0, 0, -200), new Vec3d(0, 0, 200)))
	//this.axis.push(new Line(new Vec3d(0, 0, 0), new Vec3d(200, 0, 0)))
	//this.axis.push(new Line(new Vec3d(0, 0, 0), new Vec3d(0, 200, 0)))
	//this.axis.push(new Line(new Vec3d(0, 0, 0), new Vec3d(0, 0, 200)))
	this.axisLabel.push(new CanvasText(new Vec3d(200, 0, 0), "x"))
	this.axisLabel.push(new CanvasText(new Vec3d(0, 200, 0), "y"))
	this.axisLabel.push(new CanvasText(new Vec3d(0, 0, 200), "z"))
}

DebugGrid.prototype.draw = function(_ctx, _sys){
	_ctx.lineWidth = 1;
	_ctx.beginPath();
	for (let i=0;i<this.line.length;i++){
		this.line[i].draw(_ctx, _sys)
	}
	_ctx.strokeStyle = "#bbb";
	_ctx.stroke();
	
	const col = ["#f00", "#32CD32", "#00f"]
	_ctx.textAlign = "center";
	for (let i=0;i<this.axis.length;i++){
		_ctx.beginPath();
		_ctx.strokeStyle = col[i];
		this.axis[i].draw(_ctx, _sys);
		_ctx.stroke();
		_ctx.fillStyle = col[i];
		this.axisLabel[i].draw(_ctx, _sys);
	}
}

function MPMSystem(){
	this.mps = []
}

//
function Z_buffer(_ctx, _sys){
	this.gpu = new GPU();
	this.ctx = _ctx
	this.sys = _sys
}
