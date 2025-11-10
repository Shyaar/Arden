"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Home,
  Layout,
  Info,
  Mail,
  Wallet,
  LogIn,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { WalletModal } from "./wallet-modal";
import { useRouter } from "next/navigation";

import { LogoutModal } from "./LogoutModal"

export function Navbar() {
  const pathname = usePathname()
  const { ready, authenticated, user, login, logout } = usePrivy()
  const [isWalletOpen, setIsWalletOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const links = [
    { href: "/#home", label: "Home", icon: Home },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
    { href: "/dashboard", label: "Dashboard", icon: Layout },
  ];

  const router = useRouter();
  useEffect(() => {
    if (ready && authenticated) {
      router.push("/dashboard");
    }
  }, [ready, authenticated, router]);

  const handleScroll = (href: string) => {
    if (href.includes("#")) {
      const elementId = href.split("#")[1];
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true)
    await logout()
    setIsLoggingOut(false)
    setIsLogoutModalOpen(false)
  }

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="sticky  top-0 z-[990] border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
          >
            <Image src="/logo.png" alt="Arden Logo" width={32} height={32} />
            <span className="font-bold text-lg text-foreground">Arden</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <div className="flex items-center gap-1">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={(e) => {
                    if (href.includes("#")) {
                      e.preventDefault();
                      handleScroll(href);
                    }
                  }}
                  className={`flex items-center gap-2 px-3 py-2 transition-colors ${
                    pathname === href || pathname === href.split("#")[0]
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{label}</span>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {ready && authenticated && user && (
                <div className="hidden xl:flex items-center px-3 py-2 bg-card border border-border">
                  <span className="text-sm font-medium text-foreground">
                    Welcome,{" "}
                    {user.google?.name ||
                      user.github?.username ||
                      user.github?.name ||
                      "User"}
                  </span>
                </div>
              )}

              <button
                onClick={() => setIsWalletOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
              >
                <Wallet size={18} />
                <span className="text-sm hidden md:inline">Wallet</span>
              </button>
            </div>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[998] bg-background/80 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed top-16 right-0 bottom-0 z-[999] w-full max-w-xs bg-card border-l border-border p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-4">
              {links.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => {
                    if (href.includes("#")) {
                      handleScroll(href);
                    }
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 transition-colors text-base font-medium ${
                    pathname === href || pathname === href.split("#")[0]
                      ? "text-accent bg-accent/10"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon size={20} />
                  {label}
                </Link>
              ))}

              <div className="border-t border-border pt-4 mt-4 flex flex-col gap-4">
                {ready && authenticated && user && (
                  <div className="hidden xl:flex items-center px-3 py-2 bg-card border border-border">
                    <span className="text-sm font-medium text-foreground">
                      Welcome,{" "}
                      {user.google?.name ||
                        user.github?.username ||
                        user.github?.name ||
                        "User"}
                    </span>
                  </div>
                )}

                <button
                  onClick={() => setIsWalletOpen(true)}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-opacity font-medium"
                >
                  <Wallet size={18} />
                  <span className="text-sm">Wallet</span>
                </button>
                {authenticated && (
                  <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                  >
                    <LogOut size={18} />
                    <span className="text-sm">Logout</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <WalletModal
        isOpen={isWalletOpen}
        onClose={() => setIsWalletOpen(false)}
      />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoggingOut={isLoggingOut}
      />
    </>
  );
}
