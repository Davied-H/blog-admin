import {AppstoreOutlined, CloseOutlined} from "@ant-design/icons";
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import type {DragEndEvent} from "@dnd-kit/core/dist/types";
import {arrayMove, SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {useEffect, useState} from "react";
import {ContentRow} from "./ContentRow.tsx";
import styles from "./index.module.less"

interface EditorBlogModalProps {
    visible: boolean
    onClose: () => void
}

interface BlogContentItem {
    id: string
    type: string
    content: string
}

const EditorBlogModal = (props: EditorBlogModalProps) => {
    const [isClose, setIsClose] = useState(false)
    const [blogName, setBlogName] = useState('')
    const [blogContent, setBlogContent] = useState<BlogContentItem[]>([
        {
            id: crypto.randomUUID(),
            type: "text",
            content: "Text Content"
        },
        {
            id: crypto.randomUUID(),
            type: "text",
            content: "Text Content Test Test"
        },
    ])
    const [focusBlogContentRowId, setFocusBlogContentRowId] = useState<string>()
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor)
    );

    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                handlerClose()
            }
        };
        document.addEventListener('keydown', handleEscKey);
    })

    useEffect(() => {
        if (props.visible) {
            setFocusBlogContentRowId(blogContent[0].id)
        }
    }, [props.visible]);

    // 关闭窗口
    const handlerClose = () => {
        setIsClose(true)
        setTimeout(() => {
            props.onClose()
            setIsClose(false)
        }, 300)
    }

    function handleDragEnd(event:DragEndEvent) {
        const {active, over} = event;

        if (active.id !== over!.id) {
            setBlogContent((items) => {
                const oldIndex = items.findIndex(item => item.id === active.id);
                const newIndex = items.findIndex(item => item.id === over!.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    }

    const renderBlogRows = () => blogContent.map((value, index) => {
        return <ContentRow
            focusId={focusBlogContentRowId ?? blogContent[0].id}
            key={value.id}
            id={value.id}
            content={value.content}
            onClick={() => {
                setFocusBlogContentRowId(value.id)
            }}
            onBlur={(event) => {
                const blogContent_ = blogContent
                if (blogContent_[index].content != event.currentTarget.innerHTML) {
                    blogContent_[index].content = event.currentTarget.innerHTML
                    setBlogContent([...blogContent_])
                }
            }}
            onChange={(content) => {
                const blogContent_ = blogContent
                blogContent_[index].content = content
                setBlogContent([...blogContent_])
            }}
            onRemove={() => {
                const blogContent_ = blogContent.filter((_, i) => i != index)
                setFocusBlogContentRowId(blogContent_[index - 1].id)
                setBlogContent([...blogContent_])
            }}
            onEnter={() => {
                const blogContent_ = blogContent

                const newId = crypto.randomUUID()
                blogContent_.splice(index + 1, 0, {
                    id: newId,
                    type: "text",
                    content: ""
                })
                setBlogContent([...blogContent_])
                setFocusBlogContentRowId(newId)
            }}/>
    })


    return (
        <div
            className={`${styles.EditorBlogModal} ${props.visible ? styles.EditorBlogModalShow : styles.EditorBlogModalHidden} ${isClose ? styles.EditorBlogModalClose : ''}`}
            style={{
                transformOrigin: `center top`,
            }}
        >
            <div className={styles.Top}>
                <div className={styles.TopLeft}>
                    <AppstoreOutlined style={{fontSize: '1.6rem'}} className={styles.Btn}/>
                    <input className={styles.BlogName} value={blogName} placeholder={'Blog Name'} onChange={(event) => {
                        setBlogName(event.target.value)
                    }}/>
                </div>
                <div className={styles.TopRight}>
                    <CloseOutlined style={{fontSize: '1.6rem'}} className={styles.Btn} onClick={handlerClose}/>
                </div>
            </div>
            <div className={styles.Content}>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={blogContent}
                        strategy={verticalListSortingStrategy}
                    >
                        {renderBlogRows()}
                        {/*{renderBlogRows_()}*/}
                    </SortableContext>

                </DndContext>

            </div>
        </div>
    );
};

export default EditorBlogModal;
