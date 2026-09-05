import { Metadata } from 'next';
import SignupForm from './SignupForm';

export const metadata: Metadata = {
  title: 'Create an Account | Variety Vista',
  description: 'Join Variety Vista today',
};

export default function SignupPage() {
  return (
    <>
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
        Create your account
      </h2>
      <SignupForm />
    </>
  );
}
