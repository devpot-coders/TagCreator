import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

const Index = () => {

  return (
    <>
      <Header/>
    <div className="min-h-screen bg-background flex flex-col">

      <div className="flex flex-1 overflow-x-scroll">
        <Sidebar />
          <div className="w-full">
            <Outlet/>
          </div>

      </div>
    </div>
    </>
  );
};

export default Index;
