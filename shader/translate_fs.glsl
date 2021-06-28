#version 300 es

//
// パーティクル出力用のフラグメントシェーダ
//

precision highp float;

varying float vColor;

void main() {
  gl_FragColor = vColor;
}