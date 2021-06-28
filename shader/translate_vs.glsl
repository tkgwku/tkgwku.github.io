#version 300 es

//
// 全パーティクル共通の変数（uniform変数）
//

// Uniform radius
uniform float radius;
// Cemera Pos
uniform vec3 cam;
// Cemera Looking dire unit vec
uniform vec3 ec;
// Cemera Center Pos
uniform vec3 rs;
// Camera screen U unit vec
uniform vec3 e_xi;
// Cemera screen V unit vec
uniform vec3 e_eta;
// Zoom
uniform float zc;
// Width
uniform float width;
// Height
uniform float height;

//
// パーティクルごとの変数（in変数）
//

// Particle Pos
in vec3 rp;
in float val;

varying float vColor;
//
// メイン処理
//
void main() {
  if (dot(ec, rp-rs) > 0.0){
    float k = dot(ec, rs-cam)/dot(ec, rp-cam);
    gl_PointSize = radius * k;
    vec3 X = ((1.0-k) * cam) + k * rp - rs;
    gl_Position = vec4(width/2.0 + zc* dot(X, e_xi), height/2.0 + zc* dot(X, e_eta), length(rs-rp), 1.0);
    //209, 79, 65 ~ 67, 65, 209 Linear gradient
    vec3 red = vec3(0.82,0.31,0.255);
    vec3 blue = vec3(0.255​,0.82,0.263);
    vColor = vec4( (blue-red)*(val-1.0)+red, 1.0);
  } else {
    vColor = vec4(0.0, 0.0, 0.0, 0.0);
  }
}