import styles from "@/app/page.module.css";
import LandingPage from "./components/LandingPage";
import Games from "./components/Games";
import Pricing from "./components/Pricing";
import FAQs from "./components/FAQs";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className={styles.container}>
      <LandingPage />
      <Games />
      <Pricing />
      <FAQs />
      <Footer />
    </div>
  );
}
