"""Build an original, compact laptop asset and export it as a Y-up GLB.

Run with the Blender executable in background mode:
    Blender --background --python scripts/build-laptop.py
"""

from __future__ import annotations

import math
import json
import os
import sys
from pathlib import Path

import bpy
from mathutils import Vector


PROJECT_ROOT = Path(__file__).resolve().parents[1]
MODEL_PATH = PROJECT_ROOT / "public" / "models" / "laptop.glb"
FALLBACK_PATH = PROJECT_ROOT / "public" / "models" / "laptop-fallback.webp"
BLEND_PATH = PROJECT_ROOT / ".evidence" / "narrative-build" / "laptop.blend"
RENDER_PATH = PROJECT_ROOT / ".evidence" / "narrative-build" / "render.png"


def clear_scene() -> None:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for datablocks in (bpy.data.meshes, bpy.data.curves, bpy.data.cameras, bpy.data.lights, bpy.data.materials):
        for datablock in list(datablocks):
            if datablock.users == 0:
                datablocks.remove(datablock)


def material(name: str, color: tuple[float, float, float, float], metallic: float, roughness: float, emission: tuple[float, float, float, float] | None = None, emission_strength: float = 0.0) -> bpy.types.Material:
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = color
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    output = nodes.new("ShaderNodeOutputMaterial")
    shader = nodes.new("ShaderNodeBsdfPrincipled")
    shader.inputs["Base Color"].default_value = color
    shader.inputs["Metallic"].default_value = metallic
    shader.inputs["Roughness"].default_value = roughness
    if emission is not None:
        emission_input = shader.inputs.get("Emission Color") or shader.inputs.get("Emission")
        if emission_input is not None:
            emission_input.default_value = emission
        strength_input = shader.inputs.get("Emission Strength")
        if strength_input is not None:
            strength_input.default_value = emission_strength
    links.new(shader.outputs["BSDF"], output.inputs["Surface"])
    return mat


def rounded_cube(
    name: str,
    location: tuple[float, float, float],
    dimensions: tuple[float, float, float],
    mat: bpy.types.Material,
    bevel: float = 0.08,
    segments: int = 2,
    parent: bpy.types.Object | None = None,
) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = name
    obj.dimensions = dimensions
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    modifier = obj.modifiers.new("Soft machined edges", "BEVEL")
    modifier.width = min(bevel, min(dimensions) * 0.46)
    modifier.segments = segments
    modifier.limit_method = "ANGLE"
    obj.data.materials.append(mat)
    if parent is not None:
        obj.parent = parent
        obj.location = location
    return obj


def duplicate_with_location(prototype: bpy.types.Object, name: str, location: tuple[float, float, float], parent: bpy.types.Object | None = None) -> bpy.types.Object:
    obj = prototype.copy()
    obj.data = prototype.data
    bpy.context.collection.objects.link(obj)
    obj.name = name
    if parent is None:
        obj.location = location
    else:
        obj.parent = parent
        obj.location = location
    return obj


def cylinder(name: str, location: tuple[float, float, float], radius: float, depth: float, mat: bpy.types.Material, parent: bpy.types.Object | None = None) -> bpy.types.Object:
    bpy.ops.mesh.primitive_cylinder_add(vertices=16, radius=radius, depth=depth, location=location, rotation=(0.0, math.pi / 2.0, 0.0))
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    bevel = obj.modifiers.new("Hinge edge softening", "BEVEL")
    bevel.width = 0.035
    bevel.segments = 2
    if parent is not None:
        obj.parent = parent
        obj.location = location
    return obj


def add_area_light(name: str, location: tuple[float, float, float], energy: float, size: float, color: tuple[float, float, float]) -> bpy.types.Object:
    data = bpy.data.lights.new(name, type="AREA")
    data.energy = energy
    data.shape = "DISK"
    data.size = size
    data.color = color
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    return obj


def aim_at(obj: bpy.types.Object, target: tuple[float, float, float]) -> None:
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def world_bounds(obj: bpy.types.Object) -> tuple[Vector, Vector]:
    corners = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    return (
        Vector((min(corner.x for corner in corners), min(corner.y for corner in corners), min(corner.z for corner in corners))),
        Vector((max(corner.x for corner in corners), max(corner.y for corner in corners), max(corner.z for corner in corners))),
    )


