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

      {/* 実装機能の詳細 */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3">実装されている認証・認可機能</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>セッションベース認証:</strong> Cookie を使用したセキュアなセッション管理</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>パスワード強度表示:</strong> サインアップ時のリアルタイム強度チェック（1-10レベル）</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>パスワード変更機能:</strong> ログイン後の安全なパスワード更新</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>データ永続化:</strong> セッション維持によるユーザーデータの保持</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-600 font-bold">✓</span>
            <span><strong>認可機能:</strong> ログイン必須ページの適切なアクセス制御</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
