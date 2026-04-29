import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-4">
        
        {/* 🔷 Brand */}
        <div>
          <h2 className="text-xl font-bold bg-linear-to-r from-green-400 to-purple-400 bg-clip-text text-transparent">
            SkillPulse
          </h2>
          <p className="mt-4 text-sm text-gray-400">
            Track your growth. Measure your improvement. Become intentional.
          </p>
        </div>

        {/* 🔗 Product */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Product</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="#features">Features</Link></li>
            <li><Link href="#how">How it Works</Link></li>
            <li><Link href="#">Pricing</Link></li>
          </ul>
        </div>

        {/* 🔗 Company */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="#">About</Link></li>
            <li><Link href="#">Blog</Link></li>
            <li><Link href="#">Careers</Link></li>
          </ul>
        </div>

        {/* 🔗 Support */}
        <div>
          <h3 className="text-sm font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="#">Help Center</Link></li>
            <li><Link href="#">Contact</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* 🔽 Bottom Bar */}
      <div className="border-t border-white/10 text-center py-6 text-sm text-gray-500">
        © {new Date().getFullYear()} SkillPulse By <a href="#" className="text-green-500">HejiDev</a>. All rights reserved.
      </div>
    </footer>
  );
}