def bounds_union(objects: list[bpy.types.Object]) -> tuple[Vector, Vector]:
    bounds = [world_bounds(obj) for obj in objects]
    return (
        Vector((min(pair[0].x for pair in bounds), min(pair[0].y for pair in bounds), min(pair[0].z for pair in bounds))),
        Vector((max(pair[1].x for pair in bounds), max(pair[1].y for pair in bounds), max(pair[1].z for pair in bounds))),
    )


def apply_bevels_and_join(objects: list[bpy.types.Object], joined_name: str, part_description: str) -> bpy.types.Object:
    """Apply static bevels, then join world-preserving meshes into one draw call."""
    if not objects:
        raise RuntimeError(f"Cannot join empty object group: {joined_name}")
    source_names = [obj.name for obj in objects]
    for obj in objects:
        if obj.type != "MESH":
            raise RuntimeError(f"Non-mesh object in {joined_name}: {obj.name}")
        if obj.data.users > 1:
            obj.data = obj.data.copy()
        bpy.ops.object.select_all(action="DESELECT")
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        for modifier in list(obj.modifiers):
            if modifier.type in {"BEVEL", "WEIGHTED_NORMAL"}:
                bpy.ops.object.modifier_apply(modifier=modifier.name)

    bpy.ops.object.select_all(action="DESELECT")
    for obj in objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    joined = bpy.context.object
    joined.name = joined_name
    joined["part"] = part_description
    joined["merged_from"] = ",".join(source_names)
    joined["static_geometry_optimization"] = "Bevels applied and meshes joined; world bounds preserved."
    return joined


def make_camera() -> bpy.types.Object:
    data = bpy.data.cameras.new("Camera_ThreeQuarter")
    camera = bpy.data.objects.new("Camera_ThreeQuarter", data)
    bpy.context.collection.objects.link(camera)
    camera.location = (6.5, -22.8, 11.8)
    data.lens = 48.0
    data.sensor_width = 36.0
    data.clip_start = 0.1
    data.clip_end = 200.0
    aim_at(camera, (0.0, 0.7, 3.0))
    camera["view_description"] = "Camera-ready three-quarter product view from front-right, aimed at the hinge and display."
    camera["position"] = "(6.5, -22.8, 11.8)"
    camera["target"] = "(0.0, 0.7, 3.0)"
    bpy.context.scene.camera = camera
    return camera


def planar_screen(
    name: str,
    location: tuple[float, float, float],
    dimensions: tuple[float, float, float],
    mat: bpy.types.Material,
    parent: bpy.types.Object | None = None,
) -> bpy.types.Object:
    """Create a thin screen box whose visible negative-Y face is one planar quad."""
    half_x, half_y, half_z = (dimension / 2.0 for dimension in dimensions)
    vertices = [
        (-half_x, -half_y, -half_z),
        (half_x, -half_y, -half_z),
        (half_x, -half_y, half_z),
        (-half_x, -half_y, half_z),
        (-half_x, half_y, -half_z),
        (half_x, half_y, -half_z),
        (half_x, half_y, half_z),
        (-half_x, half_y, half_z),
    ]
    faces = [
        (0, 1, 2, 3),  # front: normal points toward Blender negative Y
        (5, 4, 7, 6),  # back
        (0, 4, 5, 1),  # bottom
        (1, 5, 6, 2),  # right
        (3, 2, 6, 7),  # top
        (4, 0, 3, 7),  # left
    ]
    mesh = bpy.data.meshes.new(f"{name}Mesh")
    mesh.from_pydata(vertices, [], faces)
    mesh.validate(verbose=False)
    mesh.update()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    if parent is not None:
        obj.parent = parent
        obj.location = location
    obj.data.materials.append(mat)
    return obj


