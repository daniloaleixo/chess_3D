
var gl;
var canvas;
var program;

var fColorLoc;

//Vertices dos objetos 
var bispoOBJ, cavaloOBJ, peaoOBJ, rainhaOBJ, reiOBJ, torreOBJ;
var verticesCubo = [];

var colors = [1.0, 1.0, 1.0, 1.0];
const white = [1.0, 1.0, 1.0, 1.0];
const  black = [0.0, 0.0, 0.0, 1.0];
const gray = [0.5, 0.5, 0.5, 1.0];

//Contamos o numero de frames ate termos uma jogada
const NUMERO_DE_FRAMES_ATE_ATUALIZAR = 10; 

var global_jogada = 0;

var contadorDeFrames = 0;
var contadorDeFramesLocal = 0;

var jogoPausado = false;

var bispoPositionBuffer, cavaloPositionBuffer, peaoPositionBuffer, 
        rainhaPositionBuffer, reiPositionBuffer, torrePositionBuffer, tabuleiroPositionBufffer;


//variavel para saber se as peças estao em jogo 
var torreBranca1aparece = 1, torreBranca2aparece = 1, torrePreta1aparece = 1, torrePreta2aparece = 1,
        cavaloBranco1aparece = 1, cavaloBranco2aparece = 1, cavaloPreto1aparece = 1, cavaloPreto2aparece = 1,
        bispoBranco1aparece = 1, bispoBranco2aparece = 1, bispoPreto1aparece = 1, bispoPreto2aparece = 1,
        reiBrancoAparece = 1, reiPretoAparece = 1, rainhaBrancaAparece = 1, rainhaPretaAparece = 1,
        peoesBrancosAparece = [], peoesPretosAparece = [];
        for(i = 0; i < 8; i++) 
        {
            peoesBrancosAparece[i] = 1; peoesPretosAparece[i] = 1;
        }

/* variaveis de posiçoes das peças*/
var torreBranca1, torreBranca2, torrePreta1, torrePreta2, cavaloBranco1, cavaloBranco2, 
        cavaloPreto1, cavaloPreto2, bispoBranco1, bispoBranco2, bispoPreto1, bispoPreto2,
        reiBranco, reiPreto, rainhaBranca, rainhaPreta,
        peoesBrancos =[],
        peoesPretos = [];



var comentariosPGN;
var PGN;
var filePGN = "teste.pgn";

const nearInicialP = 1.0;
const radiusInicialP = 8.0;
const thetaInicialP = 4.0;
const phiInicialP = 5.0;

const nearInicialO = -100.0;



var near = -100.0;
var far = 100;
var radius = 1.0;
var theta  = 4.0;
var phi    = 5.0;
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
var modelMatrixLoc, viewMatrixLoc, projectionMatrixLoc;
var modelMatrixPilha = [];

var projecaoPerspectivaFlag = false; // 0 no caso de perspectiva 
                //   1 no caso de ortogonal 

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

    /* TORRE */
    torreOBJ = readUrl("pecas/torre.obj");

    torrePositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, torrePositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(torreOBJ), gl.STATIC_DRAW);

    /* CAVALO */
    cavaloOBJ = readUrl("pecas/cavalo.obj");

    cavaloPositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cavaloPositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(cavaloOBJ), gl.STATIC_DRAW);

    /* BISPO */
    bispoOBJ = readUrl("pecas/bispo.obj");

    bispoPositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bispoPositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(bispoOBJ), gl.STATIC_DRAW);

    /* REI */
    reiOBJ = readUrl("pecas/rei.obj");

    reiPositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, reiPositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(reiOBJ), gl.STATIC_DRAW);

    /* RAINHA */
    rainhaOBJ = readUrl("pecas/rainha.obj");

    rainhaPositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, rainhaPositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(rainhaOBJ), gl.STATIC_DRAW);

    /* PEAO */
    peaoOBJ = readUrl("pecas/peao.obj");

    peaoPositionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, peaoPositionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(peaoOBJ), gl.STATIC_DRAW);


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

    //pega a localizacao de fColor
    fColorLoc = gl.getUniformLocation(program, "fColor");

    //Pega a localizacao das matrizes de model, view e projection
    modelMatrixLoc = gl.getUniformLocation( program, "modelMatrix" );
    viewMatrixLoc = gl.getUniformLocation(program, "viewMatrix");
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );


    // Le o arquivo PGN

    comentariosPGN = comentariosPGN(filePGN);
    PGN = interpretaPGN(filePGN);

    //DEPURAÇAO console.log(">>>>comentarios: " + comentariosPGN);
    //DEPURACAO console.log(PGN);

    definePosicoesIniciais();

    //Interpreta botoes
    document.getElementById("Button1").onclick = function(){ jogoPausado = !jogoPausado; }
    document.getElementById("Button2").onclick = function(){ trocarProjecoes(); }



       
    tick();
 
}

