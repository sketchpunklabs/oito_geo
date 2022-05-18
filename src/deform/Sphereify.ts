import { vec3 } from 'oito';

export default class Sphereify{
    factor = 0.8;  // between 0 & 1;
    radius = 1;
    axis   = [1,0,0];

    apply( verts: Array<number> ) : void{
        const v = [0,0,0];
        const n = [0,0,0];
        const o = [0,0,0];
        const offset = [0,0,this.radius];

        for( let i=0; i < verts.length; i+=3 ){
            vec3.fromBuf( verts, i, v );
            
            vec3.sub( v, offset, n );
            vec3.norm( n );
            vec3.scale( n, this.radius );

            vec3.lerp( v, n, this.factor, o );
            
            o[1] = v[1];
            o[2] += this.radius * this.factor;

            vec3.toBuf( o, verts, i );
        }
    }
}