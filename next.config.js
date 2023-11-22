/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com'],  //読み込む画像のドメインを指定しておく必要がある
  }
}

module.exports = nextConfig
