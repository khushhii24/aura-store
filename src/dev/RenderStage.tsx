import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { getProduct } from '@/data/products'
import { buildShoeMesh } from '@/components/visuals/shoeMesh'

/**
 * The authoring tool that produces generated product imagery.
 *
 * Two models could not be photographed: every free licensed photograph of a
 * white court sneaker or a minimal white leather sneaker that was tried
 * carried a competitor's trademark. Rather than drop them, their imagery is
 * generated from the same parametric geometry that drives the 3D viewer.
 *
 * This is a separate Vite entry, not a route. `vite build` only takes
 * index.html as an input, so render.html and everything it imports stay out
 * of the production bundle entirely — a dev-only route would have dragged
 * three.js into the main chunk, which it did on the first attempt.
 *
 * It takes `slug`, `az`, `el` and `dist` and renders one deterministic frame
 * on the site's product-bed palette, sized 1400 square to match the
 * photography. Screenshot it, encode to WebP, and it is a product image.
 *
 *   npm run dev  →  /render.html?slug=aura-form&az=1.05&el=0.30
 */
const BED_TOP = '#ebe5d8'
const BED_DEEP = '#cdc4ae'

export function RenderStage() {
  const host = useRef<HTMLDivElement>(null)
  const params = new URLSearchParams(window.location.search)
  const slug = params.get('slug') ?? 'aura-form'
  const az = Number(params.get('az') ?? 1.05)
  const el = Number(params.get('el') ?? 0.3)
  const distScale = Number(params.get('dist') ?? 1)

  useEffect(() => {
    const mount = host.current
    const product = getProduct(slug)
    if (!mount || !product) return

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
    renderer.setPixelRatio(1)
    renderer.setSize(1400, 1400, false)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()

    /* The bed, as a vertical gradient painted into a texture, so the frame
       matches the `.image-bed` the photographs sit on. */
    const grad = document.createElement('canvas')
    grad.width = 8
    grad.height = 256
    const ctx = grad.getContext('2d')!
    const fill = ctx.createLinearGradient(0, 0, 0, 256)
    fill.addColorStop(0, BED_TOP)
    fill.addColorStop(1, BED_DEEP)
    ctx.fillStyle = fill
    ctx.fillRect(0, 0, 8, 256)
    const bg = new THREE.CanvasTexture(grad)
    bg.colorSpace = THREE.SRGBColorSpace
    scene.background = bg

    const parts = product.colorways[0].parts
    const mesh = buildShoeMesh(product.shape, parts)
    const shoe = new THREE.Group()
    const disposables: { dispose(): void }[] = []

    const material = (color: string, roughness: number, vertexColors = false) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(vertexColors ? '#ffffff' : color),
        roughness,
        metalness: 0,
        vertexColors,
      })

    for (const [geometry, mat] of [
      [mesh.upper, material('', 0.85, true)],
      [mesh.midsole, material(parts.midsole, 0.72)],
      [mesh.outsole, material(parts.outsole, 0.55)],
    ] as const) {
      const m = new THREE.Mesh(geometry, mat)
      m.castShadow = true
      m.receiveShadow = true
      shoe.add(m)
      disposables.push(geometry, mat)
    }

    if (product.shape.lacing === 'laced') {
      const laceMat = material(parts.laces, 0.9)
      disposables.push(laceMat)
      for (const lace of mesh.laces) {
        const g = new THREE.BoxGeometry(0.1, 0.055, lace.width)
        const m = new THREE.Mesh(g, laceMat)
        m.position.copy(lace.position)
        m.castShadow = true
        shoe.add(m)
        disposables.push(g)
      }
    }

    const box = new THREE.Box3().setFromObject(shoe)
    const centre = box.getCenter(new THREE.Vector3())
    shoe.position.x -= centre.x
    shoe.position.z -= centre.z
    shoe.position.y -= box.min.y
    scene.add(shoe)

    scene.add(new THREE.HemisphereLight(0xfff8ec, 0x9a8f7d, 1.5))
    const key = new THREE.DirectionalLight(0xfff6e8, 2.6)
    key.position.set(2.6, 4.2, 3.2)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 0.5
    key.shadow.camera.far = 16
    key.shadow.camera.left = -4
    key.shadow.camera.right = 4
    key.shadow.camera.top = 4
    key.shadow.camera.bottom = -4
    key.shadow.bias = -0.0015
    key.shadow.radius = 3
    scene.add(key)
    const fillLight = new THREE.DirectionalLight(0xe8eeff, 0.7)
    fillLight.position.set(-3, 1.6, -2.2)
    scene.add(fillLight)

    const floorGeo = new THREE.PlaneGeometry(40, 40)
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.2 })
    const floor = new THREE.Mesh(floorGeo, floorMat)
    floor.rotation.x = -Math.PI / 2
    floor.receiveShadow = true
    scene.add(floor)
    disposables.push(floorGeo, floorMat)

    const size = box.getSize(new THREE.Vector3())
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100)
    const radius = Math.hypot(size.x, size.z) / 2
    const dist = (radius / Math.sin((camera.fov * Math.PI) / 360) + size.y * 0.3) * distScale
    const target = new THREE.Vector3(0, size.y * 0.44, 0)
    camera.position.set(
      Math.cos(el) * Math.cos(az) * dist,
      Math.sin(el) * dist + target.y,
      Math.cos(el) * Math.sin(az) * dist,
    )
    camera.lookAt(target)
    renderer.render(scene, camera)

    return () => {
      for (const d of disposables) d.dispose()
      bg.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [slug, az, el, distScale])

  /* Fixed 1400 square with no page chrome, so a clip screenshot of the
     element is the asset. */
  return <div ref={host} id="stage" style={{ width: 1400, height: 1400 }} />
}
