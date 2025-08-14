import { Outlet } from "react-router-dom";
import Footer from "../common/Footer";
import Header from "../common/Header";

const UserLayout = () => {
  return (
    <>
      {/* Header */}
      <Header />
      {/* Main content */}
      <main>
        <Outlet />
      </main>
      {/* Footer */}
      <Footer />
    </>
  );
};
export default UserLayout;