def assign_screen_front_uv(obj: bpy.types.Object) -> None:
    """Map the negative-Y face as an upright full-frame UV."""
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    mesh = obj.data
    uv_layer = mesh.uv_layers.active or mesh.uv_layers.new(name="UVMap")
    front_faces = [polygon for polygon in mesh.polygons if polygon.normal.y < -0.9]
    if not front_faces:
        raise RuntimeError("ScreenDisplay has no negative-Y front face for UV mapping")
    front_vertices = [mesh.vertices[index].co for polygon in front_faces for index in polygon.vertices]
    min_x = min(vertex.x for vertex in front_vertices)
    max_x = max(vertex.x for vertex in front_vertices)
    min_z = min(vertex.z for vertex in front_vertices)
    max_z = max(vertex.z for vertex in front_vertices)
    x_span = max_x - min_x
    z_span = max_z - min_z
    if x_span <= 0.0 or z_span <= 0.0:
        raise RuntimeError("ScreenDisplay front face has invalid planar UV extents")

    # Put the top at V=0 in Blender. The glTF exporter flips the V coordinate;
    # the runtime CanvasTexture uses flipY=true to keep the editor upright.
    for polygon in front_faces:
        for loop_index in polygon.loop_indices:
            vertex = mesh.vertices[mesh.loops[loop_index].vertex_index].co
            u = (vertex.x - min_x) / x_span
            v = (max_z - vertex.z) / z_span
            uv_layer.data[loop_index].uv = (u, v)
    mesh.update()
    obj["uv_mapping"] = "Negative-Y planar front: U=(X-minX)/(maxX-minX), V=(maxZ-Z)/(maxZ-minZ); top=V0, bottom=V1."
    obj["uv_range"] = "U 0..1, V 0..1 across the visible front screen surface"
    obj["canvas_texture_flipY"] = True
    obj["canvas_texture_flipY_expectation"] = "Set THREE.CanvasTexture.flipY = true when replacing ScreenDisplay material through GLTFLoader; draw the canvas upright from its top-left origin."


def rounded_slab(name, location, dimensions, mat, radius=.2, plane='XY', parent=None):
    """Extrude a rounded outline, so corner radius is independent of thickness."""
    w, d, h = dimensions
    outline_h = d if plane == 'XY' else h
    thickness = h if plane == 'XY' else d
    r = min(radius, w/2, outline_h/2)
    outline=[]
    for cx,cy,start in [(w/2-r,outline_h/2-r,0),(-w/2+r,outline_h/2-r,90),(-w/2+r,-outline_h/2+r,180),(w/2-r,-outline_h/2+r,270)]:
        for step in range(13):
            angle=math.radians(start+step*90/12)
            outline.append((cx+r*math.cos(angle),cy+r*math.sin(angle)))
    n=len(outline)
    verts=[]
    for t in [-thickness/2,thickness/2]:
        verts += [(x,y,t) if plane=='XY' else (x,t,y) for x,y in outline]
    faces=[tuple(reversed(range(n))),tuple(range(n,2*n))]
    faces += [(j,(j+1)%n,(j+1)%n+n,j+n) for j in range(n)]
    if plane=='XZ': faces=[tuple(reversed(face)) for face in faces]
    mesh=bpy.data.meshes.new(name+'Mesh');mesh.from_pydata(verts,[],faces);mesh.update()
    obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj)
    obj.location=location;obj.data.materials.append(mat)
    if parent: obj.parent=parent;obj.location=location
    bevel=obj.modifiers.new('Soft perimeter edge','BEVEL');bevel.width=min(.045,thickness*.22);bevel.segments=3
    for polygon in mesh.polygons: polygon.use_smooth=polygon.index>=2
    normals=obj.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL');normals.keep_sharp=True
    return obj


