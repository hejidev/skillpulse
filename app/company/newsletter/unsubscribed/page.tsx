// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import API from "@/lib/api";
// import { MailX, CheckCircle2, XCircle } from "lucide-react";

// export default function CompanyNewsletterUnsubscribePage() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const email = searchParams.get("email");

//   const [status, setStatus] = useState<"loading" | "success" | "error">(
//     "loading"
//   );
//   const [message, setMessage] = useState("Updating your email preferences...");

//   useEffect(() => {
//     const run = async () => {
//       if (!email) {
//         setStatus("error");
//         setMessage("Invalid unsubscribe link.");
//         return;
//       }

//       try {
//         const res = await API.get("/newsletter/unsubscribe", {
//           params: { email },
//         });

//         setStatus("success");
//         setMessage(res.data?.message || "You have been unsubscribed.");
//       } catch (err: any) {
//         setStatus("error");
//         setMessage(
//           err?.response?.data?.message || "Unable to unsubscribe with this link."
//         );
//       }
//     };

//     run();
//   }, [email]);

//   return (
//     <div className="min-h-[60vh] flex items-center justify-center px-4">
//       <Card className="max-w-md w-full p-8 bg-card/60 backdrop-blur-xl border border-border">
//         <div className="flex flex-col items-center text-center space-y-4">
//           {status === "loading" && (
//             <>
//               <div className="w-10 h-10 rounded-full border-2 border-red-500/40 border-t-transparent animate-spin" />
//               <h1 className="text-xl font-semibold">Processing...</h1>
//               <p className="text-sm text-muted-foreground">{message}</p>
//             </>
//           )}

//           {status === "success" && (
//             <>
//               <MailX className="w-10 h-10 text-red-400" />
//               <h1 className="text-xl font-semibold">You’re unsubscribed</h1>
//               <p className="text-sm text-muted-foreground">{message}</p>
//               <Button
//                 className="mt-4"
//                 variant="outline"
//                 onClick={() => router.push("/")}
//               >
//                 Back to home
//               </Button>
//             </>
//           )}

//           {status === "error" && (
//             <>
//               <XCircle className="w-10 h-10 text-red-400" />
//               <h1 className="text-xl font-semibold">Unsubscribe failed</h1>
//               <p className="text-sm text-muted-foreground">{message}</p>
//               <Button
//                 className="mt-4"
//                 variant="outline"
//                 onClick={() => router.push("/")}
//               >
//                 Back to home
//               </Button>
//             </>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// }