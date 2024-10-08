/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin();
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['daksieipotgpcyeoulhh.supabase.co'], // Adicione o domínio do Supabase aqui
  },
};
 
export default withNextIntl(nextConfig);