function render()
{
    contadorDeFrames++;

    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    aspect = gl.viewportWidth / gl.viewportHeight;
    
    var eye = vec3( radius*Math.sin(theta)*Math.cos(phi), 
                    radius*Math.sin(theta)*Math.sin(phi),
                    radius*Math.cos(theta));
    
    modelMatrix = identityMatrix();
    viewMatrix = lookAt( eye, at, up );

    console.log(projecaoPerspectivaFlag);
    if(projecaoPerspectivaFlag)
    {
        projectionMatrix = perspective(fovy, aspect, near, far);
    } else {
        projectionMatrix = ortho(left, right, bottom, ytop, near, far);
    }
    
    setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);

    gl.clearColor( 0.2, 0.2, 0.2, 1.0 );



    //desenhaTabuleiro();


    desenhaPeças();


    if(global_jogada < PGN.length && jogoPausado == false)
    {
        atualizaPosicoes();
    }
}

// _______________________________________-


function trocarProjecoes()
{
    projecaoPerspectivaFlag = !projecaoPerspectivaFlag;
    if(projecaoPerspectivaFlag)
    {
        radius = radiusInicialP;
        theta = thetaInicialP;
        phi = phiInicialP;
        near = nearInicialP;
    } else {
        near = nearInicialO;
    }
}


// A funcao atualiza a posicao das pecas que estao em jogo, primeiro lendo o PGN e 
// executando a jogada descrita
function atualizaPosicoes()
{
    if(contadorDeFrames % NUMERO_DE_FRAMES_ATE_ATUALIZAR == 0)
    {
        var coordXInicial, coordYInicial,
            coordXFinal, coordYFinal, flag, comeu;


        //
        //Movimento das peças brancas 
        //
        if(contadorDeFramesLocal % 2 == 0)
        {

            //os castling nao precisamos das variaveis x e y, inicial e final
            flag = PGN[global_jogada][0];

            // Por isso testamos sempre pra saber se temos um castling
            if(flag < 7)
            {
                //transformamos as letras em coordenadas numericas e pegamos a flag, para sabermos qual peça
                // sera deslocada
                coordXInicial = PGN[global_jogada][1].charCodeAt(0) - "a".charCodeAt(0) + 1;
                coordYInicial = parseInt(PGN[global_jogada][1][1]);
                coordXFinal = PGN[global_jogada][1].charCodeAt(3) - "a".charCodeAt(0) + 1;
                coordYFinal = parseInt(PGN[global_jogada][1][4]);
                if(PGN[global_jogada][1][2] == "-") comeu = false;
                else 
                {
                  comeu = true;
                  // DEPURACAO console.log("comeu: " + comeu);
                }
            }

            // DEPURAÇAO  console.log("x0, y0: " + coordXInicial + ", " + coordYInicial + ", x, y: " + coordXFinal + ", " + coordYFinal);

            //o parametro 0 e enviado para a funcao quando a movimentacao e de pecas brancas 
            procuraPecaEAtualizaPosicao(coordXInicial, coordYInicial, coordXFinal, coordYFinal, flag, 0, comeu);

            contadorDeFramesLocal++;

        } else { //
                //Movimentacao das pecas pretas 
                //

            //os castling nao precisamos das variaveis x e y, inicial e final
            flag = PGN[global_jogada][2];
            // Por isso testamos sempre pra saber se temos um castling
            if(flag < 7)
            {
                //transformamos as letras em coordenadas numericas e pegamos a flag, para sabermos qual peça
                // sera deslocada
                coordXInicial = PGN[global_jogada][3].charCodeAt(0) - "a".charCodeAt(0) + 1;
                coordYInicial = parseInt(PGN[global_jogada][3][1]);
                coordXFinal = PGN[global_jogada][3].charCodeAt(3) - "a".charCodeAt(0) + 1;
                coordYFinal = parseInt(PGN[global_jogada][3][4]);
                // DEPURACAO console.log(" era pra ser um x: " + PGN[global_jogada][3][2]);
                if(PGN[global_jogada][3][2] == "-") comeu = false;
                else 
                {
                  comeu = true;
                  // DEPURACAO console.log("comeu: " + comeu);
                }

            }

            // DEPURAÇAO   console.log("x0, y0: " + coordXInicial + ", " + coordYInicial + ", x, y: " + coordXFinal + ", " + coordYFinal);

            //o parametro 1 e enviado para a funcao quando a movimentacao e de pecas pretas
            procuraPecaEAtualizaPosicao(coordXInicial, coordYInicial, coordXFinal, coordYFinal, flag, 1, comeu);

            contadorDeFramesLocal++;
            global_jogada++;

        }
    }

}