def build_model() -> list[bpy.types.Object]:
    """Modern Air proportions; one model unit represents roughly 25 mm."""
    metal = material("Midnight Aluminum", (0.038, 0.043, 0.053, 1), 0.72, 0.38)
    edge = material("Midnight Edge", (0.010, 0.014, 0.021, 1), 0.65, 0.3)
    bezel = material("Obsidian Bezel", (0.0005, 0.0006, 0.0008, 1), 0, 1)
    bezel.node_tree.nodes.get("Principled BSDF").inputs["Specular IOR Level"].default_value = 0.05
    black = material("Keyboard Black", (0.002, 0.0025, 0.003, 1), 0.0, 0.78)
    legend = material("Key Legends", (0.55, 0.59, 0.66, 1), 0.1, 0.5)
    glass = material("ScreenDisplay Material", (0.006, 0.009, 0.015, 1), 0.1, 0.3)
    floor_mat = material("Studio Floor", (0.008, 0.011, 0.016, 1), 0.1, 0.4)
    base = rounded_slab("BaseChassis", (0, .03, .20), (12.2, 8.0, .38), metal, .48)
    rounded_slab("KeyboardDeckInset", (0, 1.04, .397), (11.10, 4.08, .03), edge, .20)
    rounded_cube("FrontOpeningRecess", (0, -3.94, .27), (1.9, .065, .12), black, .05, 4)
    hinge = bpy.data.objects.new("ScreenHingeRoot", None)
    bpy.context.collection.objects.link(hinge)
    hinge.location = (0, 3.91, .40)
    hinge.rotation_euler.x = math.radians(-12)
    hinge["hinge_angle_degrees"] = 102
    lid = rounded_slab("ScreenBackShell", (0, 0, 3.88), (12.2, .16, 7.76), metal, .38, "XZ", hinge)
    # Recessed Apple silhouette, cut into the outside of the lid (not a decal).
    contours=json.loads((PROJECT_ROOT/'scripts/apple-logo-contours.json').read_text())
    from mathutils.geometry import tessellate_polygon
    logo_mat=material('Recessed Apple Mark',(.004,.006,.009,1),.65,.2)
    for index, contour in enumerate(contours):
        ring=[Vector(((12-x)*.078, (12-y)*.078, 0)) for x,y in contour]
        n=len(ring);vertices=[]
        for depth in [.055,.14]:
            vertices += [(v.x,depth,v.y+3.95) for v in ring]
        triangles=tessellate_polygon([ring]);faces=[]
        for triangle in triangles:
            ids=list(triangle)
            faces.append(tuple(reversed(ids)));faces.append(tuple(j+n for j in ids))
        faces += [(j,(j+1)%n,(j+1)%n+n,j+n) for j in range(n)]
        mesh=bpy.data.meshes.new('LogoCutMesh');mesh.from_pydata(vertices,[],faces);mesh.update()
        cutter=bpy.data.objects.new('LogoCutter',mesh);bpy.context.collection.objects.link(cutter)
        cutter.parent=hinge
        bpy.context.view_layer.update()
        bpy.ops.object.select_all(action='DESELECT');lid.select_set(True);bpy.context.view_layer.objects.active=lid
        for modifier in list(lid.modifiers): bpy.ops.object.modifier_apply(modifier=modifier.name)
        modifier=lid.modifiers.new('Engraved Apple silhouette','BOOLEAN');modifier.operation='DIFFERENCE';modifier.object=cutter
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        bpy.data.objects.remove(cutter,do_unlink=True)
        inset_vertices=[(v.x,.056,v.y+3.95) for v in ring]
        inset_faces=[tuple(tri) for tri in triangles]
        inset_mesh=bpy.data.meshes.new('AppleInsetMesh');inset_mesh.from_pydata(inset_vertices,[],inset_faces);inset_mesh.update()
        inset=bpy.data.objects.new(f'AppleMark_{index}',inset_mesh);bpy.context.collection.objects.link(inset);inset.parent=hinge;inset.data.materials.append(logo_mat)
    rounded_slab("DisplayBezel", (0, -.091, 3.88), (12.04, .035, 7.58), bezel, .32, "XZ", hinge)
    display = rounded_slab("ScreenDisplay", (0, -.12, 3.96), (11.82, .025, 7.12), glass, .24, "XZ", hinge)
    assign_screen_front_uv(display)
    display["replaceable_texture_surface"] = True
    rounded_slab("CameraNotch", (0, -.149, 7.365), (1.32, .035, .34), bezel, .09, "XZ", hinge)
    lens = material("Camera Lens", (.018, .027, .05, 1), .3, .2)
    rounded_cube("CameraLens", (0, -.171, 7.37), (.075, .008, .075), lens, .004, 4, hinge)
    bridge = rounded_cube("HingeBridge", (0, 3.88, .39), (10.6, .32, .23), edge, .1, 4)

    keys = []
    labels = []
    rows = [list('1234567890-=')+['delete'], ['tab']+list('qwertyuiop')+['[',']'], ['caps']+list('asdfghjkl')+[';',"'",'return'], ['shift']+list('zxcvbnm')+[',','.','/','shift']]
    for row in range(6):
        y = 2.66 - row * .64
        if row == 0:
            entries = ['esc'] + [f'F{i}' for i in range(1,13)]
        elif row < 5:
            entries = rows[row-1]
        else:
            entries = ['fn','ctrl','opt','cmd','space','cmd','opt','←','↑','↓','→']
        if row == 5:
            widths = [.65,.65,.65,.85,4.05,.85,.65,.45,.45,.45,.45]
        else:
            widths = [.75]*len(entries)
            widths[0] = 1.05 if row > 1 else .75
            widths[-1] = 1.05 if row > 0 else .75
        gap = .065
        total = sum(widths) + gap*(len(widths)-1)
        x = -total/2
        for col,(label,width) in enumerate(zip(entries,widths)):
            cx=x+width/2
            keys.append(rounded_slab(f'Key_{row}_{col}', (cx,y,.434), (width,.52,.055), black,.09))
            if label != 'space':
                curve=bpy.data.curves.new(f'Legend_{row}_{col}',type='FONT')
                curve.body=label;curve.align_x='CENTER';curve.align_y='CENTER';curve.size=.105 if len(label)>1 else .16
                obj=bpy.data.objects.new(curve.name,curve);bpy.context.collection.objects.link(obj)
                obj.location=(cx,y,.465);obj.data.materials.append(legend)
                bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj
                bpy.ops.object.convert(target='MESH');labels.append(bpy.context.object)
            x += width+gap
    apply_bevels_and_join(keys,'KeyboardKeycaps','six keyboard rows with separate spacebar')
    apply_bevels_and_join(labels,'KeyboardLegends','quiet key legends')
    trackpad_mat = material('Trackpad Glass', (.026,.032,.042,1), .35, .46)
    trackpad = rounded_slab('Trackpad',(0,-2.6,.398),(5.35,2.45,.025),trackpad_mat,.18)
    # Air speakers sit along the hinge; no retro speaker grilles beside the keys.
    # Real sidewall recesses; the dark interior sits inside the chassis, not on it.
    bpy.ops.object.select_all(action='DESELECT')
    base.select_set(True)
    bpy.context.view_layer.objects.active = base
    for modifier in list(base.modifiers):
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    def cut_port(cutter):
        bpy.ops.object.select_all(action='DESELECT')
        cutter.select_set(True)
        bpy.context.view_layer.objects.active = cutter
        for modifier in list(cutter.modifiers):
            bpy.ops.object.modifier_apply(modifier=modifier.name)
        bpy.context.view_layer.objects.active = base
        modifier = base.modifiers.new('Recessed side port', 'BOOLEAN')
        modifier.operation = 'DIFFERENCE'
        modifier.object = cutter
        bpy.ops.object.modifier_apply(modifier=modifier.name)
        bpy.data.objects.remove(cutter, do_unlink=True)
    for name, y, width in [('MagSafe', 3.18, .57), ('USB_C_0', 2.40, .37), ('USB_C_1', 1.77, .37)]:
        cut_port(rounded_cube(name+'Cutter',(-6.1,y,.21),(.42,width,.145),black,.065,8))
        rounded_cube(name,(-5.925,y,.21),(.012,width-.04,.115),black,.05,6)
        if name.startswith('USB'):
            rounded_cube(name+'Tongue',(-6.005,y,.21),(.10,width-.10,.028),edge,.012,4)
        else:
            for contact in range(5):
                rounded_cube('MagSafeContact'+str(contact),(-6.015,y+(contact-2)*.08,.21),(.04,.034,.035),legend,.012,4)
    cut_port(cylinder('HeadphoneCutter',(6.1,2.65,.21),.073,.42,black))
    cylinder('HeadphoneJack',(5.925,2.65,.21),.063,.015,black)
    base['recessed_ports'] = 'MagSafe 3, two USB-C, 3.5mm headphone'
    bpy.context.view_layer.update()
    # Focused geometry invariants protect the connected hinge and palm-rest space.
    bmin,bmax=world_bounds(base);hmin,hmax=world_bounds(bridge);smin,smax=world_bounds(lid)
    def overlap(a,b,c,d):
        return all(a[i] <= d[i] and c[i] <= b[i] for i in range(3))
    assert overlap(bmin,bmax,hmin,hmax), 'Hinge must meet base'
    assert overlap(hmin,hmax,smin,smax), 'Hinge must meet screen'
    assert base.dimensions.z < .4, 'Slim chassis'
    assert trackpad.location.y + trackpad.dimensions.y/2 < -.80, 'Trackpad clears keyboard'
    assert display.parent == hinge and lid.parent == hinge, 'Display moves with lid'
    ground=rounded_cube('StudioFloor',(0,0,-.12),(33,30,.16),floor_mat,.04,2)
    ground['exclude_from_model_export']=True
    scene=bpy.context.scene
    scene['asset_name']='Midnight Air-style hinged laptop'
    scene['connected_geometry_check']='PASS: hinge overlaps base and lid'
    scene['design_notes']='Thin flat chassis, narrow bezel, camera notch, six keyboard rows, large trackpad; original Blender geometry.'
    print('GEOMETRY_CHECKS=PASS: slim chassis, connected hinge, clear trackpad, parented screen')
    return [obj for obj in scene.objects if obj.type=='MESH' and obj!=ground]

