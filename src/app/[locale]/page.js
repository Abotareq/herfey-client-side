import "./globals.css";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import SwiperComponent from "./components/Swiper";
import Services from "./components/Services";
import BetsSeller from "./components/BetsSeller";
export default function Home() {
  return <>
  <SwiperComponent/>
  <Services />
  <BetsSeller />
  </>;
}
