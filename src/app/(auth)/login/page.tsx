import { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Variety Vista',
  description: 'Sign in to your account',
};

export default function LoginPage() {
  return (
    <>
      <h2 className="text-center text-2xl font-bold tracking-tight text-gray-900 mb-6">
        Sign in to your account
      </h2>
      <LoginForm />
    </>
  );
}
