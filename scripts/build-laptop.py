"""Build an original, compact laptop asset and export it as a Y-up GLB.

Run with the Blender executable in background mode:
    Blender --background --python scripts/build-laptop.py
"""

from __future__ import annotations

import math
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
            if modifier.type == "BEVEL":
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
    camera.location = (15.8, -18.8, 12.6)
    data.lens = 54.0
    data.sensor_width = 36.0
    data.clip_start = 0.1
    data.clip_end = 200.0
    aim_at(camera, (0.0, 0.7, 3.0))
    camera["view_description"] = "Camera-ready three-quarter product view from front-right, aimed at the hinge and display."
    camera["position"] = "(15.8, -18.8, 12.6)"
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


def build_model() -> list[bpy.types.Object]:
    graphite = material("Graphite Aluminum", (0.075, 0.095, 0.12, 1.0), 0.82, 0.25)
    graphite_edge = material("Graphite Edge", (0.035, 0.045, 0.06, 1.0), 0.72, 0.22)
    key_material = material("Recessed Keycaps", (0.012, 0.017, 0.024, 1.0), 0.28, 0.31)
    key_side = material("Key Shadow", (0.004, 0.006, 0.009, 1.0), 0.08, 0.4)
    screen_material = material("ScreenDisplay Material", (0.006, 0.018, 0.032, 1.0), 0.22, 0.16, (0.006, 0.028, 0.052, 1.0), 0.28)
    slot_material = material("Speaker Slots", (0.003, 0.004, 0.006, 1.0), 0.05, 0.32)
    floor_material = material("Studio Floor", (0.008, 0.011, 0.016, 1.0), 0.15, 0.32)

    base = rounded_cube("BaseChassis", (0.0, 0.0, 0.38), (13.4, 8.6, 0.72), graphite, bevel=0.28, segments=3)
    base["part"] = "machined graphite aluminum base"
    base["dimensions_mm"] = "340 x 218 x 18"
    deck = rounded_cube("KeyboardDeckInset", (0.0, 0.70, 0.735), (11.75, 4.25, 0.07), graphite_edge, bevel=0.11, segments=2)
    deck["part"] = "recessed keyboard well"
    front_lip = rounded_cube("FrontPalmrestLip", (0.0, -3.94, 0.48), (12.9, 0.20, 0.32), graphite_edge, bevel=0.08, segments=2)

    screen_root = bpy.data.objects.new("ScreenHingeRoot", None)
    bpy.context.collection.objects.link(screen_root)
    screen_root.location = (0.0, 3.52, 0.72)
    screen_root.rotation_euler[0] = math.radians(-7.0)
    screen_root["part"] = "hinged screen assembly"
    screen_root["hinge_angle_degrees"] = 107.0

    screen_back = rounded_cube("ScreenBackShell", (0.0, 0.0, 3.73), (12.3, 0.44, 7.46), graphite, bevel=0.22, segments=3, parent=screen_root)
    screen_back["part"] = "screen rear shell"
    bezel_plate = rounded_cube("DisplayBezel", (0.0, -0.245, 3.73), (11.96, 0.08, 7.12), graphite_edge, bevel=0.16, segments=2, parent=screen_root)
    display = planar_screen("ScreenDisplay", (0.0, -0.30, 3.88), (10.76, 0.045, 5.92), screen_material, parent=screen_root)
    assign_screen_front_uv(display)
    display["replaceable_texture_surface"] = True
    display["surface_role"] = "dark emissive display placeholder"
    display["texture_replacement_hint"] = "Replace the material on ScreenDisplay while preserving its object name."

    bezel_top = rounded_cube("BezelTop", (0.0, -0.305, 6.97), (11.38, 0.055, 0.26), graphite_edge, bevel=0.05, segments=2, parent=screen_root)
    bezel_bottom = rounded_cube("BezelBottom", (0.0, -0.305, 0.73), (11.38, 0.055, 0.26), graphite_edge, bevel=0.05, segments=2, parent=screen_root)
    bezel_left = rounded_cube("BezelLeft", (-5.68, -0.305, 3.85), (0.25, 0.055, 6.20), graphite_edge, bevel=0.05, segments=2, parent=screen_root)
    bezel_right = rounded_cube("BezelRight", (5.68, -0.305, 3.85), (0.25, 0.055, 6.20), graphite_edge, bevel=0.05, segments=2, parent=screen_root)
    for obj in (bezel_top, bezel_bottom, bezel_left, bezel_right):
        obj["part"] = "display bezel"

    hinge_parts: list[bpy.types.Object] = []
    for side, x in (("L", -4.45), ("R", 4.45)):
        block = rounded_cube(f"HingeBridge_{side}", (x, 3.48, 0.91), (0.82, 0.78, 0.45), graphite_edge, bevel=0.10, segments=2)
        block["part"] = "hinge bridge physically overlapping base and screen shell"
        barrel = cylinder(f"HingeBarrel_{side}", (x, 3.42, 0.93), 0.22, 1.12, key_side)
        barrel["part"] = "hinge barrel"
        hinge_parts.extend((block, barrel))

    keyboard_objects: list[bpy.types.Object] = []
    key_prototype: bpy.types.Object | None = None
    row_y = (1.86, 1.02, 0.18, -0.66, -1.50)
    for row, y in enumerate(row_y, start=1):
        columns = 13 if row != 5 else 11
        spacing = 0.84
        x_offset = -((columns - 1) * spacing) / 2.0
        for col in range(columns):
            x = x_offset + col * spacing
            width = 0.72
            if row == 5 and col in (0, columns - 1):
                width = 1.05
            if key_prototype is None:
                key_prototype = rounded_cube("Key_R01C01", (x, y, 0.785), (width, 0.62, 0.12), key_material, bevel=0.09, segments=2)
                key_prototype["part"] = "individual recessed keycap"
                key_prototype["row"] = row
                key_prototype["column"] = col + 1
                key_obj = key_prototype
            else:
                key_obj = duplicate_with_location(key_prototype, f"Key_R{row:02d}C{col + 1:02d}", (x, y, 0.785))
                key_obj["part"] = "individual recessed keycap"
                key_obj["row"] = row
                key_obj["column"] = col + 1
                key_obj.dimensions = (width, 0.62, 0.12)
            keyboard_objects.append(key_obj)

    spacebar = rounded_cube("Key_Spacebar", (0.0, -1.51, 0.785), (4.35, 0.64, 0.12), key_material, bevel=0.09, segments=2)
    spacebar["part"] = "individual recessed spacebar"
    keyboard_objects.append(spacebar)

    trackpad = rounded_cube("Trackpad", (0.0, -2.62, 0.745), (4.15, 1.95, 0.09), key_side, bevel=0.16, segments=3)
    trackpad["part"] = "recessed glass trackpad"
    trackpad["gesture_surface"] = True

    speaker_objects: list[bpy.types.Object] = []
    for side, x in (("L", -5.78), ("R", 5.78)):
        for slot_index in range(7):
            y = -2.18 + slot_index * 0.36
            slot = rounded_cube(f"SpeakerSlot_{side}{slot_index + 1:02d}", (x, y, 0.755), (0.22, 0.22, 0.065), slot_material, bevel=0.065, segments=2)
            slot["part"] = "recessed speaker slot"
            speaker_objects.append(slot)

    keycap_objects = [obj for obj in keyboard_objects]
    speaker_objects_before_join = [obj for obj in speaker_objects]
    keycap_bounds_before = bounds_union(keycap_objects)
    speaker_bounds_before = bounds_union(speaker_objects_before_join)
    joined_keycaps = apply_bevels_and_join(keycap_objects, "KeyboardKeycaps", "static recessed keycaps and spacebar")
    joined_speakers = apply_bevels_and_join(speaker_objects_before_join, "SpeakerSlots", "static recessed speaker slots")
    keycap_bounds_after = world_bounds(joined_keycaps)
    speaker_bounds_after = world_bounds(joined_speakers)
    bound_tolerance = 1e-5
    for label, before, after in (
        ("KEYCAPS", keycap_bounds_before, keycap_bounds_after),
        ("SPEAKERS", speaker_bounds_before, speaker_bounds_after),
    ):
        if any(abs(before[side][index] - after[side][index]) > bound_tolerance for side in (0, 1) for index in range(3)):
            raise RuntimeError(f"{label} world bounds changed during static mesh join")
        print(f"OPTIMIZATION_{label}_BOUNDS_BEFORE={tuple(round(v, 6) for v in before[0])}..{tuple(round(v, 6) for v in before[1])}")
        print(f"OPTIMIZATION_{label}_BOUNDS_AFTER={tuple(round(v, 6) for v in after[0])}..{tuple(round(v, 6) for v in after[1])}")

    # A quiet ground plane keeps the product render grounded without exporting scenery into the GLB.
    ground = rounded_cube("StudioFloor", (0.0, 0.0, -0.10), (33.0, 30.0, 0.16), floor_material, bevel=0.05, segments=2)
    ground["exclude_from_model_export"] = True

    model_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH" and obj != ground]
    for obj in model_objects:
        obj.select_set(False)
    for obj in model_objects:
        obj.select_set(True)

    # The hinge bridges deliberately overlap the rear edge of the base and the lower screen shell.
    base_min, base_max = world_bounds(base)
    bridge_min, bridge_max = world_bounds(hinge_parts[0])
    screen_min, screen_max = world_bounds(screen_back)
    def overlap(a_min: Vector, a_max: Vector, b_min: Vector, b_max: Vector) -> bool:
        return all(a_min[index] <= b_max[index] and b_min[index] <= a_max[index] for index in range(3))
    bridge_overlaps_base = overlap(bridge_min, bridge_max, base_min, base_max)
    bridge_overlaps_screen = overlap(bridge_min, bridge_max, screen_min, screen_max)
    print(f"HINGE_BOUNDS base={tuple(round(value, 4) for value in base_min)}..{tuple(round(value, 4) for value in base_max)} bridge={tuple(round(value, 4) for value in bridge_min)}..{tuple(round(value, 4) for value in bridge_max)} screen={tuple(round(value, 4) for value in screen_min)}..{tuple(round(value, 4) for value in screen_max)}")
    if not (bridge_overlaps_base and bridge_overlaps_screen):
        raise RuntimeError("Hinge bridge failed the physical overlap check")

    scene = bpy.context.scene
    scene["asset_name"] = "Graphite hinged laptop"
    scene["design_notes"] = "Original product model with rounded graphite aluminum chassis, individually recessed keycaps, speaker slots, trackpad, and physically joined hinged display."
    scene["export_orientation"] = "Y-up via glTF export_yup=True"
    scene["camera_ready_view"] = "Camera_ThreeQuarter"
    scene["connected_geometry_check"] = "PASS: HingeBridge_L/R overlap BaseChassis and ScreenBackShell"
    scene["screen_texture_surface"] = "ScreenDisplay"
    return model_objects


