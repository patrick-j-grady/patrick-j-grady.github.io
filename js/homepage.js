// Get the canvas element
var canvas = document.getElementById('testCanvas');
console.log("asdfasf");

// Create the WebGL context
var gl = canvas.getContext('webgl');

// Vertex shader code
var vertexShaderSource = `
  attribute vec2 position;

  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

// Fetch the fragment shader code from the external file
fetch('shader.glsl')
  .then(response => response.text())
  .then(fragmentShaderSource => {
    // Create the shader program
    var shaderProgram = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);

    // Get the position attribute location
    var positionAttributeLocation = gl.getAttribLocation(shaderProgram, 'position');

    // Create a buffer
    var positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Set the buffer data
    var positions = [
      -1, -1,
      -1, 1,
      1, -1,
      1, -1,
      -1, 1,
      1, 1
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Set up the position attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Get the time uniform location
    var timeUniformLocation = gl.getUniformLocation(shaderProgram, 'time');

    // Get the resolution uniform location
    var resolutionUniformLocation = gl.getUniformLocation(shaderProgram, 'resolution');

    // Render the shader
    function render() {
      // Set the viewport and clear the canvas
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);

      // Use the shader program
      gl.useProgram(shaderProgram);

      // Set the time uniform
      gl.uniform1f(timeUniformLocation, performance.now() / 1000.0);

      // Set the resolution uniform
      gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

      // Draw the triangles
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      // Request the next frame
      requestAnimationFrame(render);
    }

    // Start rendering
    render();
  })
  .catch(error => {
    console.error('Failed to fetch the shader code:', error);
  });

// Create the shader program
function createShaderProgram(gl, vertexShaderSource, fragmentShaderSource) {
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  return program;
}