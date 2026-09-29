import { lazy, Suspense, useCallback, useState } from "react";
import { ErrorBoundary } from "@/components/primitives/ErrorBoundary";
import { useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import type { Product } from "@/data/types";

/**
 * The 3D product view.
 *
 * three.js is code-split, so neither the engine nor the mesh builder touches
 * the main bundle — they load when someone asks for the 3D view and not
 * before.
 *
 * There is no downloaded model here. The mesh is generated from the shoe's
 * own parametric geometry, which is why every product has its own: AURA LOW
 * is a flat court sole, GLIDE is a rockered slab, and neither carries anyone
 * else's trademark. The licensed models that were tried instead all did, and
 * so did the photographs behind FORM and LOW — which is why those two are
 * rendered from this same geometry rather than shot.
 */
const Viewer = lazy(() =>
  import("@/components/visuals/ShoeViewer3D").then((m) => ({
    default: m.ShoeViewer3D,
  })),
);

export function Product3D({ product }: { product: Product }) {
  const reduced = useReducedMotion();
  const [spin, setSpin] = useState(!reduced);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  const onReady = useCallback(() => setReady(true), []);
  const onFail = useCallback(() => setFailed(true), []);

  const colorway = product.colorways[0];

  const unavailable = (
    <div className="flex aspect-[4/3] w-full items-center justify-center bg-[color:var(--color-bed-mid)] px-8 text-center">
      <p className="t-small text-[color:var(--color-secondary)]">
        The 3D view could not start. The photographs show the product.
      </p>
    </div>
  );

  if (failed) return unavailable;

  return (
    <div>
      <div className="image-bed relative aspect-[4/3] w-full overflow-hidden">
        {!ready && (
          <p
            className="t-label absolute inset-0 z-10 flex items-center justify-center text-[color:var(--color-on-bed)]"
            aria-live="polite"
          >
            Building the model…
          </p>
        )}
        <ErrorBoundary fallback={unavailable}>
          <Suspense fallback={null}>
            <Viewer
              shape={product.shape}
              parts={colorway.parts}
              label={`A generated 3D model of the AURA ${product.name} in ${colorway.name}, shown from a three-quarter angle.`}
              autoRotate={spin && !reduced}
              onReady={onReady}
              onFail={onFail}
            />
          </Suspense>
        </ErrorBoundary>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <p className="t-label text-[color:var(--color-muted)]">
          Generated from the {product.shape.soleStyle} sole — {colorway.name}
        </p>
        <button
          type="button"
          onClick={() => setSpin((v) => !v)}
          aria-pressed={spin}
          className="t-label link-draw flex items-center gap-2 text-[color:var(--color-muted)] hover:text-[color:var(--color-primary)]"
        >
          {spin ? (
            <Pause size={13} strokeWidth={1.5} aria-hidden="true" />
          ) : (
            <Play size={13} strokeWidth={1.5} aria-hidden="true" />
          )}
          {spin ? "Pause rotation" : "Rotate"}
        </button>
      </div>

      <p className="t-small mt-3 max-w-prose text-[color:var(--color-muted)]">
        Drag to rotate, scroll to zoom. This mesh is generated from the
        product's own sole architecture and last, not a downloaded model — the
        photographs above are the product.
      </p>
    </div>
  );
}
