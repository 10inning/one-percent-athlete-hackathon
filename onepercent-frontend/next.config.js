/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '100mb', // Set body size limit to 100 MB
    },
  },
};

module.exports = nextConfig;
