/* 

Baseado no codigo de FrenchToast747

https://github.com/frenchtoast747/webgl-obj-loader/blob/master/webgl-obj-loader.js


*/


function getOBJ(url)
{
	var verts = [], normalsLoc = [], texturesLoc = [];

	var indices =[], normais = [], textures = [];

	// array of lines separated by the newline
    var lines = getUrl(url).split('\n'), i;

    for (i = 0; i < lines.length; i++) {
     	// if this is a vertex
      	var line;
	      if (lines[i].startsWith('v ')) {
	        line = lines[i].slice(3).split(" ");
	        verts.push(parseFloat(line[0]));
	        verts.push(parseFloat(line[1]));
	        verts.push(parseFloat(line[2]));
	      } else if (lines[i].startsWith('vn')) {
	        // if this is a vertex normal
	        line = lines[i].slice(3).split(" ");
	        normalsLoc.push(parseFloat(line[0]));
	        normalsLoc.push(parseFloat(line[1]));
	        normalsLoc.push(parseFloat(line[2]));
      	} else if (lines[i].startsWith('vt')) {
	        // if this is a texture
	        line = lines[i].slice(3).split(" ");
	        texturesLoc.push(parseFloat(line[0]));
	        texturesLoc.push(parseFloat(line[1]));
	    } else if (lines[i].startsWith('f ')) {
	      	linha = lines[i].slice(2).split(" ");
			for(var j = 0; j < 3; j++)
			{
				var vertFace = linha[j].split('/');

				var vertQueQuero = parseFloat(vertFace[0]);
				indices.push(verts[(vertQueQuero  - 1)* 3 + 0]);
				indices.push(verts[(vertQueQuero  - 1)* 3 + 1]);
				indices.push(verts[(vertQueQuero  - 1)* 3 + 2]);

				if(texturesLoc.length > 0)
				{
					vertQueQuero = parseFloat(vertFace[1]);
					textures.push(texturesLoc[(vertQueQuero  - 1)* 3 + 0]);
					textures.push(texturesLoc[(vertQueQuero  - 1)* 3 + 1]);
					textures.push(texturesLoc[(vertQueQuero  - 1)* 3 + 2]);
				}
				if(normalsLoc.length > 0)
				{
					vertQueQuero = parseFloat(vertFace[2]);
					normais.push(normalsLoc[(vertQueQuero  - 1)* 3 + 0]);
					normais.push(normalsLoc[(vertQueQuero  - 1)* 3 + 1]);
					normais.push(normalsLoc[(vertQueQuero  - 1)* 3 + 2]);
				}

			}

      	}

    }

    return [verts, normais, textures, indices];



}

function getVertices()
{
	return this.vertices;
}



function getNormais()
{
	return this.normais;
}


function getTextures()
{
	return this.coordTexturas;
}

function getIndices()
{
	return this.indices;
}
/* A função transforma o .obj em uma String que e retornada pela funçao */
function getUrl(url) {
	var xmlHttp = new XMLHttpRequest(); 
	xmlHttp.open("GET", url, false); 
	xmlHttp.send(null); 
	return xmlHttp.responseText; 
}
