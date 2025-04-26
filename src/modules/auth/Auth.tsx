import { Outlet } from "react-router-dom";

import Logo from "components/Logo";

function Auth() {
  return (
    <div className="h-full flex justify-center pt-10">
      <div className="w-full max-w-lg">
        <div className="flex justify-center items-center mb-10">
          <Logo />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;

export const Component = Auth;
