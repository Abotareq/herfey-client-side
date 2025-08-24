// import createNextIntlPlugin from "next-intl/plugin";

// const nextConfig = {};

// const withNextIntl = createNextIntlPlugin();
// export default withNextIntl(nextConfig);
// /** @type {import('next').NextConfig} */


import createNextIntlPlugin from "next-intl/plugin";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], 
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
