import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  }); // this is an actual header parameteres

  if (!!session) {
    redirect("/"); // this will direct the user to the home page
  }

  return <SignInView />;
};
export default Page;
