import { Outlet } from "react-router-dom";
import Footer from "../common/footer";
import Header from "../common/header";

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