def configure_render() -> None:
    scene = bpy.context.scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 900
    scene.render.resolution_y = 700
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
    """Add a render-only code editor overlay matching LaptopScene.editorTexture()."""
    chrome = fallback_principled("Fallback Editor Chrome", (0.045, 0.060, 0.085, 1.0), emission_strength=0.05)
    line_number = fallback_principled("Fallback Line Number", (0.20, 0.25, 0.34, 1.0), emission_strength=0.15)
    colors = {
        "comment": fallback_principled("Fallback Comment", (0.34, 0.40, 0.50, 1.0), emission_strength=0.18),
        "purple": fallback_principled("Fallback Purple", (0.72, 0.54, 1.0, 1.0), emission_strength=0.24),
        "text": fallback_principled("Fallback Text", (0.86, 0.87, 0.92, 1.0), emission_strength=0.18),
        "mint": fallback_principled("Fallback Mint", (0.26, 0.86, 0.73, 1.0), emission_strength=0.32),
        "yellow": fallback_principled("Fallback Yellow", (0.95, 0.72, 0.32, 1.0), emission_strength=0.28),
        "blue": fallback_principled("Fallback Blue", (0.52, 0.72, 1.0, 1.0), emission_strength=0.24),
    }
    overlay: list[bpy.types.Object] = []
    top_bar = rounded_cube("FallbackEditorTopBar", (0.0, -0.335, 6.46), (10.72, 0.025, 0.42), chrome, bevel=0.06, segments=2, parent=screen_root)
    status_bar = rounded_cube("FallbackEditorStatusBar", (0.0, -0.335, 1.12), (10.72, 0.025, 0.28), chrome, bevel=0.04, segments=2, parent=screen_root)
    overlay.extend((top_bar, status_bar))

    # Small status dots mirror the source editor texture's red, yellow, and mint controls.
    for index, color in enumerate(("#e58383", "#f2c875", "#43dcc5")):
        mat = fallback_principled(f"Fallback Dot {index}", tuple(int(color[i:i + 2], 16) / 255 for i in (1, 3, 5)) + (1.0,), emission_strength=0.3)
        bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, radius=0.105, location=(-4.72 + index * 0.31, -0.365, 6.46))
        dot = bpy.context.object
        dot.name = f"FallbackEditorDot{index}"
        dot.scale.y = 0.22
        dot.data.materials.append(mat)
        dot.parent = screen_root
        dot.location = (-4.72 + index * 0.31, -0.365, 6.46)
        overlay.append(dot)

    add_fallback_text("FallbackEditorTitle", "nachiketh / workspace", (2.35, -0.365, 6.46), 0.19, line_number, screen_root)
    lines = [
        ("comment", "// a little curiosity, then a lot of building"),
        ("purple", "const developer = {"),
        ("text", '  name: "Nachiketh Reddy",'),
        ("mint", '  focus: ["web", "AI", "useful things"],'),
        ("yellow", '  location: "Singapore",'),
        ("text", "  learning: true"),
        ("purple", "};"),
        ("comment", ""),
        ("blue", "await buildSomethingWorthUsing();"),
    ]
    for index, (color_name, body) in enumerate(lines):
        z = 5.90 - index * 0.49
        add_fallback_text(f"FallbackLineNumber{index + 1:02d}", f"{index + 1:02d}", (-4.72, -0.365, z), 0.15, line_number, screen_root)
        add_fallback_text(f"FallbackCodeLine{index + 1:02d}", body, (-3.72, -0.365, z), 0.21, colors[color_name], screen_root)
    add_fallback_text("FallbackEditorStatus", "main   /   TypeScript                         ready to build", (-4.72, -0.365, 1.12), 0.15, line_number, screen_root)
    return overlay


def brighten_fallback_scene() -> dict[str, object]:
    """Temporarily lift the graphite/silver product lighting for the transparent fallback."""
    scene = bpy.context.scene
    previous: dict[str, object] = {"exposure": scene.view_settings.exposure}
    scene.view_settings.exposure = 0.85
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
    bpy.context.scene.render.filepath = str(RENDER_PATH)
    bpy.ops.render.render(write_still=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(BLEND_PATH))

    print("LAPTOP_BUILD_COMPLETE")
    print(f"MODEL_PATH={MODEL_PATH}")
    print(f"BLEND_PATH={BLEND_PATH}")
    print(f"RENDER_PATH={RENDER_PATH}")
    print(f"MODEL_OBJECT_COUNT={len(model_objects)}")
    print("MODEL_OBJECT_NAMES=" + ",".join(obj.name for obj in model_objects))
    print("EXPORT_ORIENTATION=Y-up (export_yup=True)")
    print("CONNECTED_GEOMETRY=PASS (HingeBridge_L/R overlap BaseChassis and ScreenBackShell)")


if __name__ == "__main__":
    if "--fallback-only" in sys.argv:
        render_transparent_fallback()
    else:
        main()
