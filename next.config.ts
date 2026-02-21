import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	/* config options here */
	reactCompiler: true,
	cacheComponents: true,
	images:{
		remotePatterns:[{
			protocol:'https',
			hostname:'https://lh3.googleusercontent.com',
			pathname:'*'
		}],
		
	}
}

export default nextConfig
