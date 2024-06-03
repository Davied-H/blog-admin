import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 设置 3 秒后跳转到首页
        const timer = setTimeout(() => {
            navigate('/admin/');
        }, 3000);

        // 清除定时器，防止内存泄漏
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div>
            <h1>404 - Not Found!</h1>
            <p>您要查找的页面不存在，即将跳转到首页...</p>
        </div>
    );
};

export default NotFoundPage;
