import SignIn from "@/components/auth/sign-in-social"

export default function LoginPage() {
  return ( <>
   <h1 className="text-2xl font-bold text-center text-black my-2">Sign In</h1>
   <SignIn provider="google"/>
   <SignIn provider="github"/>
   <SignIn provider="microsoft"/>

   </>
  );
}