"use client";
import Image from "next/image";
import { RxDashboard, RxExit } from "react-icons/rx";
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from "react-icons/md";
import { TbReportAnalytics } from "react-icons/tb";
import { MdOutlineManageAccounts } from "react-icons/md";
import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Tooltip } from "@nextui-org/react";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: RxDashboard,
  },
  {
    name: "Manage Faculty",
    href: "/admin/faculty",
    icon: MdOutlineManageAccounts,
  },
  {
    name: "Manage Students",
    href: "/admin/students",
    icon: MdOutlineManageAccounts,
  },
  {
    name: "Clusters",
    href: "/admin/clusters",
    icon: TbReportAnalytics,
  },
  {
    name: "Profile",
    href: "/admin/profile",
    icon: TbReportAnalytics,
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebarCollapse = () => {
    setIsCollapsed((prevState) => !prevState);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.replace("/");
  };

  return (
    <div className={`h-screen sidebar__wrapper ${isCollapsed ? 'collapsed' : ''}`}>
      <button className="btn shadow-xl" onClick={toggleSidebarCollapse}>
        {isCollapsed ? <MdKeyboardArrowRight /> : <MdKeyboardArrowLeft />}
      </button>
      <aside className="sidebar rounded-r-lg shadow-2xl bg-primary-500 text-gray-100" data-collapse={isCollapsed}>
        <div className="sidebar__top text-primary">
          <Image
            width={80}
            height={80}
            className="sidebar__logo rounded-full"
            src="/logoschool.jpeg"
            alt="logoschool"
          />
          <p className="sidebar__logo-name">Admission Pro</p>
        </div>
        <ul className="sidebar__list text-slate-900 dark:text-slate-50">
          {sidebarItems.map(({ name, href, icon: Icon }) => (
            <li className="sidebar__item items-center" key={name}>
              <Link
                className={`sidebar__link ${pathname === href ? "sidebar__link--active" : ""}`}
                href={href}
              >
                <span className="sidebar__icon">
                  <Icon className="inline-block mr-2" />
                </span>
                <span className="sidebar__name">{name}</span>
              </Link>
            </li>
          ))}
          <Tooltip content="Log Out">
            <button onClick={handleSignOut} color="primary" width="30">
              <RxExit className="w-5 h-5 ml-3 my-2" />
            </button>
          </Tooltip>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
