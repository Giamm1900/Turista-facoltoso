import { Outlet } from "react-router";

export const Layout = ()=>{
  return (
        <div className="flex w-full max-w-5xl gap-4">
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
  )
};