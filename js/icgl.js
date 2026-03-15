// HOW TO ADD THIS TO YOUR SCRIPT
// Add 'import * as icgl from "https://codeberg.org/ImIcterine/apis/raw/branch/main/js/icgl.js" to your JS file

class GLDrawer {
    constructor(canvas) {
        this.gl = canvas.getContext("webgl")

        if (!this.gl) {
            throw new Error("WebGL not supported")
        }

        const vertexShaderSource = `
            attribute vec2 a_position;

            void main() {
                gl_Position = vec4(a_position, 0.0, 1.0);
            }
        `

        const fragmentShaderSource = `
            precision mediump float;

            uniform vec4 u_color;

            void main() {
                gl_FragColor = u_color;
            }
        `

        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource)
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource)

        this.program = this.createProgram(vertexShader, fragmentShader)

        this.positionLocation = this.gl.getAttribLocation(this.program, "a_position")

        this.colorLocation = this.gl.getUniformLocation(this.program, "u_color")

        this.buffer = this.gl.createBuffer()
    }

    createShader(type, source) {

        const shader = this.gl.createShader(type)

        this.gl.shaderSource(shader, source)
        this.gl.compileShader(shader)

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            throw new Error(this.gl.getShaderInfoLog(shader))
        }

        return shader
    }

    createProgram(vertexShader, fragmentShader) {

        const program = this.gl.createProgram()

        this.gl.attachShader(program, vertexShader)
        this.gl.attachShader(program, fragmentShader)

        this.gl.linkProgram(program)

        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            throw new Error(this.gl.getProgramInfoLog(program))
        }

        return program
    }

    clear(r, g, b, a) {

        const gl = this.gl

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

        gl.clearColor(r, g, b, a)
        gl.clear(gl.COLOR_BUFFER_BIT)
    }

    draw(vertices, mode, color) {

        const gl = this.gl

        gl.useProgram(this.program)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

        gl.enableVertexAttribArray(this.positionLocation)

        gl.vertexAttribPointer(
            this.positionLocation,
            2,
            gl.FLOAT,
            false,
            0,
            0
        )

        gl.uniform4fv(this.colorLocation, color)

        gl.drawArrays(mode, 0, vertices.length / 2)
    }

    drawLine(x1, y1, x2, y2, color) {

        this.draw(
            [
                x1, y1,
                x2, y2
            ],
            this.gl.LINES,
            color
        )
    }

    drawTriangle(x1, y1, x2, y2, x3, y3, color) {

        this.draw(
            [
                x1, y1,
                x2, y2,
                x3, y3
            ],
            this.gl.TRIANGLES,
            color
        )
    }

    drawRect(x, y, w, h, color) {

        const x2 = x + w
        const y2 = y + h

        this.draw(
            [
                x,  y,
                x2, y,
                x,  y2,

                x,  y2,
                x2, y,
                x2, y2
            ],
            this.gl.TRIANGLES,
            color
        )
    }
}

function toGLColors(hex = "", alpha = 0) {
    if (hex.length > 6) {
        hex = hex.slice(0, 6)
    }
    if (hex.letters < 6) {
        hex = hex.padEnd(6, "0")
    }

    return [
        parseInt(hex.slice(0, 2), 16),
        parseInt(hex.slice(2, 4), 16),
        parseInt(hex.slice(4, 6), 16),
        alpha
    ]
}
