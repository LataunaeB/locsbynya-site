/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force cache busting
  generateBuildId: async () => {
    return `build-${Date.now()}`
  }
}

module.exports = nextConfig











