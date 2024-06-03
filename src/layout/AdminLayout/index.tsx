import { LoginOutlined } from "@ant-design/icons";
import { useLocalStorageState } from "ahooks";
import { Dropdown, MenuProps, Space } from "antd";
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import styles from "./index.module.less";

const navList = [
  {
    title: "Dashboard",
    url: "/admin/dashboard",
  },
  {
    title: "Retrieval",
    url: "/admin/retrieval",
  },
];

const AdminLayout = () => {
  const [, setToken] = useLocalStorageState("token");
  const navigate = useNavigate();

  const location = useLocation();
  const [navIndex, setNavIndex] = useState(
    navList.findIndex((item) => item.url == location.pathname),
  );
  const [navActiveLineTranslateX, setNavActiveLineTranslateX] = useState(
    navIndex * 106,
  );

  useEffect(() => {
    if (location.pathname == "/admin/") {
      navigate("/admin/dashboard");
    }
    console.log("navIndex: ", navIndex);
    // changeNav(navList.findIndex((item) => item.url == location.pathname));
  }, [location]);

  const changeNav = (index: number) => {
    setNavActiveLineTranslateX(index * 106);
    setNavIndex(index);
    navigate(navList[index].url);
  };

  const logout = () => {
    setToken("");
    navigate("/login");
  };

  const avatarMenus: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Space onClick={logout}>
          <LoginOutlined />
          <span>登出</span>
        </Space>
      ),
    },
  ];

  return (
    <div className={styles.AdminLayout}>
      <div className={styles.Header}>
        <div className={styles.Left}>
          <div className={styles.Title}>Blog Admin</div>
          <div className={styles.NavGroup}>
            {navList.map((value, index) => {
              return (
                <div
                  key={index}
                  className={`${styles.NavItem} ${index == navIndex ? styles.ActiveNavItem : ""}`}
                  onClick={() => {
                    changeNav(index);
                  }}
                >
                  {value.title}
                </div>
              );
            })}
            <div
              className={`${styles.ActiveLine}`}
              style={{ transform: `translateX(${navActiveLineTranslateX}px)` }}
            />
          </div>
        </div>
        <div className={styles.Right}>
          <Dropdown menu={{ items: avatarMenus }}>
            <div className={styles.Avatar}>HD</div>
          </Dropdown>
        </div>
      </div>
      <div className={styles.Content}>
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
