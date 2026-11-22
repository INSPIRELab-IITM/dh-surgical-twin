# DH Surgical Twin: a patient-specific, real-time surgical simulator

**Project page: https://inspirelab-iitm.github.io/dh-surgical-twin/**

> **Code coming soon.** This repository holds the project's description for now; the source (release v0.2) will be published here. Watch the repository to be notified.

> **Licence status.** The licences below are **PROPOSED, pending review by the IIT Madras IP cell**. The
> software is source-available for non-commercial use only. It is not open source in the OSI sense.

The simulator builds a patient's abdomen from a CT scan and runs it in real time in [SOFA](https://www.sofa-framework.org),
with every soft organ on the GPU in double precision, for training in robotic and laparoscopic surgery. Release v0.2
contains the simulator's pipeline, physics, procedures, training and teaching features; the page draws its procedural
tissue look (no real-video textures are part of the release).

## What the release contains

- **The CT -> scene pipeline.** It segments the CT with the open TotalSegmentator tasks and fuses the masks into one
  label map. It extracts surfaces and tetrahedral meshes, and synthesises what CT does not show: the biliary tree
  (the common, cystic and hepatic ducts and the cystic artery routed through the free space between the organs), the
  hepatocystic fat as a sheath round them, the diaphragm, the falciform ligament, the greater omentum, the small bowel
  as traced self-colliding tubes, and the liver's portal and hepatic venous trees. It adds respiration, organ
  attachments and the gallbladder's bed bonds. The result is a scene ready for SOFA.
- **Your own patient.** `/patients` (a clinician or admin account): drop a NIfTI file or a DICOM series as a .zip; it
  is validated and de-identified on arrival, segmented (open tasks only), built into a cholecystectomy scene with its
  own port plan (chosen on the exposed anatomy), checked and previewed, then opens in the simulator (Practise / Train
  / Assess). Off by default (`config/rehearsal.yaml`): patient data needs your ethics approval. docs/upload_pipeline.md.
- **The physics**, built on SOFA v25.12 and a patched SofaCUDA (`third_party/sofacuda_patches`, 19 fixes): the soft
  organs as corotational tetrahedra on the GPU, the constraint-based frictional contact, the uncoupled constraint
  correction, the hollow viscera's content (Tait pressure), the bead chains of the ducts and arteries. Every organ
  below the diaphragm is live; the live rate adapts (1/60 to 0.03 s) to the finest step the machine holds in real time. **Not included:** our
  DhCudaFEM plugin (the GPU SVD element, the per-organ local CG, the fast constraint solver and correction, the GPU
  contact narrow phase, the GPU Tait / bending / spring fields). Without it every scene is built from SOFA's and
  SofaCUDA's own components (`dh/sim/sofa_scene.py` has the stock alternative of each); see "Without DhCudaFEM" below.
  The physics covers frictional contact with the instruments' drawn jaws and shafts, grasping with published tear
  limits, blunt dissection and avulsion, cutting (computed in a worker, eased open on screen), sutures and knots,
  clips, energy (burns, coagulation, smoke), bleeding from the vessels a cut crosses, bile leaks from a perforated
  gallbladder, and breathing.
- **The web portal** (port 8766). The browser draws the scene from the physics frames; weak devices (phones, tablets,
  headsets) are **streamed** instead, from a server page over WebRTC or from the native GPU view (EGL, CUDA-GL interop,
  NVENC). WebXR headsets work in both.
- **The robot console**: a da Vinci-style console with two wristed instruments, a 4th arm (the pedal swap) and a 30°
  laparoscope docked on its field; the console off, the masters drive the instruments in the page's 3D view.
- **The master devices**: keyboard + mouse (`/master`), a 6D gizmo (`/gizmo`), a phone (`/phone`), XR controllers,
  and your own lab device through the master protocol v2 (force feedback, arbitration between several masters,
  docs/master_protocol.md) with a Python stub (`scripts/master_device_stub_ws.py`, browser sign-in at `/dev/pair`),
  a simulated master (docs/sim_master.md) and a latency-measurement page (`/latency`).
- **Training**: the basic skills (camera navigation, clutching, peg transfer, pattern cutting, energy control,
  suturing) with a proficiency curriculum (`/curriculum`); the laparoscopic cholecystectomy (four anatomies of
  Calot's triangle, a double cystic artery, three patients: the male reference, a second male, a female) and
  appendectomy, scored; short step cases with scripted adverse events (docs/step_cases.md); the trainee flow
  (`/train`), the attempt's review (docs/review.md), the instructor's cohort view (docs/instructor_view.md).
- **The teaching layer** (docs/teaching_layer.md): the step banner and list, the critical view of safety's criteria,
  the ducts and arteries tinted with their hidden course, hologram clip / scissors guides, event notes with the points
  lost. **Display anatomy**: the retroperitoneal floor, the right hepatic artery, the hepatoduodenal ligament.
- **The procedural tissue look**: wet physically based tissue with procedural albedo patterns glued to the rest
  shape, surface vessels grown over each organ, regional colour variation, PN-triangle silhouettes, a metered
  laparoscope camera, cautery smoke and blood / bile films. No image texture is used.
- **Autonomy data**: `python -m dh.autonomy` (a Gym-style environment and data collection in the LeRobot layout,
  docs/autonomy_data.md).
- **Portable install**: a kit for an offline box (scripts/portable, docs/portable_deployment.md).

**Not in this release:** real-video tissue textures and the tools that make them, patient data, built scenes.

## Requirements (for the coming release)

- Linux x86-64 and an NVIDIA GPU with CUDA (double precision and NVENC).
- 16 GB of RAM (32 GB recommended), about 20 GB of disk.
- SOFA v25.12.00 with SofaPython3 (Python 3.12); our SofaCUDA patches (LGPL-2.1) are applied by the setup script.

## Licence

- **Our code: [PolyForm Noncommercial License 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0)** (source-available, non-commercial).
  - Allowed: research, teaching and personal study. Universities, hospitals and public research organisations may use
    and modify it for those purposes.
  - Not allowed without a separate **commercial licence** from IIT Madras: any commercial use, such as a product, a
    paid service, or use within a company's commercial work. Contact by email for licensing: niravpatel@smail.iitm.ac.in, nirav.robotics@gmail.com.
  - The licence's Required Notice: Copyright (c) 2026 INSPIRE Lab, Indian Institute of Technology Madras.
- **LGPL-2.1, as SOFA.** `third_party/sofacuda_patches/` (the changes to SOFA v25.12's SofaCUDA) is derived from
  SOFA, so its own `LICENSE` file (LGPL-2.1) applies instead of PolyForm.
- **Scene data.** No patient data is shipped. Scene data and meshes published later will be under **CC BY-NC 4.0**,
  in addition to the CC BY 4.0 attribution owed to the TotalSegmentator dataset they come from.
- **Patents pending** (IIT Madras).
- Third-party material and its licences (THIRD_PARTY.md) and the contributor licence agreement (CONTRIBUTING.md) come
  with the code release.

## Citing

Until the paper is out, cite the software:

```bibtex
@software{dh_surgical_twin_2026,
  title  = {DH Surgical Twin: a patient-specific, real-time surgical simulator on SOFA},
  author = {{INSPIRE Lab, Indian Institute of Technology Madras}},
  year   = {2026},
  url    = {https://github.com/INSPIRELab-IITM/dh-surgical-twin}
}
```

Please also cite TotalSegmentator (Wasserthal et al. 2023), SOFA and, for the
instrument meshes, LapGym (Scheikl et al. 2023).
