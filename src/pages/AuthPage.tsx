import AuthForm from "../components/auth/AuthForm";
import AuthLayout from "../layouts/AuthLayout";

const AuthPage = () => {
  return (
    <>
      <AuthLayout>
        <AuthForm />
        <p className="text-center mt-8 text-gray-600">
          Don't have an account?{" "}
          <a href="#" className="text-[#7c5dfa] font-bold hover:underline">
            Sign up
          </a>
        </p>
      </AuthLayout>
    </>
  );
};

export default AuthPage;
