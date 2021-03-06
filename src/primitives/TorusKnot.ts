import { Vec3Buf, TVec3 } from 'oito';
import Util from '../util/Util';

export default class Torusknot{
    static geo( col_cnt=10, row_cnt=60, tube_radius=0.3, curve_p=2, curve_q=3, curve_radius=1.0 ): TGeo{	
        const rtn : TGeo = {
            vertices : new Array( col_cnt * row_cnt ),
            indices  : [],
            texcoord : [],
            normals  : new Array( col_cnt * row_cnt ),
        };

        /*
        let shape	= Util.circleVertices( col_cnt, tube_radius ), // Shape to Extrude
            v_ary	= new Vec3Buffer( col_cnt * row_cnt ),	// Vertex Buffer
            n_ary	= new Vec3Buffer( col_cnt * row_cnt ),	// Vertex Normal Buffer
            p		= new App.Vec3(),	// Curve Position
            v		= new App.Vec3(),	// Final vertex
            n		= new App.Vec3(),	// Final vertex norma.
            fwd		= new App.Vec3(),	// axis directions
            lft		= new App.Vec3(),
            up		= new App.Vec3(),
            q		= new App.Quat(),	// Rotation for extruded shape
            ct, i, j;

        for( i=0; i < row_cnt; i++ ){
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            ct = i / row_cnt; // Curve Time

            torus_knot( p, ct, curve_p, curve_q, curve_radius );							// Pos On Curve
            torus_knot_dxdy( fwd, ct, curve_p, curve_q, curve_radius );						// Fwd Dir of Point
            torus_knot_dxdy( up, (i + 0.00001) / row_cnt, curve_p, curve_q, curve_radius );	// Near Future Fwd Dir
            
            fwd.norm();							// Forward
            up.add( p );						// Temp Up ( Adding to pos makes it twist less )
            lft.from_cross( up, fwd ).norm();	// Left
            up.from_cross( fwd, lft ).norm();	// Orthogonal Up
        
            q.from_axis( lft, up, fwd );		// Create Rotation Based on Orthogonal Axis

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            for( j=0; j < shape.len; j++ ){
                shape.copy_to( j, v );	// Get position from vert buffer
                v.transform_quat( q )	// Rotate the vector
                n.from_norm( v );		// Normalize a copy
                v.add( p );				// Move vert into position

                v_ary.push( v );		// Save Verts
                n_ary.push( n ); 		// Save Normal
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

        return { 
            vert	: v_ary.dissolve(), 
            norm	: n_ary.dissolve(),
            idx 	: Util.grid_indices( col_cnt, row_cnt, true, true, true )
        };
        */

        return rtn;
    }
}


// https://blackpawn.com/texts/pqtorus/

class TorusKnotCurve{
    // p : winds around its axis of rotational symmetry
    // q : winds around a circle in the interior
    static at( out: TVec3, t: number, p=2, q=5, radius=1 ) : TVec3{

        // https://en.wikipedia.org/wiki/Torus_knot
        // x = r * ( 2 + cos( q/p * x ) ) * 0.5 * cos( x )
        // y = r * ( 2 + cos( q/p * x ) ) * 0.5 * sin( x )
        // z = r * sin( q/p * x ) * 0.5
        const x         = t * p * Math.PI * 2,
              qpx       = q / p * x,
              rh        = radius * 0.5,
              qpx_xy    = rh * (2 + Math.cos( qpx ));
    
        out[ 0 ] = qpx_xy * Math.cos( x );
        out[ 1 ] = qpx_xy * Math.sin( x );
        out[ 2 ] = rh * Math.sin( qpx );
        return out;
    }
    
    // first derivative - tangent of curve
    static dxdy( out: TVec3, t:number, p=2, q=5, radius=1 ) : TVec3{
        // https://www.symbolab.com/solver/derivative-calculator
        // https://www.wolframalpha.com/
        // First Derivative
        // 0.5 * r * ( -sin( x ) * ( 2 + cos( q * x / p ) ) - ( q * sin( q * x / p ) * cos( x ) / p ) )
        // 0.5 * r * ( cos( x ) * ( 2 + cos( q * x / p ) ) - ( q * sin( q * x / p ) * sin( x ) / p ) )
        // r * 0.5 * q * cos( q * x / p ) / p

        const x         = t * p * Math.PI * 2,
              rh        = radius * 0.5,
              pi        = 1 / p,
              qpx       = q * x * pi,
              sin_x     = Math.sin( x ),
              cos_x     = Math.cos( x ),
              sin_qpx   = Math.sin( qpx ),
              cos_qpx   = Math.cos( qpx );

        out[ 0 ] = rh * ( -sin_x * ( 2 + cos_qpx ) - q*sin_qpx*cos_x*pi );
        out[ 1 ] = rh * ( cos_x * ( 2 + cos_qpx ) - q*sin_qpx*sin_x*pi );
        out[ 2 ] = rh * q * cos_qpx * pi ;
        return out;
    }
    
    // second derivative - normal of curve
    static dxdy2( out: TVec3, t:number, p=2, q=5, radius=1 ) : TVec3{
        const x         = t * p * Math.PI * 2,
              rh        = radius * 0.5,
              pq2       = 2 * p * q,
              qxp       = q * x / p,
              pp        = p*p,
              ppi       = 1 / pp,
              qq        = q*q,
              cos_x     = Math.cos( x ),
              sin_x     = Math.sin( x ),
              cos_qxp   = Math.cos( qxp ),
              sin_qxp   = Math.sin( qxp ),
              com       = (pp + qq) * cos_qxp + 2 * pp,
              n_rh_pp   = -rh * ppi;
    
        out[ 0 ] = n_rh_pp * ( cos_x * com - pq2 * sin_x * sin_qxp );
        out[ 1 ] = n_rh_pp * ( sin_x * com + pq2 * cos_x * sin_qxp );
        out[ 2 ] = -0.5 * qq * radius * sin_qxp * ppi;
        return out;
    }

}