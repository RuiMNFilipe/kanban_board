"use client";

import Link from "next/link";

import type { AppRoute } from "@/constants/routes";

export default function BackButton({
  route,
  text,
}: {
  route: AppRoute;
  text: string;
}) {
  return <Link href={route}>{text}</Link>;
}
