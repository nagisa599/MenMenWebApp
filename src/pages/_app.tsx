import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";  //contextである。これで囲まれるとuseSessionやsignin,singoutなどが使える。
import '@/styles/globals.css'
import { initializeFirebaseApp } from '../lib/firebase/firebase';
import { useEffect } from "react";


// 必ずページにアクセスにしたときにアクセス。
initializeFirebaseApp ();
function MyApp({
  Component,
  pageProps: { session, ...pageProps },
  router
}: AppProps) {
  useEffect(() => {
    // ここに全ページ共通で行う処理
    router.push("/LogIn");
  }, []);
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;