//A funcao recebe as coordenadas iniciais e finais, alem de uma flag pra saber qual tipo de movimento
// esta sendo realizado:
//K(king) -> 1, Q(queen) -> 2, R(rook) -> 3, B(bishop) -> 4, N(knight) -> 5
//quando nao existe letra maiuscula na frente o movimento e realizado pelo peao
//entao temos a flag 6, ainda temos o caso do kingside castling, representado por
//O-O-O -> 7 e queenside castling O-O -> 8
// temos tambem o parametro i para sabermos se o movimento e de brancos ou pretos e uma outra flag
// comeuF que tem como objetivo saber se alguma peca vai ser comida e portanto fazer a peca comida desaparecer
// com essas informacoes ela procura a peca que se encontra nessa posicao inicial e realiza o movimento
function procuraPecaEAtualizaPosicao(coordXInicial, coordYInicial, coordXFinal, coordYFinal, flag, i, comeuF)
{
    // DEPIURAÇAO console.log("Coord iniciais1: " + coordXInicial + ", " + coordYInicial);

    // se nao for castling passamos as coordenadas enviadas que estao na forma
    // de inteiros para as coordenadas usadas no mundo
    if(flag < 7)
    {
        //Passamos para o sistema de coordenadas do mundo 
        coordXInicial = coordXInicial * 0.6 - 3.0;
        coordYInicial = coordYInicial * 0.6 - 3.0;
        coordXFinal = coordXFinal * 0.6 - 3.0;
        coordYFinal = coordYFinal * 0.6 - 3.0;
    }

    //DEPURAÇAO console.log("Coord iniciais2: " + coordXInicial + ", " + coordYInicial);


    if(i == 0) //Peças Brancas
    {
        // DEPURAÇAO console.log("peças brancas");
        switch(flag)
        {
            // rei branco
            case 1:
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                reiBranco[0] = coordXFinal;
                reiBranco[1] = coordYFinal; 
                break;
            //rainha branca
            case 2:
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                rainhaBranca[0] = coordXFinal;
                rainhaBranca[1] = coordYFinal;
            // torres brancas
            case 3:
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                if(torreBranca1[0] > (coordXInicial - 0.1) && torreBranca1[0] < (coordXInicial + 0.1)  
                            && torreBranca1[1] > (coordYInicial - 0.1) && torreBranca1[1] < (coordYInicial + 0.1) )
                {
                    torreBranca1[0] = coordXFinal;
                    torreBranca1[1] = coordYFinal;
                } else {
                    torreBranca2[0] = coordXFinal;
                    torreBranca2[1] = coordYFinal;
                } break;
            //bispos brancos 
            case 4:
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                if(bispoBranco1[0] > (coordXInicial - 0.1) && bispoBranco1[0] < (coordXInicial + 0.1)  
                            && bispoBranco1[1] > (coordYInicial - 0.1) && bispoBranco1[1] < (coordYInicial + 0.1) )
                {
                    bispoBranco1[0] = coordXFinal;
                    bispoBranco1[1] = coordYFinal;
                } else {
                    bispoBranco2[0] = coordXFinal;
                    bispoBranco2[1] = coordYFinal;
                } break;
            //cavalos brancos
            case 5:
                // DEPURACAO console.log("cavalos iniciais: " + cavaloBranco1)
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                if(cavaloBranco1[0] > (coordXInicial - 0.1) && cavaloBranco1[0] < (coordXInicial + 0.1)  
                            && cavaloBranco1[1] > (coordYInicial - 0.1) && cavaloBranco1[1] < (coordYInicial + 0.1) )
                {
                    cavaloBranco1[0] = coordXFinal;
                    cavaloBranco1[1] = coordYFinal;
                } else {
                    cavaloBranco2[0] = coordXFinal;
                    cavaloBranco2[1] = coordYFinal;
                } break;
            case 6:
                //console.log("peoesBrancos");
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                for(j = 0; j < 8; j++)
                {
                    // DEPURAÇAO console.log("coord peao: " + peoesBrancos[j][0] + " " + peoesBrancos[j][1]);

                    if(peoesBrancos[j][0] > (coordXInicial - 0.1) && peoesBrancos[j][0] < (coordXInicial + 0.1)  
                            && peoesBrancos[j][1] > (coordYInicial - 0.1) && peoesBrancos[j][1] < (coordYInicial + 0.1) )
                    {
                        //console.log("coordenadas antigas do peao :" + peoesBrancos[j][0] + ", " + peoesBrancos[j][1]);
                        peoesBrancos[j][0] = coordXFinal;
                        peoesBrancos[j][1] = coordYFinal;
                        //console.log("coordenadas novas do peao :" + peoesBrancos[j][0] + ", " + peoesBrancos[j][1]); 
                        break;
                    } 
                } break;
            //kingside castling
            case 7:
                 torreBranca2[0] = 0.6;
                 torreBranca2[1] = -2.4;
                 reiBranco[0] = 1.2;
                 reiBranco[1] = -2.4;
                 break;
            //queenside castling
            case 8:
                torreBranca1[0] = -0.6;
                torreBranca1[1] = -2.4;
                reiBranco[0] = -1.2;
                reiBranco[1] = -2.4;
                break;
        }
    } else //Peças pretas
    {
        switch(flag)
        {
            // rei preto
            case 1:
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                reiPreto[0] = coordXFinal;
                reiPreto[1] = coordYFinal; 
                break;
            // rainha preta
            case 2:
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                rainhaPreta[0] = coordXFinal;
                rainhaPreta[1] = coordYFinal;
                break;
            //torres pretas
            case 3:
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                if(torrePreta1[0] > (coordXInicial - 0.1) && torrePreta1[0] < (coordXInicial + 0.1)  
                            && torrePreta1[1] > (coordYInicial - 0.1) && torrePreta1[1] < (coordYInicial + 0.1) )
                {
                    torrePreta1[0] = coordXFinal;
                    torrePreta1[1] = coordYFinal;
                } else {
                    torrePreta2[0] = coordXFinal;
                    torrePreta2[1] = coordYFinal;
                } break;
            //bispos pretos 
            case 4:
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                if(bispoPreto1[0] > (coordXInicial - 0.1) && bispoPreto1[0] < (coordXInicial + 0.1)  
                            && bispoPreto1[1] > (coordYInicial - 0.1) && bispoPreto1[1] < (coordYInicial + 0.1) )
                {
                    bispoPreto1[0] = coordXFinal;
                    bispoPreto1[1] = coordYFinal;
                } else {
                    bispoPreto2[0] = coordXFinal;
                    bispoPreto2[1] = coordYFinal;
                } break;
            //cavalos pretos
            case 5:
                // DEPURACAO console.log("cavalos iniciais: " + cavaloPreto1)
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                if(cavaloPreto1[0] > (coordXInicial - 0.1) && cavaloPreto1[0] < (coordXInicial + 0.1)  
                            && cavaloPreto1[1] > (coordYInicial - 0.1) && cavaloPreto1[1] < (coordYInicial + 0.1) )
                {
                    cavaloPreto1[0] = coordXFinal;
                    cavaloPreto1[1] = coordYFinal;
                } else {
                    cavaloPreto2[0] = coordXFinal;
                    cavaloPreto2[1] = coordYFinal;
                } break;
            //peoes pretos
            case 6:
                // DEPURACAO console.log("peoesPretos");
                if(comeuF == true) comeu(coordXFinal, coordYFinal, i);
                // DEPURACAO console.log("comeu " + comeuF);
                for(j = 0; j < 8; j++)
                {
                    // DEPURAÇAO console.log("coord peao: " + peoesPretos[j][0] + " " + peoesPretos[j][1]);

                    if(peoesPretos[j][0] > (coordXInicial - 0.1) && peoesPretos[j][0] < (coordXInicial + 0.1)  
                            && peoesPretos[j][1] > (coordYInicial - 0.1) && peoesPretos[j][1] < (coordYInicial + 0.1) )
                    {
                        // DEPURAÇAO console.log("coordenadas antigas do peao :" + peoesPretos[j][0] + ", " + peoesPretos[j][1]);
                        peoesPretos[j][0] = coordXFinal;
                        peoesPretos[j][1] = coordYFinal;
                        // DEPURAÇAO console.log("coordenadas novas do peao :" + peoesPretos[j][0] + ", " + peoesPretos[j][1]); 
                        break;
                    } 
                } break;
            //kingside castling
            case 7:
                torrePreta1[0] = -1.2;
                torrePreta1[1] = 1.8;
                reiPreto[0] = -1.8;
                reiPreto[1] = 1.8;
                break;
            //queenside castling
            case 8:
                torrePreta2[0] = 0.0;
                torrePreta2[1] = 1.8;
                reiPreto[0] = 0.6;
                reiPreto[1] = 1.8;
                break;
        }
    }
    
}

