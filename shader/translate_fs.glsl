#version 300 es

//
// パーティクル出力用のフラグメントシェーダ
//

precision highp float;

in float val;

out vec4 fragColor;

void main() {
  //209, 79, 65 ~ 67, 65, 209 Linear gradient
  vec3 red = vec3(0.82,0.31,0.255);
  vec3 blue = vec3(0.255​,0.82,0.263);
  fragColor = vec4( (blue-red)*(val-1.0)+red, 1.0);
}