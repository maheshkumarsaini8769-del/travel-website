/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  experimental: {
    optimizeCss: true,
    serverComponentsExternalPackages: ['mongodb', 'mongodb-connection-string-url', '@mongodb-js/saslprep'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback ?? {}),
        net: false,
        tls: false,
        dns: false,
        fs: false,
        'mongodb-client-encryption': false,
        kerberos: false,
        '@mongodb-js/zstd': false,
        '@aws-sdk/credential-providers': false,
        snappy: false,
        socks: false,
        aws4: false,
      }
    }
    return config
  },
}

module.exports = nextConfig
