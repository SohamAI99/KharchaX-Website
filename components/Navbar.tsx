import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-border/40 border-b z-50">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              KharchaX
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link href="/dashboard" className="text-text-secondary hover:text-foreground font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="#" className="bg-primary hover:brightness-110 active:scale-95 text-white px-5 py-2 rounded-[12px] font-medium transition-all shadow-sm">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
