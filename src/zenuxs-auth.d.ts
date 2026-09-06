declare namespace JSX {
  interface IntrinsicElements {
    'zenuxs-auth': {
      ref?: React.Ref<HTMLElement>
      'client-id'?: string
      'redirect-uri'?: string
      scope?: string
      theme?: string
      height?: string
      width?: string
      'auto-redirect'?: string
      'redirect-delay'?: string
      'auth-server'?: string
      'redirect-url'?: string
    }
  }
}
