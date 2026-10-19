import {
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <main className="min-h-screen px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              T
            </span>
            <span className="text-xl font-bold text-slate-900">TeamBoard</span>
          </Link>

          <div className="flex items-center gap-3">
            {!isLoaded ? (
              <span className="text-sm text-slate-500">Loading...</span>
            ) : isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Dashboard
                </Link>
                <UserButton />
              </>
            ) : (
              <>
                <SignInButton mode="modal">
                  <button className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                    Sign in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
                    Get started
                  </button>
                </SignUpButton>
              </>
            )}
          </div>
        </header>

        <section className="grid items-center gap-12 py-24 md:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-wide text-blue-600">
              A BETTER WAY TO STAY ORGANIZED
            </p>
            <h1 className="mt-5 text-4xl leading-tight font-bold tracking-tight text-slate-950 sm:text-5xl">
              Make space for your best work.
            </h1>
            <p className="mt-6 max-w-lg leading-7 text-slate-600">
              Keep your tasks organized, focus on what matters, and make
              progress every day with TeamBoard.
            </p>

            {!isSignedIn && isLoaded && (
              <SignUpButton mode="modal">
                <button className="mt-8 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                  Create your account
                </button>
              </SignUpButton>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <p className="text-sm font-medium text-slate-500">YOUR WORKSPACE</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">
              One step at a time.
            </h2>
            <div className="mt-7 space-y-3">
              {[
                "Plan your next task",
                "Keep track of your progress",
                "Finish what matters most",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                >
                  <span className="flex size-8 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
