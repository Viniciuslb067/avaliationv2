import { FaHome, FaUsers } from "react-icons/fa";
import { RiComputerLine } from "react-icons/ri";
import { MdAssessment } from "react-icons/md";

export const SiderbarData = [
  {
    title: "Dashboard",
    icon: <FaHome size={32} />,
    link: "/dashboard",
  },
  {
    title: "Usuários",
    icon: <FaUsers size={32}/>,
    link: "/users",
  },
  {
    title: "Avaliações",
    icon: <MdAssessment size={32}/>,
    link: "/assessments",
  },
  {
    title: "Sistemas",
    icon: <RiComputerLine size={32}/>,
    link: "/systems",
  },
];
