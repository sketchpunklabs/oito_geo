import { vec3 } from 'oito';


// https://github.com/keenanwoodall/Deform/blob/master/Code/Runtime/Mesh/Deformers/CylindrifyDeformer.cs
export default class Cylindrify{
    factor = 0.8;  // between 0 & 1;
    radius = 3;
    axis   = [1,0,0];

    apply( verts: Array<number> ) : void{
        const v = [0,0,0];
        const n = [0,0,0];
        const o = [0,0,0];

        for( let i=0; i < verts.length; i+=3 ){
            vec3.fromBuf( verts, i, v );
            let a = v[0]
            let b = v[2] - this.radius;

            let len = Math.sqrt( a ** 2 + b ** 2 );
            a = ( len != 0 )? a / len : 0;
            b = ( len != 0 )? b / len : 0;

            o[ 0 ] = a * this.radius;
            o[ 1 ] = v[ 1 ];
            o[ 2 ] = b * this.radius;

            o[ 2 ] += this.radius;

            vec3.toBuf( o, verts, i );
        }

            // vec3.sub( v, offset, n );
            // vec3.norm( n );
            // vec3.scale( n, this.radius );

            // vec3.lerp( v, n, this.factor, o );
            
            // o[1] = v[1];
            // o[2] += this.radius * this.factor;

        // var point = mul (meshToAxis, float4 (vertices[index], 1f));

        // var goalRadius = normalize (point.xy) * radius;

        // point.xy = lerp (point.xy, goalRadius, factor);

        // vertices[index] = mul (axisToMesh, point).xyz;
    }
}