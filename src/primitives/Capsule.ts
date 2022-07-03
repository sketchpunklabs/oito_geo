import { Maths, vec3 }  from 'oito';
import Util             from '../util/Util';

export default class Capsule{
    static get( radius=0.5, height=1.0, latheSteps=10, arcSteps=5 ) : TGeo{
        const rtn : TGeo = {
            vertices : [],
            indices  : [],
            texcoord : [],
            normals  : [],
        };

        const cLen = arcSteps * 2;
        const rLen = latheSteps + 1;

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Util.gridIndices( rtn.indices, cLen, rLen, 0, false, false );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Vertices 
        const base : Array<number> = [];
        const hh   = height / 2;
        const up   = [ 0,  hh, 0 ];
        const dn   = [ 0, -hh, 0 ];
        Util.arcVertices( base, Maths.PI_H, 0, arcSteps, radius, up );   // Top Dome
        Util.arcVertices( base, 0, -Maths.PI_H, arcSteps, radius, dn );  // Bottom Dome
        Util.lathe( base, rtn.vertices, latheSteps, true );              // Repeat Pattern in a Circular Y Axis

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Normals
        let v;
        for( v of vec3.bufIter( rtn.vertices ) ){
            vec3.add( v, ( v[1] > 0 )? dn : up );
            vec3.norm( v );
            vec3.pushTo( v, rtn.normals );
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // UV
        let x, y, yt;
        for( y=0; y <= rLen; y++ ){
            yt = 1 - ( y / rLen );
            for( x=0; x <= cLen; x++ ) rtn.texcoord.push( x / cLen, yt );
        }

        return rtn;
    }
}