// A funcao tem como objetivo fazer a peca comida desaparecer, para isso
// a funcao percorre as pecas do jogo para saber qual delas morre
function comeu(coordX, coordY, i)
{
    //peça preta morre
    if(i == 0){

        //rainha
        if(rainhaPreta[0] > (coordX - 0.1) && rainhaPreta[0] < (coordX + 0.1)  
                        && rainhaPreta[1] > (coordY - 0.1) && rainhaPreta[1] < (coordY + 0.1) )
        {
            rainhaPretaAparece = 0; 
        }

        //torres
        else if(torrePreta1[0] > (coordX - 0.1) && torrePreta1[0] < (coordX + 0.1)  
                        && torrePreta1[1] > (coordY - 0.1) && torrePreta1[1] < (coordY + 0.1) )
        {
            torrePreta1aparece = 0; 
        } 
        else if(torrePreta2[0] > (coordX - 0.1) && torrePreta2[0] < (coordX + 0.1)  
                        && torrePreta2[1] > (coordY - 0.1) && torrePreta2[1] < (coordY + 0.1) )
        {
            torrePreta2aparece = 0; 
        }

        //bispos
        else if(bispoPreto1[0] > (coordX - 0.1) && bispoPreto1[0] < (coordX + 0.1)  
                        && bispoPreto1[1] > (coordY - 0.1) && bispoPreto1[1] < (coordY + 0.1) )
        {
            bispoPreto1aparece = 0; 
        } 
        else if(bispoPreto2[0] > (coordX - 0.1) && bispoPreto2[0] < (coordX + 0.1)  
                        && bispoPreto2[1] > (coordY - 0.1) && bispoPreto2[1] < (coordY + 0.1) )
        {
            bispoPreto2aparece = 0; 
        } 

        //cavalos
        else if(cavaloPreto1[0] > (coordX - 0.1) && cavaloPreto1[0] < (coordX + 0.1)  
                        && cavaloPreto1[1] > (coordY - 0.1) && cavaloPreto1[1] < (coordY + 0.1) )
        {
            cavaloPreto1aparece = 0; 
        } 
        else if(cavaloPreto2[0] > (coordX - 0.1) && cavaloPreto2[0] < (coordX + 0.1)  
                        && cavaloPreto2[1] > (coordY - 0.1) && cavaloPreto2[1] < (coordY + 0.1) )
        {
            cavaloPreto2aparece = 0; 
        } 

        //peoes
        else {
            for(i = 0; i < 8; i++)
            {
                if(peoesPretos[i][0] > (coordX - 0.1) && peoesPretos[i][0] < (coordX + 0.1)  
                        && peoesPretos[i][1] > (coordY - 0.1) && peoesPretos[i][1] < (coordY + 0.1) )
                {
                    peoesPretosAparece[i] = 0; 
                }
            }
        }



    }
    //peça branca morre
    else
    {
        //rainha
        if(rainhaBranca[0] > (coordX - 0.1) && rainhaBranca[0] < (coordX + 0.1)  
                        && rainhaBranca[1] > (coordY - 0.1) && rainhaBranca[1] < (coordY + 0.1) )
        {
            rainhaBrancaAparece = 0; 
        }

        //torres
        else if(torreBranca1[0] > (coordX - 0.1) && torreBranca1[0] < (coordX + 0.1)  
                        && torreBranca1[1] > (coordY - 0.1) && torreBranca1[1] < (coordY + 0.1) )
        {
            torreBranca1aparece = 0; 
        } 
        else if(torreBranca2[0] > (coordX - 0.1) && torreBranca2[0] < (coordX + 0.1)  
                        && torreBranca2[1] > (coordY - 0.1) && torreBranca2[1] < (coordY + 0.1) )
        {
            torreBranca2aparece = 0; 
        }

        //bispos
        else if(bispoBranco1[0] > (coordX - 0.1) && bispoBranco1[0] < (coordX + 0.1)  
                        && bispoBranco1[1] > (coordY - 0.1) && bispoBranco1[1] < (coordY + 0.1) )
        {
            bispoBranco1aparece = 0; 
        } 
        else if(bispoBranco2[0] > (coordX - 0.1) && bispoBranco2[0] < (coordX + 0.1)  
                        && bispoBranco2[1] > (coordY - 0.1) && bispoBranco2[1] < (coordY + 0.1) )
        {
            bispoBranco2aparece = 0; 
        } 

        //cavalos
        else if(cavaloBranco1[0] > (coordX - 0.1) && cavaloBranco1[0] < (coordX + 0.1)  
                        && cavaloBranco1[1] > (coordY - 0.1) && cavaloBranco1[1] < (coordY + 0.1) )
        {
            cavaloBranco1aparece = 0; 
        } 
        else if(cavaloBranco2[0] > (coordX - 0.1) && cavaloBranco2[0] < (coordX + 0.1)  
                        && cavaloBranco2[1] > (coordY - 0.1) && cavaloBranco2[1] < (coordY + 0.1) )
        {
            cavaloBranco2aparece = 0; 
        } 

        //peoes
        else {
            for(i = 0; i < 8; i++)
            {
                if(peoesBrancos[i][0] > (coordX - 0.1) && peoesBrancos[i][0] < (coordX + 0.1)  
                        && peoesBrancos[i][1] > (coordY - 0.1) && peoesBrancos[i][1] < (coordY + 0.1) )
                {
                    peoesBrancosAparece[i] = 0; 
                }
            }
        }
    }
}



