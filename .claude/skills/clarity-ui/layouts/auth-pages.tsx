/*
Auth pages layout: Login, signup, forgot password.
These do NOT use the app shell. Centered card on bg-secondary.
Uses spacious density.
*/

import Link from "next/link";
import { Button } from "@/components/ui/button";

interface AuthLayoutProps {
  logo?: React.ReactNode;
  appName?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerLink?: { label: string; href: string };
  socialLogin?: boolean;
}

export function AuthLayout({
  logo,
  appName,
  title,
  subtitle,
  children,
  footerText,
  footerLink,
  socialLogin = false,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          {logo || (
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
              <span className="text-lg font-bold text-fg-on-accent">
                {appName?.charAt(0) || "A"}
              </span>
            </div>
          )}
          <h1 className="mt-4 text-xl font-semibold text-fg-primary">{title}</h1>
          {subtitle && (
            <p className="mt-1 text-sm text-fg-muted">{subtitle}</p>
          )}
        </div>

        {/* Form card */}
        <div className="rounded-lg border border-border bg-bg-primary p-6 shadow-sm">
          {children}

          {socialLogin && (
            <>
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-bg-primary px-2 text-fg-muted">or</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Continue with Google
              </Button>
            </>
          )}
        </div>

        {/* Footer link */}
        {footerText && footerLink && (
          <p className="mt-4 text-center text-sm text-fg-muted">
            {footerText}{" "}
            <Link href={footerLink.href} className="text-accent hover:text-accent-hover">
              {footerLink.label}
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
