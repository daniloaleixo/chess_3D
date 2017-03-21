
/* A função transforma o .obj em uma String que e retornada pela funçao */
function getString(file) {
    var xmlHttp = new XMLHttpRequest(); 
    xmlHttp.open("GET", file, false); 
    xmlHttp.send(null); 
    return xmlHttp.responseText; 
}

//A funcao retorna apenas os comentarios do arquivo 
function comentariosPGN(file)
{
    var linhas = getString(file).split('\n');
    var comentario = "";

    for(i = 0; i < linhas.length; i++)
    {
        if(linhas[i].startsWith('[') && linhas[i] != "")
        {
            comentario += linhas[i];
        }
    }
    return comentario;
}


//A funcao retorna um vetor em que o indice do vetor sao as jogadas correspondentes
// e dentro de cada jogada temos qual o tipo de movimento foi realizado e entre quais
// quadrantes foi o movimento 
function interpretaPGN(file)
{
    var string = getString(file);
    var linhas = string.split('\n');
    var jogadas = [];


    var frase;
    var caracteres;
    var jogadaAtual;
    var textoDasJogadas;

    for(i = 0; i < linhas.length; i++)
    {
        //pegamos somente as jogadas 
        if(!linhas[i].startsWith('[') && !linhas[i].startsWith(' '))
        {
            // DEPURAÇAO console.log("linhas[i] " + linhas[i]);

            //dividimos a string pelas jogadas que sao representadas
            //por um numero seguido de um ponto(.)
            frase = linhas[i].slice(3).split(".");
            // DEPURAÇAO console.log("frase " + frase);

            for(j = 0; j < frase.length; j++)
            {
                //Agora dividimos a string pelos espaços, sobrando apenas
                //o texto que precisamos de cada jogada, como por exemplo
                //e2-e4, d6-d7
                textoDasJogadas = frase[j].split(" ");
                // DEPURAÇAO console.log("texto das Jogadas " + textoDasJogadas);

                if(textoDasJogadas.length > 1)
                {
                    if(textoDasJogadas[0] == "" || textoDasJogadas[0] == " ")
                    {
                        textoDasJogadas = textoDasJogadas.slice(1);
                    } 
                    // DEPUAÇAO console.log(textoDasJogadas);


                    //Agora rodamos dentro de cada jogada e guardamos os movimentos,
                    //Usamos uma flag pra saber quem esta realizando o movimento, entao
                    //K(king) -> 1, Q(queen) -> 2, R(rook) -> 3, B(bishop) -> 4, N(knight) -> 5
                    //quando nao existe letra maiuscula na frente o movimento e realizado pelo peao
                    //entao temos a flag 6, ainda temos o caso do kingside castling, representado por
                    //O-O-O -> 7 e queenside castling O-O -> 8
                    cont = 0;
                    jogadaAtual = [];
                    while(cont < 2)
                    {
                        switch(textoDasJogadas[cont][0])
                        {
                            case 'K':
                                jogadaAtual.push(1);
                                jogadaAtual.push(textoDasJogadas[cont].substring(1));
                                break;
                            case 'Q':
                                jogadaAtual.push(2);
                                jogadaAtual.push(textoDasJogadas[cont].substring(1));
                                break;
                            case 'R':
                                jogadaAtual.push(3);
                                jogadaAtual.push(textoDasJogadas[cont].substring(1));
                                break;
                            case 'B':
                                jogadaAtual.push(4);
                                jogadaAtual.push(textoDasJogadas[cont].substring(1));
                                break;
                            case 'N':
                                jogadaAtual.push(5);
                                jogadaAtual.push(textoDasJogadas[cont].substring(1));
                                break;
                            case 'O':
                                //queenside castling
                                if(textoDasJogadas[cont].match("O-O-O"))
                                {
                                    jogadaAtual.push(8);
                                    jogadaAtual.push(textoDasJogadas[cont]);
                                //kingside castling
                                } else {
                                    jogadaAtual.push(7);
                                    jogadaAtual.push(textoDasJogadas[cont]);
                                }
                                break;
                            default:
                                jogadaAtual.push(6);
                                jogadaAtual.push(textoDasJogadas[cont]);

                        }
                        cont++;
                        // DEPURAÇAO console.log("jogadaAtual " + jogadaAtual);
                    }
                    jogadas.push(jogadaAtual);
                    // DEPURAÇAO console.log(jogadas);
                    
                }
            }
        }
    }

    return jogadas;
}

