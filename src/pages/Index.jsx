import { Outlet } from "react-router-dom";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";

const Index = () => {

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Templates & Assets */}
        <Sidebar />
        <Outlet/>
      </div>
    </div>
  );
};

export default Index;