def configure_render() -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = str(RENDER_PATH)
    scene.render.film_transparent = False
    scene.render.image_settings.color_mode = "RGBA"
    scene.view_settings.look = "AgX - Medium High Contrast"
    world = bpy.data.worlds.new("Laptop Studio World") if bpy.data.worlds.get("Laptop Studio World") is None else bpy.data.worlds["Laptop Studio World"]
    scene.world = world
    world.use_nodes = True
    background = world.node_tree.nodes.get("Background")
    if background is not None:
        background.inputs["Color"].default_value = (0.004, 0.007, 0.012, 1.0)
        background.inputs["Strength"].default_value = 0.22

    key = add_area_light("KeyLight", (5.5, -8.0, 14.0), 1250.0, 6.0, (0.78, 0.88, 1.0))
    aim_at(key, (0.0, 1.0, 2.5))
    fill = add_area_light("FillLight", (-8.0, -3.0, 7.0), 820.0, 5.0, (0.45, 0.62, 1.0))
    aim_at(fill, (0.0, 0.5, 2.5))
    rim = add_area_light("RimLight", (6.0, 8.0, 12.0), 1450.0, 4.0, (0.55, 0.72, 1.0))
    aim_at(rim, (0.0, 2.8, 4.4))
    screen_light = add_area_light("ScreenGlow", (0.0, 2.0, 4.0), 80.0, 2.0, (0.15, 0.32, 0.72))
    aim_at(screen_light, (0.0, 3.5, 4.0))


