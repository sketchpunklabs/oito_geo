import * as THREE from 'three';

export default class Util{
    static facedCube( pos=null, scl=null, size=[1,1,1] ){
        const geo = new THREE.BoxGeometry( size[0], size[1], size[2] );
        const mat = [
            new THREE.MeshBasicMaterial( { color: 0x00ff00 } ), // Left
            new THREE.MeshBasicMaterial( { color: 0x777777 } ), // Right
            new THREE.MeshBasicMaterial( { color: 0x0000ff } ), // Top
            new THREE.MeshBasicMaterial( { color: 0x222222 } ), // Bottom
            new THREE.MeshBasicMaterial( { color: 0xff0000 } ), // Forward
            new THREE.MeshBasicMaterial( { color: 0xffffff } ), // Back
        ];
    
        const mesh = new THREE.Mesh( geo, mat );
        
        if( pos )           mesh.position.fromArray( pos );
        if( scl != null )   mesh.scale.set( scl, scl, scl );
    
        return mesh; 
    }

    static mesh( verts, idx=null, norm=null, uv=null, mat=null, wireFrame=false ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const bGeo = new THREE.BufferGeometry();
        bGeo.setAttribute( "position",  new THREE.BufferAttribute( new Float32Array( verts ), 3 ) );

        if( idx && idx.length > 0 )   bGeo.setIndex( idx );
        if( norm && norm.length > 0 ) bGeo.setAttribute( "normal",    new THREE.BufferAttribute( new Float32Array( norm ), 3 ) );
        if( uv && uv.length > 0 )     bGeo.setAttribute( "uv",        new THREE.BufferAttribute( new Float32Array( uv ), 2 ) );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        mat = mat || new THREE.MeshPhongMaterial( { color:0x009999 } ); // ,side:THREE.DoubleSide
        const mesh = new THREE.Mesh( bGeo, mat );

        if( wireFrame ){
            const mat  = new THREE.LineBasicMaterial({ color:0xffffff, opacity:0.6, transparent:true });
            const wGeo = new THREE.WireframeGeometry( bGeo );
            const grp  = new THREE.Group();
            grp.add( mesh );
            grp.add( new THREE.LineSegments( wGeo, mat ) )
            return grp;
        }else{
            return mesh;
        }
    }

    static meshFromAttribs( attr={}, mat=null ){
        const bGeo  = new THREE.BufferGeometry();
        let compLen = 3;
        let buf;

        for( const [k,v] of Object.entries( attr ) ){
            if( k === 'index' ) bGeo.setIndex( v );
            else{
                switch( k ){
                    case 'uv': compLen = 2; break;
                    default  : compLen = 3; break;
                }

                buf = new THREE.BufferAttribute( 
                    ( v instanceof Float32Array )? v : new Float32Array( v ), 
                    compLen
                );
                
                bGeo.setAttribute( k, buf );
            }
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        mat = mat || new THREE.MeshPhongMaterial( { color:0x009999 } ); // ,side:THREE.DoubleSide
        const mesh = new THREE.Mesh( bGeo, mat );

        return mesh;
    }
}