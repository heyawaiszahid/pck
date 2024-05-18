import prisma from "@/prisma/client";
import { hashSync } from "bcrypt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const companies = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
      isActive: true,
      _count: {
        select: {
          users: true,
        },
      },
    },
  });

  return NextResponse.json(companies);
}

export async function PUT(request: NextRequest) {
  const { firstname, lastname, email, password, modules, companyName, companyLogo, primaryColor, secondaryColor } =
    await request.json();

  const hashedPassword = hashSync(password, 12);

  const profileModules: any = [];

  modules.map((module: any) => {
    profileModules.push({
      title: module.title,
      isActive: module.isActive,
      data: null,
    });
  });

  const result = await prisma.user
    .create({
      data: {
        name: `${firstname} ${lastname}`,
        email,
        hashedPassword,
        status: 1,
        profile: {
          create: {
            modules: profileModules,
          },
        },
        company: {
          create: {
            name: companyName,
            logo: companyLogo,
            primaryColor: primaryColor,
            secondaryColor: secondaryColor,
            modules,
          },
        },
      },
    })
    .catch((error) => {
      return error;
    });

  if (!result.code) return NextResponse.json({ success: true });

  if (result.meta.target === "User_email_key") {
    return NextResponse.json({
      error: true,
      title: "Email Already Registered",
      message:
        "The email address you entered is already associated with an existing account. If you forgot your password, you can reset it using the 'Forgot Password' option on the sign-in page.",
    });
  }

  return NextResponse.json({
    error: true,
    title: "Unexpected Error",
    message:
      "Something went wrong. Please try again, and if the issue persists, reach out to our support team for assistance.",
  });
}