def fallback_principled(name: str, color: tuple[float, float, float, float], emission_strength: float = 0.0) -> bpy.types.Material:
    return material(name, color, metallic=0.1, roughness=0.32, emission=color, emission_strength=emission_strength)


def add_fallback_text(
    name: str,
    body: str,
    location: tuple[float, float, float],
    size: float,
    mat: bpy.types.Material,
    parent: bpy.types.Object,
) -> bpy.types.Object:
    data = bpy.data.curves.new(name, type="FONT")
    data.body = body
    data.align_x = "LEFT"
    data.align_y = "CENTER"
    data.size = size
    data.space_character = 1.0
    data.extrude = 0.0
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    obj.rotation_euler[0] = math.radians(90.0)
    obj.parent = parent
    obj.location = location
    return obj


def add_fallback_editor_overlay(screen_root: bpy.types.Object) -> list[bpy.types.Object]:
    """Use the same screen artwork as Three.js; restore Blender's UV convention."""
    display = bpy.data.objects['ScreenDisplay']
    mat = bpy.data.materials.new('Fallback Screen Artwork')
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    nodes.clear()
    output = nodes.new('ShaderNodeOutputMaterial')
    emission = nodes.new('ShaderNodeEmission')
    image = nodes.new('ShaderNodeTexImage')
    image.image = bpy.data.images.load(str(PROJECT_ROOT / 'public/models/laptop-screen.png'))
    uv = nodes.new('ShaderNodeTexCoord')
    mapping = nodes.new('ShaderNodeVectorMath'); mapping.operation = 'MULTIPLY_ADD'
    mapping.inputs[1].default_value = (1, -1, 1)
    mapping.inputs[2].default_value = (0, 1, 0)
    mat.node_tree.links.new(uv.outputs['UV'], mapping.inputs[0])
    mat.node_tree.links.new(mapping.outputs[0], image.inputs['Vector'])
    mat.node_tree.links.new(image.outputs['Color'], emission.inputs['Color'])
    mat.node_tree.links.new(emission.outputs[0], output.inputs['Surface'])
    display.data.materials.clear(); display.data.materials.append(mat)
    return []


