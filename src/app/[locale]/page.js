import "./globals.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import SwiperComponent from "./components/Swiper";
import Services from "./components/Services";
import BetsSeller from "./components/BetsSeller";
import CategoryLinks from "./components/CategoryLinks";
export default function Home() {
  return (
    <>
      <SwiperComponent />
      <CategoryLinks />

      <Services />
      <BetsSeller />
    </>
  );
}
