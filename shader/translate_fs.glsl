#version 300 es

//
// パーティクル出力用のフラグメントシェーダ
//

precision highp float;

in float val;

out vec4 fragColor;

void main() {
  //209, 79, 65 ~ 67, 65, 209 Linear gradient
  fragColor = vec4( (vec3(0.255​,0.82,0.263)-vec3(0.82,0.31,0.255))*(val-1.0)+vec3(0.82,0.31,0.255), 1.0)
}