def brighten_fallback_scene() -> dict[str, object]:
    """Temporarily lift the graphite/silver product lighting for the transparent fallback."""
    scene = bpy.context.scene
    previous: dict[str, object] = {"exposure": scene.view_settings.exposure}
    scene.view_settings.exposure = 0.0
    energies = {"KeyLight": 2300.0, "FillLight": 1650.0, "RimLight": 2600.0, "ScreenGlow": 160.0}
    previous["energies"] = {}
    for name, energy in energies.items():
        light = bpy.data.objects.get(name)
        if light is not None and light.type == "LIGHT":
            previous["energies"][name] = light.data.energy
            light.data.energy = energy
    colors = {
        "Graphite Aluminum": (0.23, 0.28, 0.36, 1.0),
        "Graphite Edge": (0.075, 0.10, 0.15, 1.0),
    }
    previous["materials"] = {}
    for name, color in colors.items():
        mat = bpy.data.materials.get(name)
        if mat is None or not mat.use_nodes:
            continue
        shader = next((node for node in mat.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
        if shader is None:
            continue
        previous["materials"][name] = shader.inputs["Base Color"].default_value[:]
        shader.inputs["Base Color"].default_value = color
        shader.inputs["Metallic"].default_value = 0.68
        shader.inputs["Roughness"].default_value = 0.27
    return previous


def restore_fallback_scene(previous: dict[str, object]) -> None:
    bpy.context.scene.view_settings.exposure = previous["exposure"]
    for name, energy in previous["energies"].items():
        light = bpy.data.objects.get(name)
        if light is not None and light.type == "LIGHT":
            light.data.energy = energy
    for name, color in previous["materials"].items():
        mat = bpy.data.materials.get(name)
        if mat is None or not mat.use_nodes:
            continue
        shader = next((node for node in mat.node_tree.nodes if node.type == "BSDF_PRINCIPLED"), None)
        if shader is not None:
            shader.inputs["Base Color"].default_value = color


def render_transparent_fallback() -> None:
    """Render the model for the web fallback without the studio floor or backdrop."""
    scene = bpy.context.scene
    floor = bpy.data.objects.get("StudioFloor")
    previous_floor_render = floor.hide_render if floor is not None else None
    previous_filepath = scene.render.filepath
    previous_file_format = scene.render.image_settings.file_format
    previous_color_mode = scene.render.image_settings.color_mode
    previous_film_transparent = scene.render.film_transparent
    previous_scene = brighten_fallback_scene()
    screen_root = bpy.data.objects.get("ScreenHingeRoot")
    overlay = add_fallback_editor_overlay(screen_root) if screen_root is not None else []
    try:
        if floor is not None:
            floor.hide_render = True
        scene.render.filepath = str(FALLBACK_PATH)
        scene.render.image_settings.file_format = "WEBP"
        scene.render.image_settings.color_mode = "RGBA"
        scene.render.film_transparent = True
        FALLBACK_PATH.parent.mkdir(parents=True, exist_ok=True)
        bpy.ops.render.render(write_still=True)
        print(f"FALLBACK_PATH={FALLBACK_PATH}")
    finally:
        for obj in overlay:
            bpy.data.objects.remove(obj, do_unlink=True)
        restore_fallback_scene(previous_scene)
        if floor is not None and previous_floor_render is not None:
            floor.hide_render = previous_floor_render
        scene.render.filepath = previous_filepath
        scene.render.image_settings.file_format = previous_file_format
        scene.render.image_settings.color_mode = previous_color_mode
        scene.render.film_transparent = previous_film_transparent


def render_closed_poster() -> None:
    scene = bpy.context.scene
    camera = scene.camera
    hinge = bpy.data.objects['ScreenHingeRoot']
    saved_camera = camera.matrix_world.copy()
    saved_lens = camera.data.lens
    camera.data.lens = 65
    saved_angle = hinge.rotation_euler.x
    saved_height = hinge.location.z
    saved_path = scene.render.filepath
    saved_format = scene.render.image_settings.file_format
    saved_transparent = scene.render.film_transparent
    floor = bpy.data.objects.get('StudioFloor')
    if floor: floor.hide_render = True
    hinge.rotation_euler.x = math.pi / 2
    hinge.location.z += .2
    camera.location = (0, -.7, 24)
    aim_at(camera, (0, 0, .6))
    scene.render.film_transparent = True
    scene.render.image_settings.file_format = 'WEBP'
    scene.render.filepath = str(PROJECT_ROOT / 'public/models/laptop-closed.webp')
    bpy.ops.render.render(write_still=True)
    hinge.rotation_euler.x = saved_angle
    hinge.location.z = saved_height
    camera.matrix_world = saved_camera
    camera.data.lens = saved_lens
    scene.render.filepath = saved_path
    scene.render.image_settings.file_format = saved_format
    scene.render.film_transparent = saved_transparent
    if floor: floor.hide_render = False


def export_model(model_objects: list[bpy.types.Object]) -> None:
    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    BLEND_PATH.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))
    # primitive_cube_add leaves the studio floor selected; rebuild the export
    # selection here so use_selection cannot leak scenery into the GLB. Include
    # the screen assembly's empty parent so its hinge transform is preserved.
    bpy.ops.object.select_all(action="DESELECT")
    export_objects: set[bpy.types.Object] = set()
    for obj in model_objects:
        current: bpy.types.Object | None = obj
        while current is not None:
            export_objects.add(current)
            current = current.parent
    for obj in export_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = next((obj for obj in model_objects if obj.name == "BaseChassis"), model_objects[0])
    print("EXPORT_SELECTION=" + ",".join(sorted(obj.name for obj in export_objects)))
    bpy.ops.export_scene.gltf(
        filepath=str(MODEL_PATH),
        export_format="GLB",
        export_yup=True,
        use_selection=True,
        export_apply=True,
        export_cameras=False,
        export_lights=False,
        export_materials="EXPORT",
        export_image_format="AUTO",
        export_keep_originals=False,
        export_extras=True,
    )


def main() -> None:
    clear_scene()
    model_objects = build_model()
    make_camera()
    configure_render()
    export_model(model_objects)
    add_fallback_editor_overlay(bpy.data.objects["ScreenHingeRoot"])
    bpy.ops.file.pack_all()
    bpy.context.scene.render.filepath = str(RENDER_PATH)
    bpy.ops.render.render(write_still=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))

    render_transparent_fallback()
    render_closed_poster()
    print("LAPTOP_BUILD_COMPLETE")
    print(f"MODEL_PATH={MODEL_PATH}")
    print(f"BLEND_PATH={BLEND_PATH}")
    print(f"RENDER_PATH={RENDER_PATH}")
    print(f"MODEL_OBJECT_COUNT={len(model_objects)}")
    print("MODEL_OBJECT_NAMES=" + ",".join(obj.name for obj in model_objects))
    print("EXPORT_ORIENTATION=Y-up (export_yup=True)")
    print("CONNECTED_GEOMETRY=PASS (HingeBridge overlaps BaseChassis and ScreenBackShell)")


if __name__ == "__main__":
    if "--fallback-only" in sys.argv:
        render_transparent_fallback()
    else:
        main()
