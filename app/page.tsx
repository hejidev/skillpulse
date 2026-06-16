import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import HowItWorks from "@/components/howItWork";
import Features from "@/components/features";
import CTA from "@/components/callToAction";
import Footer from "@/components/footer";
import Testimonials from "@/components/Testimonials";

export default function Home() {
  return (
    <main className="bg-background text-foreground transition-colors duration-300">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <div className="flex justify-center gap-10 mt-12 text-center">
        <div>
          {/* <h3 className="text-2xl font-bold">1K+</h3>
          <p className="text-gray-400 text-sm">Active Users</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">10K+</h3>
          <p className="text-gray-400 text-sm">Skills Tracked</p>
        </div>
        <div>
          <h3 className="text-2xl font-bold">95%</h3>
          <p className="text-gray-400 text-sm">Consistency Rate</p> */}
        </div>
      </div>
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}