import { Outlet } from "react-router-dom";

import Logo from "components/Logo";

function Auth() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="w-full max-w-md">
        <div className="flex justify-center items-center mb-8">
          <Logo />
        </div>
        <Outlet />
      </div>
    </div>
  );
}

export default Auth;

export const Component = Auth;
