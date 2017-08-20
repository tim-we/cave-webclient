export function makeShader(gl: WebGLRenderingContext, type:number, source: string):WebGLShader {
  console.assert(type === gl.VERTEX_SHADER || type === gl.FRAGMENT_SHADER);
  
  let shader: WebGLShader = gl.createShader(type);

  // set the source code
  gl.shaderSource(shader, source);

  // compile the shader program
  gl.compileShader(shader);

  // see if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error ", gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

export function createProgram(gl:WebGLRenderingContext, shaders:WebGLShader[]):WebGLProgram {
  console.assert(shaders.length > 0);
  let program: WebGLProgram = gl.createProgram();

  // attach all shaders & link
  shaders.forEach(shader => gl.attachShader(program, shader));
  gl.linkProgram(program);

  // see if linking worked
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Unable to initialize the shader program.", gl.getProgramInfoLog(program));
    return null;
  }

  /* for DEBUG only:
  gl.validateProgram(program);
  if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
    console.error("Error validating program.", gl.getProgramInfoLog(program));
    return null;
  }
  */

  return program;
}

export function createProgramFromSource(gl: WebGLRenderingContext, vssource: string, fssource: string): WebGLProgram {
  let shaders: WebGLShader[] = [
    makeShader(gl, gl.VERTEX_SHADER, vssource),
    makeShader(gl, gl.FRAGMENT_SHADER, fssource)
  ];

  let shaderProgram: WebGLProgram = createProgram(gl, shaders);

  //gl.useProgram(shaderProgram);

  return shaderProgram;
}