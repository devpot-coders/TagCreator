import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

const Index = () => {

  return (
    <>
      <Header/>
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex flex-1 ">
        <Sidebar />
          <Outlet/>
      </div>
    </div>
    </>
  );
};

export default Index;
