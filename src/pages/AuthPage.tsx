import AuthForm from "../components/auth/AuthForm";
import AuthLayout from "../layouts/AuthLayout";

const AuthPage = () => {
  return (
    <>
      <AuthLayout>
        <AuthForm />
      </AuthLayout>
    </>
  );
};

export default AuthPage;
