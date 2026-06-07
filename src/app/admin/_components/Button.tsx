import Link from "next/link";

export function CreateButton({
  form,
  disabled = false,
}: { 
  form?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      form={form}
      disabled={disabled}
      className="rounded bg-blue-600 mt-4 px-4 py-2 text-white hover:bg-blue-700"
    >
      作成
    </button>
  );
}

export function UpdateButton({
    form,
    disabled = false,
  }: {
    form?: string;
    disabled?: boolean;
  }) {
  return (
    <button
      type="submit"
      form={form}
      disabled={disabled}
      className="rounded bg-blue-600 mt-4 px-4 py-2 text-white hover:bg-blue-700"
    >
      更新
    </button>
  );
}

export function DeleteButton({
    onClick,
    disabled = false,
  }: {
    onClick: () => void;
    disabled?: boolean;
  }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
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