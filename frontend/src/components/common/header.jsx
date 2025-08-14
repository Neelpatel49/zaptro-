import Topbar from "../layout/Topbar";
import Navbar from "./navbar";

const Header = () => {
  return (
    <header className="border-b border-gray-200">
      {/* Topbar */}
      <Topbar />
      {/* navbar */}
      <Navbar />
      {/* Cart Drawer */}
    </header>
  );
};
export default Header;
