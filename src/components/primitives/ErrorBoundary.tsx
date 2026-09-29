import { Component, type ReactNode } from 'react'

/**
 * Catches a render or chunk-load failure in one subtree.
 *
 * The 3D viewer is lazy-loaded, so a dropped connection turns `import()` into
 * a rejected promise. React surfaces that to the nearest boundary — and with
 * no boundary in the tree it unmounts the whole route, which is how a failed
 * 240 kB chunk took the entire product page down with it.
 */
export class ErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
