import * as Config from "../Model/Config";
import * as GameLog from "./GameLog";

export function makeShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  console.assert(type === gl.VERTEX_SHADER || type === gl.FRAGMENT_SHADER);
  
  let shader: WebGLShader = gl.createShader(type);

  // set the source code
  gl.shaderSource(shader, sourcemod(source));

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
    GameLog.error("Shader compilation error.");
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

  return shaderProgram;
}

function sourcemod(data: string): string {
  if (Config.get<boolean>("lowShaderQuality")) {
    return "#define LOW\n" + data;
  } else {
    return data;
  }
}

export class ProgramContainer {
  private gl: WebGLRenderingContext;
  private program: WebGLProgram;
  private vertexAttribs: VertexAttrib[] = [];
  private vertexStride: number;
  private buffer: WebGLBuffer;
  private uniforms: Map<string, WebGLUniformLocation> = new Map();
  private mode: number;

  constructor(gl: WebGLRenderingContext, program: WebGLProgram, mode:number, stride:number) {
    this.gl = gl;
    this.program = program;
    this.vertexStride = stride;
    this.buffer = gl.createBuffer();
    this.mode = mode;
  }

  public addVertexAttrib(
    name: string,
    size: number,
    offset: number): void {
    let indx: number = this.gl.getAttribLocation(this.program, name);
    
    this.vertexAttribs.push(new VertexAttrib(indx, size, offset));
  }

  public addUniforms(names: string[]): void {
    names.forEach(name => {
      let x: WebGLUniformLocation = this.gl.getUniformLocation(this.program, name);

      if (x === null) {
        throw new Error("uniform location not found");
      }

      this.uniforms.set(name, x);
    }, this);
  }

  public getUniform(name: string): WebGLUniformLocation {
    return this.uniforms.get(name);
  }

  public bufferData(data: Float32Array): void {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);
  }

  public use(): void {
    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
  }
  public setUpVertexAttrib(): void {
    let gl = this.gl;

    // set up vertex attrib
    this.vertexAttribs.forEach(v => v.set(gl, this.vertexStride), this);
  }

  public draw(count: number) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.drawArrays(this.mode, 0, count);

    // unbind buffer
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }
}

class VertexAttrib {
  public index: number;
  public size: number;
  public offset: number;

  constructor(indx:number, size:number, offset:number) {
    this.index = indx;
    this.size = size;
    // assume gl.FLOAT (4 bytes)
    this.offset = 4 * offset;
  }

  public set(gl: WebGLRenderingContext, stride: number): void {
    gl.enableVertexAttribArray(this.index);
    gl.vertexAttribPointer(this.index, this.size, gl.FLOAT, false, 4 * stride, this.offset);
  }
}