import { Outlet } from "react-router-dom";

import Logo from "components/Logo";

function Auth() {
  return (
    <div className="flex justify-center items-center bg-[#F6F8FB]">
      <div>
        <Logo className="mb-4 lg:hidden block" />
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;

export const Component = Auth;
