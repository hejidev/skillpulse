// // app/newsletter/confirm/page.tsx
// "use client";

// import { useEffect, useState } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import API from "@/lib/api";
// import { CheckCircle2, XCircle } from "lucide-react";

// export default function NewsletterConfirmPage() {
//     const searchParams = useSearchParams();
//     const router = useRouter();
//     const token = searchParams.get("token");

//     const [status, setStatus] = useState<"loading" | "success" | "error">(
//         "loading"
//     );
//     const [message, setMessage] = useState("Confirming your subscription...");

//     useEffect(() => {
//         const run = async () => {
//             if (!token) {
//                 setStatus("error");
//                 setMessage("Invalid confirmation link.");
//                 return;
//             }

//             try {
//                 // Call backend confirm endpoint
//                 // API baseURL = http://localhost:5000/api, so this hits /api/newsletter/confirm
//                 const res = await API.get("/newsletter/confirm", {
//                     params: { token },
//                 });

//                 // If backend responds with redirect, Axios still resolves; we just treat it as success
//                 setStatus("success");
//                 setMessage("Your subscription has been confirmed. Welcome to SkillPulse!");
//             } catch (err: any) {
//                 setStatus("error");
//                 setMessage(
//                     err?.response?.data?.message ||
//                     "This confirmation link is invalid or expired."
//                 );
//             }
//         };

//         run();
//     }, [token]);

//     return (
//         <div className="min-h-[60vh] flex items-center justify-center px-4">
//             <Card className="max-w-md w-full p-8 bg-card/60 backdrop-blur-xl border border-border">
//                 <div className="flex flex-col items-center text-center space-y-4">
//                     {status === "loading" && (
//                         <>
//                             <div className="w-10 h-10 rounded-full border-2 border-green-500/40 border-t-transparent animate-spin" />
//                             <h1 className="text-xl font-semibold">
//                                 Confirming your subscription
//                             </h1>
//                             <p className="text-sm text-muted-foreground">{message}</p>
//                         </>
//                     )}

//                     {status === "success" && (
//                         <>
//                             <CheckCircle2 className="w-10 h-10 text-green-400" />
//                             <h1 className="text-xl font-semibold">
//                                 You’re in! 🎉
//                             </h1>
//                             <p className="text-sm text-muted-foreground">{message}</p>
//                             <Button className="mt-4" onClick={() => router.push("/")}>
//                                 Go back to home
//                             </Button>
//                         </>
//                     )}

//                     {status === "error" && (
//                         <>
//                             <XCircle className="w-10 h-10 text-red-400" />
//                             <h1 className="text-xl font-semibold">
//                                 Confirmation failed
//                             </h1>
//                             <p className="text-sm text-muted-foreground">{message}</p>
//                             <Button
//                                 className="mt-4"
//                                 variant="outline"
//                                 onClick={() => router.push("/")}
//                             >
//                                 Back to home
//                             </Button>
//                         </>
//                     )}
//                 </div>
//             </Card>
//         </div>
//     );
// }