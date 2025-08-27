import "./globals.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
// import SwiperComponent from "./components/Swiper";
import Services from "./components/Services";
import BetsSeller from "./components/BetsSeller";
import CategoryLinks from "./components/CategoryLinks";
import ModernImageSwiper from "./components/ModernSwipper";
export default function Home() {
  return (
    <>
      {/* <SwiperComponent /> */}

      <ModernImageSwiper />
      <CategoryLinks />

      <BetsSeller />
      <Services />
    </>
  );
}
