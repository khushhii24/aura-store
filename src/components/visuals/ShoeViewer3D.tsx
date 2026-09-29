import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { lighten } from '@/lib/color'
import type { ShoeParts, ShoeShape } from '@/data/types'
import { buildShoeMesh } from './shoeMesh'

/**
 * Renders the generated shoe.
 *
 * Plain three.js rather than a React renderer: the scene is built once and
 * never re-renders from React state, so a reconciler would be weight for
 * nothing. Everything is disposed on unmount because this mounts and
 * unmounts every time someone toggles the 3D view.
 */
export function ShoeViewer3D({
  shape,
  parts,
  label,
  autoRotate,
  onReady,
  onFail,
}: {
  shape: ShoeShape
  parts: ShoeParts
  label: string
  autoRotate: boolean
  onReady: () => void
  onFail: () => void
}) {
  const host = useRef<HTMLDivElement>(null)
  /** Kept in a ref so toggling it never rebuilds the scene. */
  const spin = useRef(autoRotate)
  spin.current = autoRotate

  useEffect(() => {
    const mount = host.current
    if (!mount) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    } catch {
      onFail()
      return
    }

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100)
    const controls = new OrbitControls(camera, renderer.domElement)
    const disposables: { dispose(): void }[] = []

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    /* PCFSoftShadowMap was removed in three 0.186 and silently falls back to
       PCF with a console warning; ask for what we actually get. */
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    mount.appendChild(renderer.domElement)
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.outlineOffset = '-3px'

    /* ---------------------------------------------------------- geometry */
    const mesh = buildShoeMesh(shape, parts)
    const shoe = new THREE.Group()

    const material = (color: string, roughness: number, vertexColors = false) => {
      const m = new THREE.MeshStandardMaterial({
        color: new THREE.Color(vertexColors ? '#ffffff' : color),
        roughness,
        metalness: 0,
        vertexColors,
      })
      disposables.push(m)
      return m
    }

    const add = (geometry: THREE.BufferGeometry, mat: THREE.Material) => {
      const m = new THREE.Mesh(geometry, mat)
      m.castShadow = true
      m.receiveShadow = true
      shoe.add(m)
      disposables.push(geometry)
      return m
    }

    /* The upper carries its own collar lining in vertex colour, because the
       opening is cut into the loft rather than laid on top of it. */
    add(mesh.upper, material('', 0.85, true))
    add(mesh.midsole, material(parts.midsole, 0.72))
    add(mesh.outsole, material(parts.outsole, 0.55))

    if (shape.lacing === 'laced') {
      const laceMat = material(parts.laces, 0.9)
      for (const lace of mesh.laces) {
        const g = new THREE.BoxGeometry(0.1, 0.055, lace.width)
        const m = new THREE.Mesh(g, laceMat)
        m.position.copy(lace.position)
        m.castShadow = true
        shoe.add(m)
        disposables.push(g)
      }
    }

    /* Centre the shoe on its own bounding box, and sit it on the floor. */
    const box = new THREE.Box3().setFromObject(shoe)
    const centre = box.getCenter(new THREE.Vector3())
    shoe.position.x -= centre.x
    shoe.position.z -= centre.z
    shoe.position.y -= box.min.y
    scene.add(shoe)

    /* ------------------------------------------------------------ light */
    scene.add(new THREE.HemisphereLight(0xfff8ec, 0x9a8f7d, 1.5))

    const key = new THREE.DirectionalLight(0xfff6e8, 2.6)
    key.position.set(2.6, 4.2, 3.2)
    key.castShadow = true
    key.shadow.mapSize.set(1024, 1024)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 14
    key.shadow.camera.left = -3
    key.shadow.camera.right = 3
    key.shadow.camera.top = 3
    key.shadow.camera.bottom = -3
    key.shadow.bias = -0.0015
    key.shadow.radius = 3
    scene.add(key)

    const fill = new THREE.DirectionalLight(0xe8eeff, 0.7)
    fill.position.set(-3, 1.6, -2.2)
    scene.add(fill)

    const floorGeo = new THREE.PlaneGeometry(30, 30)
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.22 })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)
    disposables.push(floorGeo, floorMat)

    /* ---------------------------------------------------------- camera */
    /* Frame from the bounding sphere, not the box: the shoe spins, so the
       silhouette that has to fit is the one at its widest presentation. */
    const size = box.getSize(new THREE.Vector3())
    const radius = Math.hypot(size.x, size.z) / 2
    const fit = radius / Math.sin((camera.fov * Math.PI) / 360) + size.y * 0.3
    const target = new THREE.Vector3(0, size.y * 0.44, 0)
    /* A product three-quarter, placed by angle rather than by fiddling with
       components: about 32 degrees up and 58 around. Lower than that and the
       near rim hides the collar opening, which is the cue that reads as a
       shoe rather than a clog. */
    const elevation = 0.66
    const azimuth = 1.01
    camera.position.set(
      Math.cos(elevation) * Math.cos(azimuth) * fit,
      Math.sin(elevation) * fit + target.y,
      Math.cos(elevation) * Math.sin(azimuth) * fit,
    )
    controls.target.copy(target)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enablePan = false
    /* Wheel zoom over a canvas in a scrolling page eats the page scroll, and
       the view is a turntable, not an inspection tool. Drag rotates; the page
       keeps its scroll. */
    controls.enableZoom = false
    controls.minDistance = fit * 0.55
    controls.maxDistance = fit * 1.6
    /* Stop the camera dropping below the floor. */
    controls.maxPolarAngle = Math.PI * 0.49
    controls.minPolarAngle = Math.PI * 0.08
    controls.update()

    const resize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      if (w === 0 || h === 0) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(mount)

    let frame = 0
    let last = performance.now()
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      if (spin.current) shoe.rotation.y += dt * 0.32
      controls.update()
      renderer.render(scene, camera)
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    onReady()

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      controls.dispose()
      for (const d of disposables) d.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [shape, parts, onReady, onFail])

  return (
    <div
      ref={host}
      className="h-full w-full"
      /*
       * An image, not an application. It was `role="application"` with
       * tabIndex 0, which tells a screen reader to hand over keystrokes — but
       * there is no keyboard interaction here to hand them to, so it put a
       * dead stop in the tab order. Rotation is driven by the button beside
       * the view, which is a real control and already reachable.
       */
      role="img"
      aria-label={label}
    />
  )
}

/** Exposed so the surrounding UI can tint a loading state to the product. */
export const previewTint = (parts: ShoeParts) => lighten(parts.midsole, 0.2)
