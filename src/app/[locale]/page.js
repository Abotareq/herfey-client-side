import "./globals.css";
// import SwiperComponent from "./components/Swiper";
import Services from "./components/Services";
import BetsSeller from "./components/BetsSeller";
import CategoryLinks from "./components/CategoryLinks";
import HeroSlideshow from "./components/HeroSlideshow";
export default function Home() {
  return (
    <>
      {/* <SwiperComponent /> */}

      <h1 className="sr-only">Herafy</h1>
      <HeroSlideshow />
      <CategoryLinks />

      <BetsSeller />
      <Services />
    </>
  );
}
