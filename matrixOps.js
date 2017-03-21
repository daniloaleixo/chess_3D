
function matrix4Rotate(angle, axis)
{
    if ( !Array.isArray(axis) ) {
        axis = [ arguments[1], arguments[2], arguments[3] ];
    }

    var v = normalize( axis );

    var x = v[0];
    var y = v[1];
    var z = v[2];

    var c = Math.cos( radians(angle) );
    var omc = 1.0 - c;
    var s = Math.sin( radians(angle) );

    var result = mat4(
        vec4( x*x*omc + c,   x*y*omc - z*s, x*z*omc + y*s, 0.0 ),
        vec4( x*y*omc + z*s, y*y*omc + c,   y*z*omc - x*s, 0.0 ),
        vec4( x*z*omc - y*s, y*z*omc + x*s, z*z*omc + c,   0.0 ),
        vec4()
    );

    return result;
}

function multiplica(u, v)
{
    var result = [];

    if ( u.matrix && v.matrix ) {
        if ( u.length != v.length ) {
            throw "mult(): trying to add matrices of different dimensions";
        }

        for ( var i = 0; i < u.length; ++i ) {
            if ( u[i].length != v[i].length ) {
                throw "mult(): trying to add matrices of different dimensions";
            }
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( [] );

            for ( var j = 0; j < v.length; ++j ) {
                var sum = 0.0;
                for ( var k = 0; k < u.length; ++k ) {
                    sum += u[i][k] * v[k][j];
                }
                result[i].push( sum );
            }
        }

        result.matrix = true;

        return result;
    }
    else {
        if ( u.length != v.length ) {
            throw "mult(): vectors are not the same dimension";
        }

        for ( var i = 0; i < u.length; ++i ) {
            result.push( u[i] * v[i] );
        }

        return result;
    }
}

function setMatrixUniforms(modelMatrix, modelMatrixLoc, viewMatrix, viewMatrixLoc, projectionMatrix, projectionMatrixLoc){
    gl.uniformMatrix4fv( modelMatrixLoc, false, flatten(modelMatrix) );
    gl.uniformMatrix4fv( viewMatrixLoc, false, flatten(viewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
}

function matrix4Translate(x, y, z)
{
    var result = mat4(
        vec4(1.0, 0.0, 0.0, x),
        vec4(0.0, 1.0, 0.0, y),
        vec4(0.0, 0.0, 1.0, z),
        vec4()
    );
    return result;
}

function matrix4Scale(sx, sy, sz)
{
    var result = mat4(
        vec4(sx, 0.0, 0.0, 0.0),
        vec4(0.0, sy, 0.0, 0.0),
        vec4(0.0, 0.0, sz, 0.0),
        vec4()
    );
    return result;
}

function identityMatrix(){
    var matrix = [
        vec4(1.0, 0.0, 0.0, 0.0),
        vec4(0.0, 1.0, 0.0, 0.0),
        vec4(0.0, 0.0, 1.0, 0.0),
        vec4(0.0, 0.0, 0.0, 1.0)
    ];
    return matrix;
}

function transpose4Matrix(m)
{
    if ( !m.matrix ) {
        return "transpose(): trying to transpose a non-matrix";
    }

    var result = [];
    for ( var i = 0; i < m.length; ++i ) {
        result.push( [] );
        for ( var j = 0; j < m[i].length; ++j ) {
            result[i].push( m[j][i] );
        }
    }

    result.matrix = true;
    
    return result;
}

function mPushMatrix()
{
    var copy = identityMatrix();
    matrix4Set(modelMatrix, copy);
    modelMatrixPilha.push(copy);
}

function mPopMatrix()
{
    if(modelMatrixPilha.length == 0)
    {
        throw "invalido mPopMatrix";
    }
    modelMatrix = modelMatrixPilha.pop();
}

function matrix4Set(m1, m2)
{
    for(var i = 0; i< 4; i++)
    {
        for (var j = 0; j < 4; j++)
        {
            m2[i][j] = m1[i][j];
        }
    }
}