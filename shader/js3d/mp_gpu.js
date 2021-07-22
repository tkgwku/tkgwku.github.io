var gl, programInfo, buffers, texture;
var img = new Image();
img.src = 'js3d/texture.png';

function main(){
    if (!mps) return;

    const canvas_webgl = document.getElementById('canvas_webgl')
    gl = canvas_webgl.getContext('webgl2')

    //renderer info
    const renderInfo = gl.getExtension("WEBGL_debug_renderer_info")
    if (renderInfo) {
        $("#gpuinfo").text(gl.getParameter(renderInfo.UNMASKED_RENDERER_WEBGL))
        $("#gpuvender").text(gl.getParameter(renderInfo.UNMASKED_VENDOR_WEBGL))
    }

    const vsSource = `
        attribute vec4 aVertexPosition;

        uniform float uRadius;
        uniform vec3  uCam;
        uniform vec3  uEc;
        uniform vec3  uRs;
        uniform vec3  uE_xi;
        uniform vec3  uE_eta;
        uniform float uZoom;
        uniform float uWidth;
        uniform float uHeight;
        uniform float uMaxval;
        uniform float uMinval;
        uniform float uScale;

        varying lowp vec4 vColor;

        vec4 val2color(float val, float maxval, float minval){
            float r = 4.0*(val-minval)/(maxval-minval);
            if ( r < 0.0 ){
                return vec4(0.0, 0.0, 1.0, 0.8);
            } else if ( r < 1.0 ) {
                return vec4(0.0, r, 1.0, 0.8);
            } else if ( r < 2.0 ) {
                return vec4(0.0, 1.0, 2.0-r, 0.8);
            } else if ( r < 3.0 ) {
                return vec4(r-2.0, 1.0, 0.0, 0.8);
            } else if ( r < 4.0 ) {
                return vec4(1.0, 4.0-r, 0.0, 0.8);
            } else if ( r < 5.0 ) {
                return vec4(1.0, 0.0, r-4.0, 0.8);
            } else {
                return vec4(1.0, 0.0, 1.0, 0.8);
            }
        }

        void main(void) {
            vec3 rp = aVertexPosition.xyz * uScale;
            float val = aVertexPosition.w;
            if (  dot(uEc, rp - uRs) > 0.0  ){
                float k = dot(uEc, uRs-uCam) / dot(uEc, rp-uCam);
                gl_PointSize = uRadius * k * uZoom;
                vec3 X = ((1.0-k) * uCam) + k * rp - uRs;
                float posx = 2.0 * uZoom* dot(X, uE_xi)/uWidth;
                float posy = 2.0 * uZoom* dot(X, uE_eta)/uHeight;
                gl_Position = vec4(posx, posy, distance(uRs,rp)/2000.0, 1.0);
                vColor = val2color(val, uMaxval, uMinval);
            } else {
                vColor = vec4(0.0);
            }
        }
    `;

    const fsSource = `
        precision mediump float;

        uniform sampler2D uTexture;

        varying lowp vec4 vColor;

        void main(void) {
            vec4 smpColor = texture2D(uTexture, gl_PointCoord);
            if (smpColor.w == 0.0){
                discard;
            }
            gl_FragColor = vColor * smpColor;
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        },
        uniformLocations: {
            radius:  gl.getUniformLocation(shaderProgram, 'uRadius'),
            cam:     gl.getUniformLocation(shaderProgram, 'uCam'),
            ec:      gl.getUniformLocation(shaderProgram, 'uEc'),
            rs:      gl.getUniformLocation(shaderProgram, 'uRs'),
            e_xi:    gl.getUniformLocation(shaderProgram, 'uE_xi'),
            e_eta:   gl.getUniformLocation(shaderProgram, 'uE_eta'),
            zoom:    gl.getUniformLocation(shaderProgram, 'uZoom'),
            width:   gl.getUniformLocation(shaderProgram, 'uWidth'),
            height:  gl.getUniformLocation(shaderProgram, 'uHeight'),
            maxval:  gl.getUniformLocation(shaderProgram, 'uMaxval'),
            minval:  gl.getUniformLocation(shaderProgram, 'uMinval'),
            scale:   gl.getUniformLocation(shaderProgram, 'uScale'),
            //fs 
            texture: gl.getUniformLocation(shaderProgram, 'uTexture'),
        },
    };
    buffers = initBuffers(gl);
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
	gl.enable(gl.BLEND);
  
	// ブレンドファクター
	gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE);

    // テクスチャオブジェクトの生成
    let tex = gl.createTexture();
    // テクスチャをバインドする
    gl.bindTexture(gl.TEXTURE_2D, tex);
    // テクスチャへイメージを適用
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    // ミップマップを生成
    gl.generateMipmap(gl.TEXTURE_2D);
    // テクスチャのバインドを無効化
    gl.bindTexture(gl.TEXTURE_2D, null);
    
    // 生成したテクスチャを変数に代入
    texture = tex;

    drawScene();
}

function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
  
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }
  
    return shaderProgram;
}

function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
  
    return shader;
}
function initBuffers(gl) {

    // Create a buffer for the square's positions.
  
    const positionBuffer = gl.createBuffer();
  
    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.
  
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  
    // Now create an array of positions for the square.
  
    const positions = mps;
  
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
  
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
  
    return {
        position: positionBuffer,
    };
}
function drawScene() {
    gl.clearColor(0.0, 0.0, 0.0, 0.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything

    // Clear the canvas before we start drawing on it.
  
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // ポイントスプライトに設定するテクスチャをバインド
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute
    {
        const numComponents = 4;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
            programInfo.attribLocations.vertexPosition,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
  
    // Tell WebGL to use our program when drawing
  
    gl.useProgram(programInfo.program);
  
    // Set the shader uniforms
  
    gl.uniform1f (programInfo.uniformLocations.radius , radius);
    gl.uniform3fv(programInfo.uniformLocations.cam    , [sys.cam.x,   sys.cam.y,   sys.cam.z]);
    gl.uniform3fv(programInfo.uniformLocations.ec     , [sys.ec.x,    sys.ec.y,    sys.ec.z]);
    gl.uniform3fv(programInfo.uniformLocations.rs     , [sys.rs.x,    sys.rs.y,    sys.rs.z]);
    gl.uniform3fv(programInfo.uniformLocations.e_xi   , [sys.e_xi.x,  sys.e_xi.y,  sys.e_xi.z]);
    gl.uniform3fv(programInfo.uniformLocations.e_eta  , [sys.e_eta.x, sys.e_eta.y, sys.e_eta.z]);
    gl.uniform1f (programInfo.uniformLocations.zoom   , sys.zoom);
    gl.uniform1f (programInfo.uniformLocations.width  , sys.width);
    gl.uniform1f (programInfo.uniformLocations.height , sys.height);
    gl.uniform1f (programInfo.uniformLocations.maxval , 2.1);
    gl.uniform1f (programInfo.uniformLocations.minval , 0.9);
    gl.uniform1f (programInfo.uniformLocations.scale  , 20);
    //fs
    gl.uniform1i (programInfo.uniformLocations.texture, 0);
  
    {
        const offset = 0;
        const vertexCount = mps.length/4;
        gl.drawArrays(gl.POINTS, offset, vertexCount);
    }
}
