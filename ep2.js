
var gl;
var canvas;
var program;


//Vertices dos objetos 
var verticesCubo = [];

var colors = [1.0, 1.0, 1.0, 1.0];
const white = [1.0, 1.0, 1.0, 1.0];
const  black = [0.0, 0.0, 0.0, 1.0];
const gray = [0.5, 0.5, 0.5, 1.0];

//Contamos o numero de frames ate termos uma jogada
const NUMERO_DE_FRAMES_ATE_ATUALIZAR = 10; 




var near = 1.0;
var far = 100;
var radius = 4.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;


var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

var left = -5.0;
var right = 5.0;
var ytop = 2.5;
var bottom = -2.5;

var modelMatrix, viewMatrix, projectionMatrix;

var  parameters = {
    screenWidth: 0,
    screenHeight: 0
};

window.onload = function init()
{

    /* 
        Inicializamos o canvas 
    */
    canvas = document.getElementById( "gl-canvas" );

    aspect =  canvas.width/canvas.height;

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    gl.viewportWidth = canvas.width;
    gl.viewportHeight = canvas.height;


    // se redimensionarmos a janela o canvas se altera automaticamente
    onWindowResize();
    window.addEventListener( 'resize', onWindowResize, false );


    gl.viewport( 0, 0, gl.viewportWidth, gl.viewportHeight );

    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    
    //
    //  Load shaders 
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    program.vertexPositionAttribute = gl.vertexPositionAttribute = 
                                                gl.getAttribLocation(program, "vPosition");
    gl.enableVertexAttribArray(program.vertexPositionAttribute);

    /* 
        Inicializa Buffers e pega os vertices 
        dos arquivos .obj
    */


    /* TABULEIRO */

    //cubo inicial
    vertIniciais = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    cube(vertIniciais[0], vertIniciais[1], vertIniciais[2], vertIniciais[3],
            vertIniciais[4], vertIniciais[5], vertIniciais[6], vertIniciais[7]);

    tabuleiroPositionBufffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tabuleiroPositionBufffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesCubo), gl.STATIC_DRAW);


    //Pega a localizacao das matrizes de model, view e projection
    program.modelMatrix = gl.getUniformLocation( program, "modelMatrix" );
    program.viewMatrix= gl.getUniformLocation(program, "viewMatrix");
    program.projectionMatrix = gl.getUniformLocation( program, "projectionMatrix" );



       
    render();
 
}

function render()
{

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    aspect = gl.viewportWidth / gl.viewportHeight;
    
    var eye = vec3( radius*Math.sin(theta)*Math.cos(phi), 
                    radius*Math.sin(theta)*Math.sin(phi),
                    radius*Math.cos(theta));
    
    modelMatrix = identityMatrix();
    viewMatrix = lookAt( eye, at, up );
    //viewMatrix = identityMatrix();
    //projectionMatrix = identityMatrix();

    projectionMatrix = perspective(fovy, aspect, near, far);
    
    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);



    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );

    console.log("vou desenhar");

    mPushMatrix();
    

    gl.bindBuffer(gl.ARRAY_BUFFER, tabuleiroPositionBufffer);
    gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix);
            

    gl.drawArrays(gl.TRIANGLES, 0, verticesCubo.length/3);
    mPopMatrix();

}

// _______________________________________-

function tick(){
    requestAnimFrame(tick);
    render();
    animar();
}

function setMatrixUniforms(modelMatrix, viewMatrix, projectionMatrix){
    gl.uniformMatrix4fv( program.modelMatrix, false, flatten(modelMatrix) );
    gl.uniformMatrix4fv( program.viewMatrix, false, flatten(viewMatrix) );
    gl.uniformMatrix4fv( program.projectionMatrix, false, flatten(projectionMatrix) );
}

var ultimo = 0;
var rSphere = 1.0;
function animar()
{
    var agora = new Date().getTime();
    if(ultimo != 0)
    {
        var diferenca = agora - ultimo;
        rSphere += ((75 * diferenca) /100/NUMERO_DE_FRAMES_ATE_ATUALIZAR) % 360.0;
    }
    ultimo = agora;
}

/*function cube(a, b, c, d, e, f, g, h)
{
    quad(a, b, c, d);
    quad(b, f, g, c);
    quad(f, e, h, g);
    quad(e, a, d, h);
    quad(d, c, g, h);
    quad(a, b, f, e);

}*/

function cube(a, b, c, d, e, f, g, h)
{
    quad( b, a, d, c );
    quad( c, d, h, g );
    quad( d, a, e, h );
    quad( g, f, b, c );
    quad( e, f, g, h );
    quad( f, e, a, b );
}
function quad(a, b, c, d)
{
    divideTriangle(a, b, c);
    divideTriangle(a, c, d);
}

function divideTriangle(a, b, c)
{
    /*console.log("a: " + a);
    console.log("b: " + b);
    console.log("c: " + c);*/

    verticesCubo.push(a[0]);
    verticesCubo.push(a[1]);
    verticesCubo.push(a[2]);
    verticesCubo.push(b[0]);
    verticesCubo.push(b[1]);
    verticesCubo.push(b[2]);
    verticesCubo.push(c[0]);
    verticesCubo.push(c[1]);
    verticesCubo.push(c[2]);
}


// Caso a janela seja redimensionada, atualizamos o canvas
// para manter o mesmo aspecto na janela 
function onWindowResize( event ) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  parameters.screenWidth = canvas.width;
  parameters.screenHeight = canvas.height;

  gl.viewportWidth = canvas.width;
  gl.viewportHeight = canvas.height;
}