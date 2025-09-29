import {AbstractApi} from "./abstract.api";
import {Mesh as MeshFactory} from "../core/factory/mesh/factory.mesh";
import {GeometryArgs} from "../../types/config/type.geometry-args";

export class Geometry extends AbstractApi{

  public addCube = (args: GeometryArgs) => {
    const mesh = MeshFactory.makeCube(
      args.width as number,
      args.height as number,
      args.depth as number,
      args.widthSegments as number,
      args.heightSegments as number,
      args.depthSegments as number
    );

    mesh.name = args.name as string;

    this.editor.addMesh(mesh);
  }

  public addSphere = (args: GeometryArgs) => {
    const mesh = MeshFactory.makeSphere(
      args.radius as number,
      args.widthSegments as number,
      args.heightSegments as number
    );

    mesh.name = args.name as string;

    this.editor.addMesh(mesh);
  }

  public addCylinder = (args: GeometryArgs) => {
    const mesh = MeshFactory.makeCylinder(
      args.radiusTop as number,
      args.radiusBottom as number,
      args.height as number,
      args.radialSegments as number,
      args.heightSegments as number
    );

    mesh.name = args.name as string;

    this.editor.addMesh(mesh);
  }

  public addCone = (args: GeometryArgs) => {
    const mesh = MeshFactory.makeCone(
      args.radius as number,
      args.height as number,
      args.radialSegments as number,
      args.heightSegments as number
    );

    mesh.name = args.name as string;

    this.editor.addMesh(mesh);
  }
}
