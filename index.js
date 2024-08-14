"use strict";

const vertexShaderSource = `#version 300 es
//attribute is input (in) to a vertex shader.
// It will receive data from buffer
in vec4 a_position;

void main() {
  gl_Position = a_position;
}
`;

const fragmentShaderSource = `#version 300 es

//fragment shaders have no default precision. highp means high precision
precision highp float;

//need to declare output for fragment shader
out vec4 outColor;

void main(){
    //set output constant reddish purp.
    outColor = vec4(1,0,0.5, 1);
}
`;

const RESIZE_HEIGHT_CONSTANT = 3;

function resizeAndUpdate(canvas) {
  window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - RESIZE_HEIGHT_CONSTANT;
    main();
  };
}

function main() {
  const canvas = document.querySelector("#c");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight - RESIZE_HEIGHT_CONSTANT;

  resizeAndUpdate(canvas, main);

  /** @type {WebGLRenderingContext} */
  const gl = canvas.getContext("webgl2");

  if (!gl) {
    console.log("no gl for you");
    return;
  }

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  const program = createProgram(gl, vertexShader, fragmentShader);

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [0, 0, 0, 0.5, 0.7, 0];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const vao = gl.createVertexArray();

  gl.bindVertexArray(vao);

  gl.enableVertexAttribArray(positionAttributeLocation);

  const size = 2;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset
  );

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.useProgram(program);
  gl.bindVertexArray(vao);

  const primitiveType = gl.TRIANGLES;
  const count = 3;
  gl.drawArrays(primitiveType, offset, count);
}

function createProgram(gl, vertexShader, fragmentShader) {
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) return program;

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);

  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}

main();
