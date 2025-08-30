import NextLink from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

const links = [
  {
    href: "/login",
    label: "ログイン",
    info: "セッションベース認証を使用したログイン機能",
  },
  {
    href: "/signup",
    label: "サインアップ",
    info: "新規ユーザー登録（パスワード強度表示付き）",
  },
  {
    href: "/member",
    label: "メンバーダッシュボード",
    info: "ログイン後のメンバー専用ページ（カウンタ・パスワード変更機能付き）",
  },
];

const Page: React.FC = () => {
  return (
    <main>
      <div className="text-2xl font-bold">SecureAuthApp</div>
      <div className="mt-2 text-slate-600">
        セッションベース認証を使用したセキュアな認証・認可機能のデモアプリケーション
      </div>
      <div className="mt-6 ml-2 gap-y-2">
        {links.map(({ href, label, info }) => (
          <div key={href} className="flex items-center mb-3">
            <FontAwesomeIcon icon={faCode} className="mr-1.5" />
            <NextLink href={href} className="mr-2 hover:underline">
              {label}
            </NextLink>
            <div className="text-xs text-slate-600">※ {info}</div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Page;
