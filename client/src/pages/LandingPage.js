import NavbarCertif from "./components/Navbar";
import MainPage from "./homepage/MainPage";
import FeaturePage from "./homepage/FeaturePage";
import OurStoryPage from "./homepage/OurStoryPage";
import Footer from "./components/Footer";

function LandingPage() {
  return (
    <div>
      <NavbarCertif />
      <MainPage />
      <FeaturePage />
      <OurStoryPage />
      <Footer />
    </div>
  );
}
export default LandingPage;
