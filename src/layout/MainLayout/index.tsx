import {useLocalStorageState} from "ahooks";
import {useEffect, useState} from "react";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import styles from "./index.module.less";

const MainLayout = () => {
    const [token] = useLocalStorageState<string | undefined>(
        'token',
    );
    const navigate = useNavigate();
    const location = useLocation();
    const [isChange, setIsChange] = useState(false)

    useEffect(() => {
        if (!token) {
            navigate("/login")
            return
        }
        if (location.pathname == "/") {
            navigate("/admin/dashboard")
        }
    }, []);

    useEffect(() => {
        if (location.pathname == "/login" ){
            setIsChange(true)
            setTimeout(()=>{
                setIsChange(false)
            },400)
        }

    }, [location]);

    return (
        <div className={`${styles.MainLayout} ${isChange ? styles.MainAnimation :''}`}>
            <Outlet/>
        </div>
    );
};

export default MainLayout;
