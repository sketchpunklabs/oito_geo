import { Vec3, TVec3 }  from 'oito';
import Util             from '../util/Util';

export default class Cylinder{

    static get( len=1.5, radius=0.5, steps=12, axis='y' ) : TGeo{        
        const dir   = new Vec3();
        const v     = new Vec3();
        const d     = new Vec3();
        const h     = len / 2;

        let i       : number, 
            ang     : number;
        
        let aa: number, bb: number, cc: number, dd: number, ii: number;

        let a=0, b=0, c=0;

        switch( axis ){
            case "y": a = 2; b = 1; c = 0; dir.copy( Vec3.UP );         break;
            case "x": a = 2; b = 0; c = 1; dir.copy( Vec3.LEFT );       break;
            case "z": a = 0; b = 2; c = 1; dir.copy( Vec3.FORWARD );    break;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // SETUP
        const rtn :TGeo = {
            vertices    : [],
            indices     : [],
            texcoord    : [],   // TODO - Compute UV for Cylinder
            normals     : [],
        };

        // Duplicate and Move Loop Indices
        const dupLoop = ( loop: Array<number>, dir: TVec3 ) : Array<number> =>{
            const out : Array<number>= [];
            let idx = rtn.vertices.length / 3;
            let i: number;
            for( i of loop ){
                v.fromBuf( rtn.vertices, i*3 ).add( dir ).pushTo( rtn.vertices );
                out.push( idx++ );
            }
            return out;
        };

        // Create Fan Indices from Index Loop and Center Points
        const fanInd = ( loop: Array<number>, cIdx: number, rev=false ) => {
            let i = 0, ii = 0; len = loop.length-1;
            for( i; i < len; i++ ){
                ii = (i + 1) % len;
                if( !rev )  rtn.indices.push( loop[ i ], cIdx, loop[ ii ] );
                else        rtn.indices.push( loop[ ii ], cIdx, loop[ i ] );
            }
        };

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const topLoop : Array<number> = [];                             // Top Side
        d.fromScale( dir, h );        // How much to Move the Top Verts

        for( i=0; i <= steps; i++ ){  // Create Circle of Verts
            ang     = ( i / steps ) * Math.PI * 2; 
            v[ a ]  = Math.cos( ang ) * radius;
            v[ b ]  = 0;
            v[ c ]  = Math.sin( ang ) * radius;
            v.add( d ).pushTo( rtn.vertices );
            topLoop.push( i );
        }

        const botLoop   = dupLoop( topLoop, d.fromScale( dir, -len ) ); // Bottom Side
        const topCap    = dupLoop( topLoop, [0,0,0] );                  // Top Cap
        const botCap    = dupLoop( botLoop, [0,0,0] );                  // Bottom Cap

        const topCenter = rtn.vertices.length / 3;
        const botCenter = topCenter + 1;

        d   .fromScale( dir, h ).pushTo( rtn.vertices )                 // Center Verts in Caps
            .fromScale( dir, -h ).pushTo( rtn.vertices );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        for( i=0; i < steps; i++ ){                                     // Wall Indices
            ii = (i + 1) % steps;
            aa = topLoop[ i ];
            bb = botLoop[ i ];
            cc = botLoop[ ii ];
            dd = topLoop[ ii ];
            rtn.indices.push( aa, bb, cc, cc, dd, aa );
        }

        fanInd( topCap, topCenter, true );                              // Cap indices
        fanInd( botCap, botCenter, false );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Finish Up
        Util.appendTriangleNormals( rtn );                              // Create Normals

        return rtn;
    }

}