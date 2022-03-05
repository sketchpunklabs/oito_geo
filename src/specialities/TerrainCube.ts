import Util from '../util/Util';
import { Vec3, vec3 } from 'oito';

export default class TerrianCube{

    static get( w=2, h=2, d=1, xCells=5, yCells=5, fromCenter=true ): TGeo{
        const rtn : TGeo = {
            vertices : [],
            indices  : [],
            texcoord : [],
            normals  : [],
        };

        const botLoop: Array<number>=[];
        const edges = Util.gridEdgeIndices( xCells+1, yCells+1 );
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create Top Base First
        Util.gridVertices( rtn.vertices, w, h, xCells, yCells, fromCenter );
        Util.gridAltIndices( rtn.indices, xCells+1, yCells+1, 0, true );
        //Util.gridTexcoord( rtn.texcoord, xCells+1, yCells+1 );
        for( let i=0; i < rtn.vertices.length / 3; i++ ) rtn.normals.push( 0,1,0 );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Modify Verts
        Util.shiftVertices( rtn.vertices, [ 0, d, 0 ] );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Extrude Edges to make side Walls & bottom cap
        this.buildEdge( edges[0], rtn, [0,0,-1], botLoop );
        this.buildEdge( edges[1], rtn, [1,0,0], botLoop );
        this.buildEdge( edges[2], rtn, [0,0,1], botLoop );
        this.buildEdge( edges[3], rtn, [-1,0,0], botLoop );
        this.buildBottomCap( botLoop, rtn );

        return rtn;
    }

    static buildEdge( edge: Array<number>, geo:TGeo, dir:Array<number>, loop:Array<number> ){
        const verts = geo.vertices;
        const norm  = geo.normals;
        const indi  = geo.indices;
        const eCnt  = edge.length;
        const v     = [0,0,0];
        let i: number;
        let a: number;
        let b: number;
        let c: number;
        let d: number;
        let ii: number;

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create New Vertices
        const top : Array<number> = [];
        const bot : Array<number> = [];
        for( i of edge ){
            vec3.fromBuf( verts, i*3, v );                                  // Copy Vert
            top.push( Math.floor( vec3.pushTo( v, verts ) / 3 ) );          // Add Back to Verts, Save Index
            v[1] = 0;                                                       // Move vert to floor
            ii   = Math.floor(  vec3.pushTo( v, verts ) / 3 );              // Add Back to Verts
            bot.push( ii );                                                 // ... Save Index
            norm.push( dir[0], dir[1], dir[2], dir[0], dir[1], dir[2] );    // Create Normal for Top&Bot vert
            loop.push( ii );                                                // Create a Index Loop of Bottom Verts
        }

        // Dont Need the last point of side since its the 
        // same as the first point of the next side
        loop.pop(); 

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create Triangle Faces
        for( i=0; i < eCnt - 1; i++ ){
            a = top[ i ];
            b = bot[ i ];
            c = bot[ i+1 ];
            d = top[ i+1 ];
            indi.push( a, d, c, c, b, a );
        }
    }

    static buildBottomCap( loop: Array<number>, geo:TGeo ): void{
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Compute Centroid of Loop
        const c = new Vec3();
        const v = new Vec3();
        const idx = [];
        let i: number;

        for( i of loop ){
            vec3.fromBuf( geo.vertices, i*3, v );       // Copy Vert
            vec3.add( c, v );                           // Compute Average
            idx.push(                                   // Add & Save Index
                Math.floor( 
                    vec3.pushTo( v, geo.vertices ) / 3
                )
            );
            geo.normals.push( 0, -1, 0 );               // Add Normals
        }

        vec3.divScale( c, loop.length );                // Divide to get average point

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Create Fan Faces with Loop Verts & Center Vert
        const cIdx = Math.floor( vec3.pushTo( c, geo.vertices ) / 3 ); // Save vert
        const len  = idx.length;
        let ii: number;

        for( i=0; i < len; i++ ){
            ii = ( i+1 ) % len;
            geo.indices.push( cIdx, idx[ i ], idx[ ii ] );
        }
    }
}