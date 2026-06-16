// // app/newsletter/confirmed/page.tsx
// "use client";

// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { CheckCircle2 } from "lucide-react";
// import { useRouter } from "next/navigation";

// export default function NewsletterConfirmedPage() {
//   const router = useRouter();

//   return (
//     <div className="min-h-[60vh] flex items-center justify-center px-4">
//       <Card className="max-w-md w-full p-8 bg-card/60 backdrop-blur-xl border border-border">
//         <div className="flex flex-col items-center text-center space-y-4">
//           <CheckCircle2 className="w-10 h-10 text-green-400" />
//           <h1 className="text-2xl font-bold">Subscription confirmed</h1>
//           <p className="text-sm text-muted-foreground">
//             You’ll now receive SkillPulse updates, product drops, and growth tips directly in your inbox.
//           </p>
//           <Button className="mt-2" onClick={() => router.push("/")}>
//             Back to SkillPulse
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// }