function definePosicoesIniciais()
{
    var cont = 0;
    torreBranca1 = [-2.4, -2.4];
    cavaloBranco1 = [-1.8, -2.4];
    bispoBranco1 = [-1.2, -2.4];
    rainhaBranca = [-0.6, -2.4];
    reiBranco = [0.0, -2.4];
    bispoBranco2 = [0.6, -2.4];
    cavaloBranco2 = [1.2, -2.4];
    torreBranca2 = [1.8, -2.4];

    for(var i = -2.4; i < 2.4; i+= 0.6)
    {
        peoesBrancos[cont++] = [i, -1.8];
    }

    torrePreta1 = [-2.4, 1.8];
    cavaloPreto1 = [-1.8, 1.8];
    bispoPreto1 = [-1.2, 1.8];
    reiPreto = [-0.6, 1.8];
    rainhaPreta = [0.0, 1.8];
    bispoPreto2 = [0.6, 1.8];
    cavaloPreto2 = [1.2, 1.8];
    torrePreta2 = [1.8, 1.8];

    cont=0;
    for(var i = -2.4; i < 2.4; i+= 0.6)
    {
        peoesPretos[cont++] = [i, 1.2];
    }

}

function tick(){
    requestAnimFrame(tick);
    render();
    animar();
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


function desenhaTabuleiro()
{
    var cont = 0;


    // Rodamos todas as casas do tabuleiro e colocamos um cubo em cada casa

    for(var i = -2.4; i < 2.4; i+= 0.6)
    {
        for(var j = -2.4; j < 2.4; j+= 0.6)
        {
            mPushMatrix();
            //modelMatrix = multiplica( matrix4Translate(0.0, -0.6, 0.0),
                                     //multiplica( matrix4Scale(0.6, 0.6, 0.6), matrix4Translate(i, 0.0, j) ) );

            modelMatrix = matrix4Translate(i, -0.6, j);
            gl.bindBuffer(gl.ARRAY_BUFFER, tabuleiroPositionBufffer);
            gl.vertexAttribPointer(program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
            setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
            
            if(cont % 2 == 0) gl.uniform4fv(fColorLoc, white); 
            else gl.uniform4fv(fColorLoc, black);

            gl.drawArrays(gl.TRIANGLES, 0, verticesCubo.length/3);
            mPopMatrix();
            cont++;
        }
        cont++;
    }
}

function desenhaPeças()
{

    /*

        DESENHA AS PEÇAS
    */

    // PEÇAS BRANCAS 

    gl.uniform4fv(fColorLoc, [0.9, 0.9, 0.0, 0.8]);

    // torre branca 1

    if(torreBranca1aparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate( torreBranca1[0] , 0.0, torreBranca1[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, torrePositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, torreOBJ.length/3); 

        mPopMatrix();

    }

    // cavalo branco 1 
    if(cavaloBranco1aparece == 1)
    {
        mPushMatrix();
        modelMatrix = multiplica(matrix4Translate(cavaloBranco1[0], 0.0, cavaloBranco1[1]), matrix4Rotate(90, [0, 1,0]));

        gl.bindBuffer( gl.ARRAY_BUFFER, cavaloPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, cavaloOBJ.length/3); 

        mPopMatrix();
    }

    // bispo branco 1 
    if(bispoBranco1aparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate( bispoBranco1[0], 0.0, bispoBranco1[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, bispoPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, bispoOBJ.length/3); 

        mPopMatrix();
    }


    // rainha branca 
    if(rainhaBrancaAparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate(rainhaBranca[0], 0.0, rainhaBranca[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, rainhaPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, rainhaOBJ.length/3); 

        mPopMatrix();
    }

    // rei branco 
    if(reiBrancoAparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate(reiBranco[0], 0.0,reiBranco[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, reiPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, reiOBJ.length/3); 
        mPopMatrix();

    }

    // bispo branco 2 
    if(bispoBranco2aparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate( bispoBranco2[0], 0.0, bispoBranco2[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, bispoPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, bispoOBJ.length/3); 
        mPopMatrix();
    }

    // cavalo branco 2 
    if(cavaloBranco2aparece == 1)
    {
        mPushMatrix();
        modelMatrix = multiplica(matrix4Translate( cavaloBranco2[0], 0.0, cavaloBranco2[1]), matrix4Rotate(90, [0, 1,0]));

        gl.bindBuffer( gl.ARRAY_BUFFER, cavaloPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, cavaloOBJ.length/3); 
        mPopMatrix();
    }

    // torre branca 2
    if(torreBranca2aparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate( torreBranca2[0], 0.0, torreBranca2[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, torrePositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );


        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, torreOBJ.length/3); 
        mPopMatrix();
    }


    // PEOES BRANCOS
    for(var i = 0; i < 8; i++)
    {
        if(peoesBrancosAparece[i] == 1)
        {
            mPushMatrix();
            modelMatrix = matrix4Translate(peoesBrancos[i][0] , 0.0, peoesBrancos[i][1]);

            gl.bindBuffer( gl.ARRAY_BUFFER, peaoPositionBuffer );
            gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

            setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
            
            gl.drawArrays( gl.LINE_STRIP, 0, peaoOBJ.length/3);
            mPopMatrix();  
        }

    }

    //  PEÇAS PRETAS 


    gl.uniform4fv(fColorLoc, [0.0, 0.1, 0.9, 1.0]); 

    // torre preta 1
    if(torrePreta1aparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate( torrePreta1[0], 0.0, torrePreta1[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, torrePositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, torreOBJ.length/3); 

        mPopMatrix();
    }

    // cavalo preto 1 
    if(cavaloPreto1aparece == 1)
    {
        mPushMatrix();
        modelMatrix = multiplica(matrix4Translate(cavaloPreto1[0], 0.0, cavaloPreto1[1]), matrix4Rotate(-90, [0, 1,0]));

        gl.bindBuffer( gl.ARRAY_BUFFER, cavaloPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, cavaloOBJ.length/3); 

        mPopMatrix();
    }

    // bispo preto 1 
    if(bispoPreto1aparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate( bispoPreto1[0], 0.0, bispoPreto1[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, bispoPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, bispoOBJ.length/3); 

        mPopMatrix();
    }

    // rei preto 
    if(reiPretoAparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate(reiPreto[0], 0.0,reiPreto[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, reiPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.TRIANGLES, 0, reiOBJ.length/3); 
        mPopMatrix();

    }

    // rainha preta 
    if(rainhaPretaAparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate(rainhaPreta[0], 0.0, rainhaPreta[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, rainhaPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, rainhaOBJ.length/3); 

        mPopMatrix();
    }

    // bispo preto 2 
    if(bispoPreto2aparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate( bispoPreto2[0], 0.0, bispoPreto2[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, bispoPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, bispoOBJ.length/3); 
        mPopMatrix();
    }

    //cavalo preto 2 
    if(cavaloPreto2aparece == 1)
    {
        mPushMatrix();
        modelMatrix = multiplica(matrix4Translate( cavaloPreto2[0], 0.0, cavaloPreto2[1]), matrix4Rotate(-90, [0, 1,0]));

        gl.bindBuffer( gl.ARRAY_BUFFER, cavaloPositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, cavaloOBJ.length/3); 
        mPopMatrix();
    }

    // torre preto 2 
    if(torrePreta2aparece == 1)
    {
        mPushMatrix();
        modelMatrix = matrix4Translate( torrePreta2[0], 0.0, torrePreta2[1]);

        gl.bindBuffer( gl.ARRAY_BUFFER, torrePositionBuffer );
        gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );


        setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
        
        gl.drawArrays( gl.LINE_STRIP, 0, torreOBJ.length/3); 
        mPopMatrix();
    }


    // PEOES PRETOS
    for(var i = 0; i < 8; i++)
    {
        if(peoesPretosAparece[i] == 1)
        {
            mPushMatrix();
            modelMatrix = matrix4Translate(peoesPretos[i][0], 0.0, peoesPretos[i][1]);

            gl.bindBuffer( gl.ARRAY_BUFFER, peaoPositionBuffer );
            gl.vertexAttribPointer( program.vertexPositionAttribute, 3,  gl.FLOAT, false, 0, 0 );

            setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc);
            
            gl.drawArrays( gl.LINE_STRIP, 0, peaoOBJ.length/3);
            mPopMatrix();  
        }

    }
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