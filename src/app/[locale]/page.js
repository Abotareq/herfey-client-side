import Image from "next/image";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import SignIn from "./singin/page.js";
import SignUp from "./signup/pages.js";
export default function Home() {
  return (
    <>
  {/*     <Header /> */}
     <SignUp />
 {/*      <Footer /> */}
    </>
  );
}
