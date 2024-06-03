import {useLocalStorageState} from "ahooks";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import styles from "./index.module.less"
import bgImage from "./image@1x.png"

const Login = () => {
    const [,setToken] = useLocalStorageState("token")
    const navigate = useNavigate();
    const [signing, setSigning] = useState(false)
    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()

    const onLogin = () => {

        setSigning(true)
        setTimeout(()=>{
            setToken("xxxx")
            navigate("/admin/dashboard")
        },1000)
    }

    return (
        <div className={styles.Login}>
            <div className={styles.Left}>
                <div className={styles.Wrap} style={{backgroundImage: `url(${bgImage})`}}>
                    <p>
                        It's good to<br/>
                        see you
                    </p>
                </div>
            </div>
            <div className={styles.Right}>
                <div className={styles.LoginForm}>
                    <div className={styles.Title}>
                        Your blog admin
                    </div>

                    <div className={styles.InputGroup}>
                        <div className={styles.Title2}>
                            Sign In
                        </div>
                        <input placeholder={"Username"} value={username} className={styles.Input}
                               onChange={(event) => {
                                   setUsername(event.target.value)
                               }}/>
                        <input placeholder={"Password"} value={password} type={"password"} className={styles.Input}
                               onChange={(event) => {
                                   setPassword(event.target.value)
                               }}/>
                    </div>
                    <div className={styles.SubmitBtn} onClick={onLogin}>
                        {signing ? "Signing" : "Continue"}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
