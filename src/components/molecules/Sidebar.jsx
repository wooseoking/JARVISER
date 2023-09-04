import { useState } from "react";
import { useForm } from "react-hook-form";
import Register from "../../pages/Register";
import Login from "../../pages/Login";
import { Link } from "react-router-dom";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  const menus = [
    { name:"회원정보", path:"/myPage" },
    { name:"캘린더", path:"/myCalendar" },
    { name:"회의록", path:"/myReport" },
    { name:"로그아웃", path:"/" }
  ];
  return (
    <div className="sidebar">
      {menus.map((menu, index) => {
        return (
          <Link to={menu.path} key={index}>
            <SidebarItem
              menu={menu}
            />
          </Link>
        );
      })}
    </div>
  );
}
export default Sidebar;