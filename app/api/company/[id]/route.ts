import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const company = await prisma.company
    .findFirst({
      where: {
        id,
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            role: true,
            status: true,
            profile: {
              select: {
                modules: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    })
    .catch((error) => {
      return { error: error.meta.message };
    });

  if (!company) return NextResponse.json({ error: "Company not found." });

  return NextResponse.json(company);
}
