import { Component, type ReactNode } from 'react'

/**
 * Se o WebGL falhar em runtime (contexto perdido, GPU bloqueada), a camada
 * 3D some silenciosamente e os fallbacks SVG voltam — a página continua
 * completa, que é o contrato do case.
 */
export class ThreeErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    delete document.documentElement.dataset.three
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}
