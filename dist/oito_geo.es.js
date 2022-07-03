var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import { Maths, Vec3, vec3 } from "oito";
class Util {
  static gridIndices(out, row_size, row_cnt, start_idx = 0, do_loop = false, rev_quad = false) {
    const row_stop = do_loop ? row_cnt : row_cnt - 1, col_stop = row_size - 1;
    let row_a, row_b, r, rr, a, b, c, d;
    for (r = 0; r < row_stop; r++) {
      row_a = start_idx + row_size * r;
      row_b = start_idx + row_size * ((r + 1) % row_cnt);
      for (rr = 0; rr < col_stop; rr++) {
        a = row_a + rr;
        b = row_a + rr + 1;
        d = row_b + rr;
        c = row_b + rr + 1;
        if (!rev_quad)
          out.push(a, b, c, c, d, a);
        else
          out.push(a, d, c, c, b, a);
      }
    }
  }
  static gridIndicesCol(out, row_size, row_cnt, start_idx = 0, do_loop = false, rev_quad = false) {
    const row_stop = row_cnt - 1, col_stop = do_loop ? row_size : row_size - 1;
    let row_a, row_b, r, rr, rrr, a, b, c, d;
    for (r = 0; r < row_stop; r++) {
      row_a = start_idx + row_size * r;
      row_b = start_idx + row_size * (r + 1);
      for (rr = 0; rr < col_stop; rr++) {
        rrr = (rr + 1) % row_size;
        a = row_a + rr;
        b = row_a + rrr;
        d = row_b + rr;
        c = row_b + rrr;
        if (!rev_quad)
          out.push(a, b, c, c, d, a);
        else
          out.push(a, d, c, c, b, a);
      }
    }
  }
  static gridAltIndices(out, row_size, row_cnt, start_idx = 0, rev_quad = false) {
    const row_stop = row_cnt - 1;
    const col_stop = row_size - 1;
    let x, y, a, b, c, d, bit;
    for (y = 0; y < row_stop; y++) {
      bit = y & 1;
      for (x = 0; x < col_stop; x++) {
        a = start_idx + y * row_size + x;
        b = a + row_size;
        c = b + 1;
        d = a + 1;
        if (rev_quad) {
          if ((x & 1) == bit)
            out.push(d, a, b, b, c, d);
          else
            out.push(a, b, c, c, d, a);
        } else {
          if ((x & 1) == bit)
            out.push(d, c, b, b, a, d);
          else
            out.push(a, d, c, c, b, a);
        }
      }
    }
  }
  static gridEdgeIndices(row_size, row_cnt) {
    const xCell = row_size - 1;
    const yCell = row_cnt - 1;
    const len = row_size * row_cnt;
    let i;
    const et = [];
    for (i = 0; i < row_size; i++)
      et.push(i);
    const er = [];
    for (i = 0; i < row_cnt; i++)
      er.push(i * row_size + xCell);
    const eb = [];
    for (i = 0; i < row_size; i++)
      eb.push(len - i - 1);
    const el = [];
    for (i = yCell; i >= 0; i--)
      el.push(i * row_size);
    return [et, er, eb, el];
  }
  static fanIndices(out, midIdx, edgeStart, edgeEnd, rev_quad = false) {
    const len = edgeEnd - edgeStart + 1;
    let i, ii;
    for (i = 0; i < len; i++) {
      ii = (i + 1) % len;
      if (!rev_quad)
        out.push(midIdx, edgeStart + i, edgeStart + ii);
      else
        out.push(midIdx, edgeStart + ii, edgeStart + i);
    }
  }
  static arcVertices(out, angle_a, angle_b, div, radius = 1, offset = [0, 0, 0]) {
    const inc = 1 / (div - 1);
    let x, y, t, angle;
    for (let i = 0; i < div; i++) {
      t = i * inc;
      angle = angle_a * (1 - t) + angle_b * t;
      x = Math.cos(angle) * radius;
      y = Math.sin(angle) * radius;
      out.push(x + offset[0], y + offset[1], offset[2]);
    }
  }
  static gridVertices(out, width = 1, height = 1, xCells = 2, yCells = 2, useCenter = false, isVertical = false) {
    const x_inc = width / xCells;
    let y_inc = height / yCells;
    let ox = 0, oz = 0, x, z, xi, yi;
    if (useCenter) {
      if (!isVertical) {
        ox = -width * 0.5;
        oz = -height * 0.5;
      } else {
        ox = -width * 0.5;
        oz = height * 0.5;
        y_inc = -y_inc;
      }
    }
    for (yi = 0; yi <= yCells; yi++) {
      z = yi * y_inc;
      for (xi = 0; xi <= xCells; xi++) {
        x = xi * x_inc;
        if (!isVertical)
          out.push(x + ox, 0, z + oz);
        else
          out.push(x + ox, z + oz, 0);
      }
    }
  }
  static circleVertices(out, pntCnt = 6, radius = 1) {
    let t, angle;
    for (let i = 0; i < pntCnt; i++) {
      t = i / pntCnt;
      angle = Maths.TAU * t;
      out.push(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    }
  }
  static gridTexcoord(out, xLen, yLen) {
    let x, y, yt;
    for (y = 0; y <= yLen; y++) {
      yt = 1 - y / yLen;
      for (x = 0; x <= xLen; x++)
        out.push(x / xLen, yt);
    }
  }
  static newGeo() {
    return { vertices: [], normals: [], indices: [], texcoord: [] };
  }
  static lathe(base, out, steps = 2, repeatStart = false, angleRng = Maths.TAU, rotAxis = "y") {
    const inc = angleRng / steps;
    const v = new Vec3();
    const len = base.length;
    let i, j, angle, cos, sin;
    let rx = 0, ry = 0, rz = 0;
    for (i = 0; i < steps; i++) {
      angle = i * inc;
      cos = Math.cos(angle);
      sin = Math.sin(angle);
      for (j = 0; j < len; j += 3) {
        v.fromBuf(base, j);
        switch (rotAxis) {
          case "y":
            ry = v.y;
            rx = v.z * sin + v.x * cos;
            rz = v.z * cos - v.x * sin;
            break;
          case "x":
            rx = v.x;
            ry = v.y * cos - v.z * sin;
            rz = v.y * sin + v.z * cos;
            break;
          case "z":
            rz = v.z;
            rx = v.x * cos - v.y * sin;
            ry = v.x * sin + v.y * cos;
            break;
        }
        out.push(rx, ry, rz);
      }
    }
    if (repeatStart)
      out.push(...base);
  }
  static subDivideTriangle(out, a, b, c, div) {
    const irow = [[0]];
    const seg_a = new Vec3();
    const seg_b = new Vec3();
    const seg_c = new Vec3();
    let i, j, t, row, idx = 1;
    out.vertices.push(a[0], a[1], a[2]);
    for (i = 1; i <= div; i++) {
      t = i / div;
      seg_b.fromLerp(a, b, t);
      seg_c.fromLerp(a, c, t);
      row = [idx++];
      out.vertices.push(seg_b[0], seg_b[1], seg_b[2]);
      for (j = 1; j < i; j++) {
        t = j / i;
        seg_a.fromLerp(seg_b, seg_c, t);
        row.push(idx++);
        out.vertices.push(seg_a[0], seg_a[1], seg_a[2]);
      }
      row.push(idx++);
      out.vertices.push(seg_c[0], seg_c[1], seg_c[2]);
      irow.push(row);
    }
    let ra, rb;
    for (i = 1; i < irow.length; i++) {
      ra = irow[i - 1];
      rb = irow[i];
      for (j = 0; j < ra.length; j++) {
        out.indices.push(rb[j], rb[j + 1], ra[j]);
        if (j + 1 < ra.length)
          out.indices.push(ra[j], rb[j + 1], ra[j + 1]);
      }
    }
  }
  static appendTriangleNormals(geo) {
    let i;
    const iAry = geo.indices;
    const vAry = geo.vertices;
    const nAry = geo.normals;
    const vCnt = vAry.length;
    const nCnt = nAry.length;
    if (vCnt > nCnt) {
      for (i = nCnt; i < vCnt; i++)
        nAry.push(0);
    }
    const a = new Vec3();
    const b = new Vec3();
    const c = new Vec3();
    const n = new Vec3();
    const aSeg = new Vec3();
    const bSeg = new Vec3();
    const cSeg = new Vec3();
    let ai, bi, ci;
    for (i = 0; i < geo.indices.length; i += 3) {
      ai = 3 * iAry[i];
      bi = 3 * iAry[i + 1];
      ci = 3 * iAry[i + 2];
      a.fromBuf(vAry, ai);
      b.fromBuf(vAry, bi);
      c.fromBuf(vAry, ci);
      bSeg.fromSub(b, a);
      cSeg.fromSub(c, a);
      aSeg.fromCross(bSeg, cSeg);
      n.fromBuf(nAry, ai).add(aSeg).toBuf(nAry, ai);
      n.fromBuf(nAry, bi).add(aSeg).toBuf(nAry, bi);
      n.fromBuf(nAry, ci).add(aSeg).toBuf(nAry, ci);
    }
    for (i = 0; i < nAry.length; i += 3) {
      n.fromBuf(nAry, i).norm().toBuf(nAry, i);
    }
  }
  static reverseWinding(iAry) {
    let t, ii;
    for (let i = 0; i < iAry.length; i += 3) {
      ii = i + 2;
      t = iAry[i];
      iAry[i] = iAry[ii];
      iAry[ii] = t;
    }
  }
  static normalizeScaleVertices(geo, scl = 1, updateNormals = false) {
    const vAry = geo.vertices;
    const nAry = geo.normals;
    const vCnt = vAry.length;
    const nCnt = nAry.length;
    if (vCnt > nCnt) {
      for (let i = nCnt; i < vCnt; i++)
        nAry.push(0);
    }
    const v = new Vec3();
    for (let i = 0; i < vAry.length; i += 3) {
      v.fromBuf(vAry, i).norm();
      if (updateNormals)
        v.toBuf(nAry, i);
      v.scale(scl).toBuf(vAry, i);
    }
  }
  static shiftVertices(verts, offset, iStart = 0, iEnd = 0) {
    iEnd = iEnd == 0 ? verts.length - 3 : iEnd * 3;
    for (let i = iStart * 3; i <= iEnd; i += 3) {
      verts[i + 0] += offset[0];
      verts[i + 1] += offset[1];
      verts[i + 1] += offset[2];
    }
  }
}
class Capsule {
  static get(radius = 0.5, height = 1, latheSteps = 10, arcSteps = 5) {
    const rtn = {
      vertices: [],
      indices: [],
      texcoord: [],
      normals: []
    };
    const cLen = arcSteps * 2;
    const rLen = latheSteps + 1;
    Util.gridIndices(rtn.indices, cLen, rLen, 0, false, false);
    const base = [];
    const hh = height / 2;
    const up = [0, hh, 0];
    const dn = [0, -hh, 0];
    Util.arcVertices(base, Maths.PI_H, 0, arcSteps, radius, up);
    Util.arcVertices(base, 0, -Maths.PI_H, arcSteps, radius, dn);
    Util.lathe(base, rtn.vertices, latheSteps, true);
    let v;
    for (v of vec3.bufIter(rtn.vertices)) {
      vec3.add(v, v[1] > 0 ? dn : up);
      vec3.norm(v);
      vec3.pushTo(v, rtn.normals);
    }
    let x, y, yt;
    for (y = 0; y <= rLen; y++) {
      yt = 1 - y / rLen;
      for (x = 0; x <= cLen; x++)
        rtn.texcoord.push(x / cLen, yt);
    }
    return rtn;
  }
}
class Cube {
  static get(width = 1, height = 1, depth = 1) {
    const x1 = width * 0.5, y1 = height * 0.5, z1 = depth * 0.5, x0 = -x1, y0 = -y1, z0 = -z1;
    const vert = [
      x0,
      y1,
      z1,
      x0,
      y0,
      z1,
      x1,
      y0,
      z1,
      x1,
      y1,
      z1,
      x1,
      y1,
      z0,
      x1,
      y0,
      z0,
      x0,
      y0,
      z0,
      x0,
      y1,
      z0,
      x1,
      y1,
      z1,
      x1,
      y0,
      z1,
      x1,
      y0,
      z0,
      x1,
      y1,
      z0,
      x0,
      y0,
      z1,
      x0,
      y0,
      z0,
      x1,
      y0,
      z0,
      x1,
      y0,
      z1,
      x0,
      y1,
      z0,
      x0,
      y0,
      z0,
      x0,
      y0,
      z1,
      x0,
      y1,
      z1,
      x0,
      y1,
      z0,
      x0,
      y1,
      z1,
      x1,
      y1,
      z1,
      x1,
      y1,
      z0
    ];
    let i;
    const idx = [];
    for (i = 0; i < vert.length / 3; i += 2)
      idx.push(i, i + 1, Math.floor(i / 4) * 4 + (i + 2) % 4);
    const uv = [];
    for (i = 0; i < 6; i++)
      uv.push(0, 0, 0, 1, 1, 1, 1, 0);
    return {
      vertices: vert,
      indices: idx,
      texcoord: uv,
      normals: [
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        -1,
        0,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0,
        0,
        1,
        0
      ]
    };
  }
}
class Cylinder {
  static get(len = 1.5, radius = 0.5, steps = 12, axis = "y") {
    const dir = new Vec3();
    const v = new Vec3();
    const d = new Vec3();
    const h = len / 2;
    let i, ang;
    let aa, bb, cc, dd, ii;
    let a = 0, b = 0, c = 0;
    switch (axis) {
      case "y":
        a = 2;
        b = 1;
        c = 0;
        dir.copy(Vec3.UP);
        break;
      case "x":
        a = 2;
        b = 0;
        c = 1;
        dir.copy(Vec3.LEFT);
        break;
      case "z":
        a = 0;
        b = 2;
        c = 1;
        dir.copy(Vec3.FORWARD);
        break;
    }
    const rtn = {
      vertices: [],
      indices: [],
      texcoord: [],
      normals: []
    };
    const dupLoop = (loop, dir2) => {
      const out = [];
      let idx = rtn.vertices.length / 3;
      let i2;
      for (i2 of loop) {
        v.fromBuf(rtn.vertices, i2 * 3).add(dir2).pushTo(rtn.vertices);
        out.push(idx++);
      }
      return out;
    };
    const fanInd = (loop, cIdx, rev = false) => {
      let i2 = 0, ii2 = 0;
      len = loop.length - 1;
      for (i2; i2 < len; i2++) {
        ii2 = (i2 + 1) % len;
        if (!rev)
          rtn.indices.push(loop[i2], cIdx, loop[ii2]);
        else
          rtn.indices.push(loop[ii2], cIdx, loop[i2]);
      }
    };
    const topLoop = [];
    d.fromScale(dir, h);
    for (i = 0; i <= steps; i++) {
      ang = i / steps * Math.PI * 2;
      v[a] = Math.cos(ang) * radius;
      v[b] = 0;
      v[c] = Math.sin(ang) * radius;
      v.add(d).pushTo(rtn.vertices);
      topLoop.push(i);
    }
    const botLoop = dupLoop(topLoop, d.fromScale(dir, -len));
    const topCap = dupLoop(topLoop, [0, 0, 0]);
    const botCap = dupLoop(botLoop, [0, 0, 0]);
    const topCenter = rtn.vertices.length / 3;
    const botCenter = topCenter + 1;
    d.fromScale(dir, h).pushTo(rtn.vertices).fromScale(dir, -h).pushTo(rtn.vertices);
    for (i = 0; i < steps; i++) {
      ii = (i + 1) % steps;
      aa = topLoop[i];
      bb = botLoop[i];
      cc = botLoop[ii];
      dd = topLoop[ii];
      rtn.indices.push(aa, bb, cc, cc, dd, aa);
    }
    fanInd(topCap, topCenter, true);
    fanInd(botCap, botCenter, false);
    Util.appendTriangleNormals(rtn);
    return rtn;
  }
}
class Grid {
  static get(width = 1, height = 1, xCells = 2, yCells = 2, fromCenter = true, isVertical = false) {
    const rtn = {
      vertices: [],
      indices: [],
      texcoord: [],
      normals: []
    };
    Util.gridVertices(rtn.vertices, width, height, xCells, yCells, fromCenter, isVertical);
    Util.gridIndices(rtn.indices, xCells + 1, yCells + 1, 0, false, true);
    Util.gridTexcoord(rtn.texcoord, xCells + 1, yCells + 1);
    repeatVec(rtn.normals, rtn.vertices.length / 3, 0, 1, 0);
    return rtn;
  }
  static getAlt(width = 1, height = 1, xCells = 2, yCells = 2, fromCenter = true, isVertical = false) {
    const rtn = {
      vertices: [],
      indices: [],
      texcoord: [],
      normals: []
    };
    Util.gridVertices(rtn.vertices, width, height, xCells, yCells, fromCenter, isVertical);
    Util.gridAltIndices(rtn.indices, xCells + 1, yCells + 1, 0, true);
    Util.gridTexcoord(rtn.texcoord, xCells + 1, yCells + 1);
    repeatVec(rtn.normals, rtn.vertices.length / 3, 0, 1, 0);
    return rtn;
  }
}
function repeatVec(out, cnt, x, y, z) {
  for (let i = 0; i < cnt; i++)
    out.push(x, y, z);
}
class Quad {
  static getInterleaved() {
    return {
      indices: [0, 1, 2, 2, 3, 0],
      buffer: [
        -0.5,
        0.5,
        0,
        0,
        0,
        1,
        0,
        0,
        -0.5,
        -0.5,
        0,
        0,
        0,
        1,
        0,
        1,
        0.5,
        -0.5,
        0,
        0,
        0,
        1,
        1,
        1,
        0.5,
        0.5,
        0,
        0,
        0,
        1,
        1,
        0
      ]
    };
  }
  static get(w = 1, h = 1, isPlane = false) {
    const wh = w * 0.5;
    const hh = h * 0.5;
    const rtn = {
      indices: [0, 1, 2, 2, 3, 0],
      texcoord: [0, 0, 0, 1, 1, 1, 1, 0],
      normals: [],
      vertices: []
    };
    if (isPlane) {
      rtn.normals.push(0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0);
      rtn.vertices.push(-wh, 0, hh, -wh, 0, -hh, wh, 0, -hh, wh, 0, hh);
    } else {
      rtn.normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
      rtn.vertices.push(-wh, hh, 0, -wh, -hh, 0, wh, -hh, 0, wh, hh, 0);
    }
    return rtn;
  }
}
class Torus {
  static get(outerRadius = 0.5, outerSteps = 8, innerRadius = 0.15, innerSteps = 6) {
    const rtn = {
      indices: [],
      vertices: [],
      normals: [],
      texcoord: []
    };
    const pv = new Vec3();
    const cv = [0, 0, 0];
    let u_cos, u_sin, v_cos, v_sin;
    let i, j, u = 0, v = 0, jt = 0, ti = 0;
    for (j = 0; j <= innerSteps; j++) {
      jt = j / innerSteps;
      v = jt * Maths.TAU;
      v_cos = Math.cos(v);
      v_sin = Math.sin(v);
      for (i = 0; i <= outerSteps; i++) {
        ti = i / outerSteps;
        u = ti * Maths.TAU;
        u_cos = Math.cos(u);
        u_sin = Math.sin(u);
        cv[0] = outerRadius * u_cos;
        cv[2] = outerRadius * u_sin;
        pv[0] = (outerRadius + innerRadius * v_cos) * u_cos;
        pv[1] = innerRadius * v_sin;
        pv[2] = (outerRadius + innerRadius * v_cos) * u_sin;
        pv.pushTo(rtn.vertices).sub(cv).norm().pushTo(rtn.normals);
        rtn.texcoord.push(ti, jt);
      }
    }
    let a, b, c, d;
    for (j = 1; j <= innerSteps; j++) {
      for (i = 1; i <= outerSteps; i++) {
        a = (outerSteps + 1) * j + i - 1;
        b = (outerSteps + 1) * (j - 1) + i - 1;
        c = (outerSteps + 1) * (j - 1) + i;
        d = (outerSteps + 1) * j + i;
        rtn.indices.push(a, d, c, c, b, a);
      }
    }
    return rtn;
  }
}
class Torusknot {
  static geo(col_cnt = 10, row_cnt = 60, tube_radius = 0.3, curve_p = 2, curve_q = 3, curve_radius = 1) {
    const rtn = {
      vertices: new Array(col_cnt * row_cnt),
      indices: [],
      texcoord: [],
      normals: new Array(col_cnt * row_cnt)
    };
    return rtn;
  }
}
class TerrianCube {
  static get(w = 2, h = 2, d = 1, xCells = 5, yCells = 5, fromCenter = true) {
    const rtn = {
      vertices: [],
      indices: [],
      texcoord: [],
      normals: []
    };
    const botLoop = [];
    const edges = Util.gridEdgeIndices(xCells + 1, yCells + 1);
    Util.gridVertices(rtn.vertices, w, h, xCells, yCells, fromCenter);
    Util.gridAltIndices(rtn.indices, xCells + 1, yCells + 1, 0, true);
    for (let i = 0; i < rtn.vertices.length / 3; i++)
      rtn.normals.push(0, 1, 0);
    Util.shiftVertices(rtn.vertices, [0, d, 0]);
    this.buildEdge(edges[0], rtn, [0, 0, -1], botLoop);
    this.buildEdge(edges[1], rtn, [1, 0, 0], botLoop);
    this.buildEdge(edges[2], rtn, [0, 0, 1], botLoop);
    this.buildEdge(edges[3], rtn, [-1, 0, 0], botLoop);
    this.buildBottomCap(botLoop, rtn);
    return rtn;
  }
  static buildEdge(edge, geo, dir, loop) {
    const verts = geo.vertices;
    const norm = geo.normals;
    const indi = geo.indices;
    const eCnt = edge.length;
    const v = [0, 0, 0];
    let i;
    let a;
    let b;
    let c;
    let d;
    let ii;
    const top = [];
    const bot = [];
    for (i of edge) {
      vec3.fromBuf(verts, i * 3, v);
      top.push(Math.floor(vec3.pushTo(v, verts) / 3));
      v[1] = 0;
      ii = Math.floor(vec3.pushTo(v, verts) / 3);
      bot.push(ii);
      norm.push(dir[0], dir[1], dir[2], dir[0], dir[1], dir[2]);
      loop.push(ii);
    }
    loop.pop();
    for (i = 0; i < eCnt - 1; i++) {
      a = top[i];
      b = bot[i];
      c = bot[i + 1];
      d = top[i + 1];
      indi.push(a, d, c, c, b, a);
    }
  }
  static buildBottomCap(loop, geo) {
    const c = new Vec3();
    const v = new Vec3();
    const idx = [];
    let i;
    for (i of loop) {
      vec3.fromBuf(geo.vertices, i * 3, v);
      vec3.add(c, v);
      idx.push(Math.floor(vec3.pushTo(v, geo.vertices) / 3));
      geo.normals.push(0, -1, 0);
    }
    vec3.divScale(c, loop.length);
    const cIdx = Math.floor(vec3.pushTo(c, geo.vertices) / 3);
    const len = idx.length;
    let ii;
    for (i = 0; i < len; i++) {
      ii = (i + 1) % len;
      geo.indices.push(cIdx, idx[i], idx[ii]);
    }
  }
}
class UniqueVertexGeo {
  constructor() {
    __publicField(this, "map", {});
    __publicField(this, "geo", {
      vertices: [],
      indices: [],
      normals: [],
      texcoord: []
    });
  }
  get vertexCount() {
    return this.geo.vertices.length / 3;
  }
  addTri(a, b, c) {
    const ai = this.addVert(a);
    const bi = this.addVert(b);
    const ci = this.addVert(c);
    this.geo.indices.push(ai, bi, ci);
    return this;
  }
  addVert(v) {
    const x = Math.floor(v[0] * 1e5);
    const y = Math.floor(v[1] * 1e5);
    const z = Math.floor(v[2] * 1e5);
    const k = x + "_" + y + "_" + z;
    if (this.map[k] !== void 0)
      return this.map[k];
    const i = this.geo.vertices.length / 3;
    this.geo.vertices.push(v[0], v[1], v[2]);
    this.map[k] = i;
    return i;
  }
  subdivGeo(geo, div = 2) {
    const a = new Vec3();
    const b = new Vec3();
    const c = new Vec3();
    for (let i = 0; i < geo.indices.length; i += 3) {
      a.fromBuf(geo.vertices, geo.indices[i] * 3);
      b.fromBuf(geo.vertices, geo.indices[i + 1] * 3);
      c.fromBuf(geo.vertices, geo.indices[i + 2] * 3);
      this.subdivTri(a, b, c, div);
    }
    return this;
  }
  subdivTri(a, b, c, div = 2) {
    const irow = [[this.addVert(a)]];
    const seg_a = new Vec3();
    const seg_b = new Vec3();
    const seg_c = new Vec3();
    let i, j, t, row;
    for (i = 1; i <= div; i++) {
      t = i / div;
      seg_b.fromLerp(a, b, t);
      seg_c.fromLerp(a, c, t);
      row = [this.addVert(seg_b)];
      for (j = 1; j < i; j++) {
        t = j / i;
        seg_a.fromLerp(seg_b, seg_c, t);
        row.push(this.addVert(seg_a));
      }
      row.push(this.addVert(seg_c));
      irow.push(row);
    }
    let ra, rb;
    for (i = 1; i < irow.length; i++) {
      ra = irow[i - 1];
      rb = irow[i];
      for (j = 0; j < ra.length; j++) {
        this.geo.indices.push(rb[j], rb[j + 1], ra[j]);
        if (j + 1 < ra.length)
          this.geo.indices.push(ra[j], rb[j + 1], ra[j + 1]);
      }
    }
    return this;
  }
}
class Icosahedron {
  static get(div = 0, radius = 1) {
    const t = (1 + Math.sqrt(5)) / 2;
    const base = {
      texcoord: [],
      normals: [],
      indices: [
        0,
        11,
        5,
        0,
        5,
        1,
        0,
        1,
        7,
        0,
        7,
        10,
        0,
        10,
        11,
        1,
        5,
        9,
        5,
        11,
        4,
        11,
        10,
        2,
        10,
        7,
        6,
        7,
        1,
        8,
        3,
        9,
        4,
        3,
        4,
        2,
        3,
        2,
        6,
        3,
        6,
        8,
        3,
        8,
        9,
        4,
        9,
        5,
        2,
        4,
        11,
        6,
        2,
        10,
        8,
        6,
        7,
        9,
        8,
        1
      ],
      vertices: [
        -1,
        t,
        0,
        1,
        t,
        0,
        -1,
        -t,
        0,
        1,
        -t,
        0,
        0,
        -1,
        t,
        0,
        1,
        t,
        0,
        -1,
        -t,
        0,
        1,
        -t,
        t,
        0,
        -1,
        t,
        0,
        1,
        -t,
        0,
        -1,
        -t,
        0,
        1
      ]
    };
    if (div == 0) {
      Util.normalizeScaleVertices(base, radius, true);
      return base;
    }
    const uvg = new UniqueVertexGeo();
    uvg.subdivGeo(base, div + 1);
    Util.normalizeScaleVertices(uvg.geo, radius, true);
    return uvg.geo;
  }
}
class SuperEllipsoid {
  static pietHeinSuperEgg(geo) {
    return this.from(geo, 1, 0.8, 3, 3, 4);
  }
  static from(geo, ee = 0.5, nn = 0.5, A = 1, B = 1, C = 1) {
    const v = new Vec3();
    const n = new Vec3();
    const config = {
      r: 2 / (2 / ee),
      t: 2 / (2 / nn),
      A,
      B,
      C
    };
    let theta = 0, phi = 0;
    for (let i = 0; i < geo.vertices.length; i += 3) {
      v.fromBuf(geo.vertices, i);
      theta = Math.atan2(Math.sqrt(v[0] ** 2 + v[1] ** 2), v.z) + Math.PI * 0.5;
      phi = Math.atan2(v[1], v[0]);
      this.calcPoint(theta, phi, config, v);
      v.toBuf(geo.vertices, i);
      this.calcNormal(theta, phi, config, n);
      n.toBuf(geo.normals, i);
    }
    return geo;
  }
  static c(w, m) {
    const cv = Math.cos(w);
    return Math.sign(cv) * Math.abs(cv) ** m;
  }
  static s(w, m) {
    const sv = Math.sin(w);
    return Math.sign(sv) * Math.abs(sv) ** m;
  }
  static calcPoint(theta, phi, config, v) {
    const theta_c_t = this.c(theta, config.t);
    v[0] = config.A * theta_c_t * this.c(phi, config.r);
    v[1] = config.C * this.s(theta, config.t);
    v[2] = config.B * theta_c_t * this.s(phi, config.r);
    return v;
  }
  static calcNormal(theta, phi, config, n) {
    const e = 1e-5;
    const a = new Vec3();
    const b = new Vec3();
    const c = new Vec3();
    this.calcPoint(theta, phi, config, a);
    this.calcPoint(theta + e, phi, config, b);
    this.calcPoint(theta, phi + e, config, c);
    b.sub(a);
    c.sub(a);
    return n.fromCross(b, c);
  }
}
class Tetrahedron {
  static get(div = 0, radius = 1) {
    const base = {
      texcoord: [],
      normals: [],
      indices: [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1],
      vertices: [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1]
    };
    if (div == 0) {
      Util.normalizeScaleVertices(base, radius, true);
      return base;
    }
    const uvg = new UniqueVertexGeo();
    uvg.subdivGeo(base, div + 1);
    Util.normalizeScaleVertices(uvg.geo, radius, true);
    return uvg.geo;
  }
}
class UVSphere {
  static get(radius = 0.5, latSteps = 10, lngSteps = 10) {
    let s_lat, c_lat, s_lng, c_lng, x, y, z, i, j, len, tj, ti;
    let lon = 0;
    let lat = 0;
    const latRng = Maths.TAU;
    const lngRng = Math.PI;
    const rtn = {
      vertices: [],
      indices: [],
      texcoord: [],
      normals: []
    };
    Util.gridIndices(rtn.indices, lngSteps + 1, latSteps + 1, 0, false, true);
    for (j = 0; j <= latSteps; j++) {
      tj = j / latSteps;
      lat = latRng * tj;
      s_lat = Math.sin(lat);
      c_lat = Math.cos(lat);
      for (i = 0; i <= lngSteps; i++) {
        ti = i / lngSteps;
        lon = lngRng * ti;
        s_lng = Math.sin(lon);
        c_lng = Math.cos(lon);
        x = radius * s_lng * c_lat;
        z = radius * s_lng * s_lat;
        y = radius * c_lng;
        rtn.vertices.push(x, y, z);
        len = 1 / Math.sqrt(x * x + y * y + z * z);
        rtn.normals.push(x * len, y * len, z * len);
        rtn.texcoord.push(ti, 1 - tj);
      }
    }
    return rtn;
  }
}
export { Capsule, Cube, Cylinder, Grid, Icosahedron, Quad, UVSphere as Sphere, SuperEllipsoid, TerrianCube as TerrainCube, Tetrahedron, Torus, Torusknot as TorusKnot, UniqueVertexGeo, Util };
