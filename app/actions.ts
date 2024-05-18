"use server";

import DiscoveryFramework from "@/components/Email/Templates/IntakeForms/DiscoveryFramework";
import Invitation from "@/components/Email/Templates/invitation";
import prisma from "@/prisma/client";
import { hashSync } from "bcrypt";
import { revalidatePath, revalidateTag } from "next/cache";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const addAndInvite = async (data: any) => {
  const { name, email, modules, companyId, companyName } = data;

  const createUser = await prisma.user
    .create({
      data: {
        name,
        email,
        role: "USER",
        profile: {
          create: {
            modules,
          },
        },
        company: {
          connect: {
            id: companyId,
          },
        },
      },
    })
    .catch((error) => {
      return error;
    });

  if (!createUser.code) {
    const { id } = createUser;

    const href = `${process.env.NEXTAUTH_URL}/verify/invite?id=${id}`;

    const firstName = name.split(" ")[0];

    const sendEmail = await resend.emails.send({
      from: "Pipeline Conversion Kit <noreply@pipelineconversionkit.com>",
      to: email,
      subject: `Join ${companyName} Team Now!`,
      react: Invitation({ firstName, companyName, href }) as React.ReactElement,
    });

    if (!sendEmail.error) {
      revalidateTag("companyDetails");

      return {
        success: true,
        title: "User Added Successfully",
        message:
          "An invitation link has been sent to their email. They just need to accept the invitation to join the team.",
      };
    } else {
      const { id } = createUser;
      await _deleteUser(id);
    }
  } else if (createUser.meta.target === "User_email_key") {
    return {
      success: false,
      title: "User Already Exists",
      message: "The email address you entered is already associated with an existing account.",
    };
  }

  // General error either from MongoDB or Resend
  return {
    success: false,
    title: "Unexpected Error",
    message:
      "Something went wrong. Please try again, and if the issue persists, reach out to our support team for assistance.",
  };
};

export const acceptInvite = async (data: any) => {
  const { id, password } = data;
  const hashedPassword = hashSync(password, 12);

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      hashedPassword,
      status: 1,
    },
  });

  return { success: true };
};

export const declineInvite = async (id: string) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      status: -2,
    },
  });
};

export const deleteUser = async (id: string) => {
  await _deleteUser(id);
  revalidateTag("companyDetails");
};

export const toggleUserStatus = async (id: string, status: number) => {
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  revalidateTag("companyDetails");
};

export const updateUser = async (data: any) => {
  const { id, name, modules } = data;
  await prisma.user.update({
    where: {
      id,
    },
    data: {
      name,
      profile: {
        update: {
          modules,
        },
      },
    },
  });

  revalidateTag("companyDetails");
};

export const fetchUserInfo = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: true,
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          primaryColor: true,
          secondaryColor: true,
        },
      },
    },
  });

  return user;
};

export const updateProfile = async (data: any) => {
  const { id, name, password, role } = data;

  let newData: any = {
    name,
  };

  if (password) newData = { ...newData, hashedPassword: hashSync(password, 12) };

  if (role === "ADMIN") {
    const { companyName, companyLogo, primaryColor, secondaryColor } = data;

    let companyData: any = {
      name: companyName,
      primaryColor,
      secondaryColor,
    };

    if (companyLogo) companyData = { ...companyData, logo: companyLogo };

    newData = {
      ...newData,
      company: {
        update: { ...companyData },
      },
    };
  }

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      ...newData,
    },
  });

  revalidatePath("/");
};

export const processIntakeForm = async (title: string, id: string, data: any) => {
  if (title === "Discovery Framework") {
    const company = await prisma.company.findFirst({
      where: {
        id,
      },
      select: {
        name: true,
        modules: true,
      },
    });

    if (company) {
      const modules = company["modules"] as any[];
      const discoveryFramework = modules.filter((module: any) => module.title === title)[0];
      discoveryFramework.subscription = "pending";
      discoveryFramework.data.answers = data;

      await prisma.company.update({
        where: {
          id,
        },
        data: {
          modules,
        },
      });

      const companyName = company.name;

      await resend.emails.send({
        from: "Pipeline Conversion Kit <noreply@pipelineconversionkit.com>",
        to: "admin@pipelineconversionkit.com",
        subject: `Discovery Framework Intake Form Submission for ${companyName}`,
        react: DiscoveryFramework({ companyName }) as React.ReactElement,
      });
    }
  }

  revalidateTag("companyDetails");
};

export const updateUserModule = async (title: string, id: string, data: any) => {
  if (title === "Discovery Framework") {
    const user = await prisma.user.findFirst({
      where: {
        id,
      },
      select: {
        profile: {
          select: {
            modules: true,
          },
        },
      },
    });

    const modules = user?.profile?.modules as any[];
    const discoveryFramework = modules.filter((module: any) => module.title === title)[0];
    discoveryFramework.data = data;

    await prisma.user.update({
      where: {
        id,
      },
      data: {
        profile: {
          update: {
            modules,
          },
        },
      },
    });
  }
};

export const updateCompanyModule = async (title: string, id: string, data: any) => {
  if (title === "Discovery Framework") {
    const company = await prisma.company.findFirst({
      where: {
        id,
      },
      select: {
        modules: true,
      },
    });

    const modules = company?.modules as any[];
    const discoveryFramework = modules.filter((module: any) => module.title === title)[0];
    discoveryFramework.subscription = "active";
    discoveryFramework.data.default = data;

    await prisma.company.update({
      where: {
        id,
      },
      data: {
        modules,
      },
    });
  }
};

export const fetchCompanyInfo = async (id: string) => {
  const company = await prisma.company.findFirst({
    where: {
      id: id,
    },
  });

  return company;
};

async function _deleteUser(id: string) {
  await prisma.$transaction([
    prisma.user.update({
      where: {
        id,
      },
      data: {
        profile: {
          delete: true,
        },
        company: {
          disconnect: true,
        },
      },
    }),
    prisma.user.delete({
      where: {
        id,
      },
    }),
  ]);

  return true;
}
