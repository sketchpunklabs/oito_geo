export function vec3_fromBuf( out, buf, i ){
    i       *= 3;
    out[ 0 ] = buf[ i+0 ];
    out[ 1 ] = buf[ i+1 ];
    out[ 2 ] = buf[ i+2 ];
    return out;
}

export function vec3_copy( out, a ){
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    return out;
}

export function vec3_negate( out, a ){
    out[0] = -a[0];
    out[1] = -a[1];
    out[2] = -a[2];
    return out;
}

export function vec3_set( out, x, y, z ){
    out[0] = x;
    out[1] = y;
    out[2] = z;
    return out;
}

export function vec3_add( out, a, b ){
    out[ 0 ] = a[ 0 ] + b[ 0 ];
    out[ 1 ] = a[ 1 ] + b[ 1 ];
    out[ 2 ] = a[ 2 ] + b[ 2 ];
    return out;
}

export function vec3_sub( out, a, b ){
    out[ 0 ] = a[ 0 ] - b[ 0 ];
    out[ 1 ] = a[ 1 ] - b[ 1 ];
    out[ 2 ] = a[ 2 ] - b[ 2 ];
    return out;
}

export function vec3_norm( out, a ){
    let mag = Math.sqrt( a[ 0 ]**2 + a[ 1 ]**2 + a[ 2 ]**2 );
    if( mag != 0 ){
        mag      = 1 / mag;
        out[ 0 ] = a[ 0 ] * mag;
        out[ 1 ] = a[ 1 ] * mag;
        out[ 2 ] = a[ 2 ] * mag;
    }
    return out;
}

export function vec3_dot( a, b ){ return a[ 0 ] * b[ 0 ] + a[ 1 ] * b[ 1 ] + a[ 2 ] * b[ 2 ]; }   

export function vec3_perp_y( out, a ){
    // perpendicular
    const x  = a[ 0 ];
    out[ 0 ] = -a[ 2 ];
    out[ 1 ] =  a[ 1 ];
    out[ 2 ] =  x;
    return out;
}

export function vec3_scaleAndAdd( out, add, v, s ){
    out[ 0 ] = v[ 0 ] * s + add[ 0 ];
    out[ 1 ] = v[ 1 ] * s + add[ 1 ];
    out[ 2 ] = v[ 2 ] * s + add[ 2 ];
    return out;
}
