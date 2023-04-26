import { useRouter } from 'next/router';

const RegisterReferralPage = () => {
    const { asPath, pathname } = useRouter();
    console.log(asPath); // '/blog/xyz'
    console.log(pathname); // '/blog/[slug]'
    return (
      <div></div>
    );
}
  
export default RegisterReferralPage;

