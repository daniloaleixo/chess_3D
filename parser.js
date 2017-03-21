function readUrl(url)
{
	console.log("readURL");

	var vertices = [];
	var obj = [];
	var linhas = getUrl(url).split('\n');
	
	
	for(i = 0; i < linhas.length; i++)
	{
		var linha;
		/* Pegamos todos os vertices e descartamos as normais,
			os vertices x, y,z estao colocados todos juntos, 
			entao para acessar o vertice i, usamos vertices[i * 3] */
		if(linhas[i].startsWith('v '))
		{
			console.log(linhas[i]);
			/* DEPURAÇAO console.log("Linha: " + linhas[i]);*/
			linha = linhas[i].slice(2).split(" ");
			vertices.push(parseFloat(linha[0]));
			vertices.push(parseFloat(linha[1]));
			vertices.push(parseFloat(linha[2]));
		}


		else if(linhas[i].startsWith('f '))
		{
			linha = linhas[i].slice(2).split(" ");
			for(var j = 0; j < linha.length; j++)
			{
				var vertFace = linha[j].split('/');
				var vertQueQuero = parseFloat(vertFace[0]);
				obj.push(vertices[(vertQueQuero  - 1)* 3 + 0]);
				obj.push(vertices[(vertQueQuero  - 1)* 3 + 1]);
				obj.push(vertices[(vertQueQuero  - 1)* 3 + 2]);
			}

		}
	}
	/* DEPURAÇAO console.log(vertices);*/
	return obj;
}

/* A função transforma o .obj em uma String que e retornada pela funçao */
function getUrl(url) {
	var xmlHttp = new XMLHttpRequest(); 
	xmlHttp.open("GET", url, false); 
	xmlHttp.send(null); 
	return xmlHttp.responseText; 
}

function readNormals(url)
{
	var normais = [];
	var obj = [];
	var linhas = getUrl(url).split('\n');
	
	
	for(i = 0; i < linhas.length; i++)
	{
		var linha;
		/* Pegamos todos os vertices e descartamos as normais,
			os vertices x, y,z estao colocados todos juntos, 
			entao para acessar o vertice i, usamos vertices[i * 3] */
		if(linhas[i].startsWith('vn'))
		{
			/* DEPURAÇAO console.log("Linha: " + linhas[i]);*/
			linha = linhas[i].slice(2).split(" ");
			normais.push(parseFloat(linha[0]));
			normais.push(parseFloat(linha[1]));
			normais.push(parseFloat(linha[2]));
		}


		else if(linhas[i].startsWith('f '))
		{
			linha = linhas[i].slice(2).split(" ");
			for(var j = 0; j < linha.length; j++)
			{
				var vertFace = linha[j].split('/');
				var vertQueQuero = parseFloat(vertFace[2]);
				obj.push(normais[(vertQueQuero  - 1)* 3 + 0]);
				obj.push(normais[(vertQueQuero  - 1)* 3 + 1]);
				obj.push(normais[(vertQueQuero  - 1)* 3 + 2]);
			}

		}
	}
	/* DEPURAÇAO console.log(vertices);*/
	return obj;
}