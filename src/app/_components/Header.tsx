"use client"

import Link from "next/link";

export const Header = () => {
  return (
    <>
    <header className="flex justify-between p-5 font-bold bg-neutral-800 font-sans text-white">
      <div><Link href="/">Blog</Link></div>
      <div><Link href="/contact">お問い合わせ</Link></div>
    </header>

    </>
  );
}