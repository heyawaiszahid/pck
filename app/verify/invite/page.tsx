import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Snackbar from "@/components/Snackbar";
import InviteDialog from "@/components/Verify/InviteDialog";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function VerifyInvite({ searchParams }: { searchParams?: { [key: string]: string | undefined } }) {
  const session = await getServerSession(authOptions);

  if (session) {
    return (
      <Snackbar
        open={true}
        title="Account Activation Conflict"
        message={`You are currently logged in as ${session?.user.email}. To activate a different account, please log out of the current session and try again.`}
      />
    );
  }

  const id = searchParams?.id as string;

  if (id === undefined) redirect("/");

  const user = await prisma.user
    .findFirst({
      where: {
        id,
      },
      select: {
        name: true,
        email: true,
        status: true,
        company: {
          select: {
            name: true,
          },
        },
      },
    })
    .catch((error) => {
      return error;
    });

  if (!user) {
    return (
      <Snackbar
        open={true}
        title="Account Deleted"
        message="The requested account has been deleted. If you believe this is an error or if you need further assistance, please contact our support team."
      />
    );
  }

  if (user.code) {
    return (
      <Snackbar
        open={true}
        title="Invalid Request"
        message="Please review the provided parameters and ensure they meet the required criteria. If you have questions or need assistance, don't hesitate to reach out to our support team. "
      />
    );
  }

  const { name, email, status } = user;

  if (status === 1)
    return (
      <Snackbar
        open={true}
        severity="success"
        title="Active Account"
        message="This account is already active. If you are having trouble accessing your account, please ensure you are using the correct login credentials. If the issue persists, contact our support team for assistance."
      />
    );

  // declined or inactive
  if (status === -2 || status === 0)
    return (
      <Snackbar
        open={true}
        title="Expired"
        message="The invitation link is expired. Please reach out to your company administrator for further assistance."
      />
    );

  const dialogProps = {
    id,
    firstName: name.split(" ")[0],
    email,
    companyName: user.company.name,
  };

  return <InviteDialog {...dialogProps} />;
}
