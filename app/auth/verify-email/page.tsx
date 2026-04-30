import VerifyEmailClient from "./VerifyEmailClient";

export default function Page({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  return <VerifyEmailClient token={searchParams.token || ""} />;
}