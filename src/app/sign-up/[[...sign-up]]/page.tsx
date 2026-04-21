import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: "bg-white text-gray-950 hover:bg-gray-200",
            card: "bg-gray-900 border border-gray-800",
            headerTitle: "text-gray-100",
            headerSubtitle: "text-gray-400",
            socialButtonsBlockButton: "bg-gray-800 border-gray-700 text-gray-100 hover:bg-gray-700",
            socialButtonsBlockButtonText: "text-gray-100",
            dividerLine: "bg-gray-800",
            dividerText: "text-gray-500",
            formFieldLabel: "text-gray-400",
            formFieldInput: "bg-gray-950 border-gray-800 text-gray-100",
            footerActionText: "text-gray-400",
            footerActionLink: "text-white hover:text-gray-200"
          }
        }}
      />
    </div>
  );
}
