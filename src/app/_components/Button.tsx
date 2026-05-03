import Link from "next/link";

export function CreateButton({ form }: { form?: string }) {
  return (
    <button
      type="submit"
      form={form}
      className="rounded bg-blue-600 mt-4 px-4 py-2 text-white hover:bg-blue-700"
    >
      作成
    </button>
  );
}

export function UpdateButton({ form }: { form?: string }) {
  return (
    <button
      type="submit"
      form={form}
      className="rounded bg-blue-600 mt-4 px-4 py-2 text-white hover:bg-blue-700"
    >
      更新
    </button>
  );
}

export function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded bg-red-600 mt-4 px-4 py-2 text-white hover:bg-red-700"
    >
      削除
    </button>
  );
}

export function BackButton({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="rounded border mt-4 px-4 py-2 hover:bg-gray-100"
    >
      戻る
    </Link>
  );
}