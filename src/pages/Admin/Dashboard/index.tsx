import {PlusOutlined} from "@ant-design/icons";
import {Affix, Space} from "antd";
import { useState} from "react";
import EditorBlogModal from "../../../components/EditorBlogModal";
import styles from "./index.module.less"


const Dashboard = () => {
    const [blogCardAreaTopAffix, setBlogCardAreaTopAffix] = useState<boolean>(false)
    const [editorBlogModalVisible, setEditorBlogModalVisible] = useState(false)

    const createBlog = () => {
        setEditorBlogModalVisible(true)
        // 创建博客
    }

    return (
        <>
            <div className={styles.Dashboard}>
                <div className={styles.Left}>
                    <div className={styles.Welcome}>
                        <div className={styles.Title1}>
                            👋 Hi Dong, welcome to Blog admin
                        </div>
                        <div className={styles.Title2}>
                            Create a blog in minutes.
                        </div>
                    </div>

                    <div className={styles.BlogCardArea}>
                        <Affix onChange={(v) => {
                            console.log("v: ", v)
                            setBlogCardAreaTopAffix(v ?? false)
                        }}>
                            <div className={`${styles.Top} ${blogCardAreaTopAffix ? styles.TopAffix : ''}`}>
                                <div className={styles.Title}>
                                    ✨ Your Blog
                                </div>
                                <Space className={styles.CreateBtn} onClick={createBlog}>
                                    <PlusOutlined/>
                                    <span>
                                Create New
                            </span>
                                </Space>
                            </div>
                        </Affix>
                        <div className={styles.BlogCardGroup}>
                            {
                                Array.from(Array(10).keys()).map((_, index) => {
                                    return (
                                        <div className={styles.BlogCardItem} key={index}>
                                            <div>
                                                <div className={styles.Banner}></div>
                                                <div className={styles.ContentWrap}>
                                                    <div className={styles.ContentTitle}>
                                                        Asian Amer207 n and Pacific Islander Herita...
                                                    </div>
                                                    <div className={styles.ContentDes}>
                                                        Use this course to educate your team and expand their cultural
                                                        knowledge,
                                                        opening...
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={styles.TagGroup}>
                                                <div className={styles.TagItem}>
                                                    Tag1
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <EditorBlogModal visible={editorBlogModalVisible} onClose={() => {
                setEditorBlogModalVisible(false)
            }}/>
        </>

    );
};

export default Dashboard;
