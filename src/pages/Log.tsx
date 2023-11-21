import { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const session = useSession();
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn("credentials", {
        redirect: false,
        mail: mail,
        password: password,
      }).then((res) => {
        if (res?.error) {
          console.log(res.error);
          setError("認証情報が正しくありません。");
        } else {
          router.push('/Coupon');
        }
      });
    } catch (err) {
      console.log(err);

    }
  };

  return (
    <div className="in-h-screen flex items-center justify-center bg-blue-500">
      <div className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-semibold text-blue-500 mb-4">ログインページ</h1>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              メールアドレス
            </label>
            <input
              type="email"
              id="email"
              value={mail}
              onChange={(e) => {
                setMail(e.target.value);
              }}
              className="mt-1 p-2 w-full rounded border border-gray-300"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              パスワード
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="mt-1 p-2 w-full rounded border border-gray-300"
            />
          </div>
          <div className="text-red-500">
            {error}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-700 text-white p-2 rounded hover:bg-blue-800"
          >
            ログイン
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
