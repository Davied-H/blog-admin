import {HolderOutlined, PlusOutlined} from "@ant-design/icons";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import React, {useEffect, useRef, useState} from "react";
import styles from "./index.module.less";

interface ContentRowProps {
    id: string
    focusId: string
    content: string
    onClick: (event: React.FormEvent<HTMLDivElement>) => void
    onEnter: () => void
    onRemove: () => void
    onChange?: (content: string) => void
    onBlur?: (event: React.FormEvent<HTMLDivElement>) => void
}

function getSelectedHTML() {
    const selection = window.getSelection();
    if (selection) {
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const clonedFragment = range.cloneContents(); // 克隆选区内容，不会修改文档
            const tempDiv = document.createElement('div');
            tempDiv.appendChild(clonedFragment);
            return tempDiv.innerHTML;
        } else {
            return '';
        }
    } else {
        return ''
    }
}

export const ContentRow = (props: ContentRowProps) => {
    const editableRef = useRef<HTMLDivElement>(null);
    const [showToolbar, setShowToolbar] = useState(false);
    const [toolbarPosition, setToolbarPosition] = useState({top: 0, left: 0});
    const [selectedText, setSelectedText] = useState('');
    const [selectedRange, setSelectedRange] = useState<Range>();
    const [isQuickToolExpand, setIsQuickToolExpand] = useState(false)
    const [isInput, setIsInput] = useState(false)
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    useEffect(() => {
        window.addEventListener('resize', handleMouseUp);
        return () => window.removeEventListener('resize', handleMouseUp);
    }, []);

    useEffect(() => {
        if (props.focusId == props.id) {
            onFocusNow()
        }else {
            setShowToolbar(false)
        }
    }, [props.focusId]);

    useEffect(() => {
        const handleSelectionChange = () => {
            const selection = window.getSelection();
            if (selection) {
                // console.log("selection.rangeCount: ",selection.rangeCount)
                if (selection.rangeCount > 0) {
                    if (selection!.toString()) {
                        setSelectedRange(selection.getRangeAt(0))
                        setSelectedText(getSelectedHTML());
                    }
                }
            }
        };
        document.addEventListener('selectionchange', handleSelectionChange);
        // 组件卸载时移除事件监听器
        return () => {
            document.removeEventListener('selectionchange', handleSelectionChange);
        };
    }, []);

    const handleToolbarAction = (action: string, event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {

        // 替换选区样式
        if (selectedText) {
            switch (action) {
                case "bold":
                    props.onChange?.(props.content.replace(selectedText, `<b>${selectedText}</b>`));
                    break
                case "italic":
                    props.onChange?.(props.content.replace(selectedText, `<i>${selectedText}</i>`));
                    break
            }
        }

        // 恢复选区
        if (selectedRange) {
            window.getSelection()!.removeAllRanges();
            window.getSelection()!.addRange(selectedRange);
        }

        event.stopPropagation()
    }

    const handleMouseUp = () => {
        console.log("handleMouseUp")
        const selection = window.getSelection();
        console.log("props.focusId == props.id",props.focusId == props.id)
        console.log("selection.toString(): ",selection!.toString())
        console.log("selection: ",selection)
        if (selection && selection.toString() ) {
            console.log("selection.toString():",selection.toString())
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setShowToolbar(true);
            // 计算工具栏位置，并进行适当的偏移调整
            console.log("window.scrollY:",window.scrollY)
            setToolbarPosition({
                top:  70, // 50 是工具栏的估计高度
                left: rect.left + window.scrollX + rect.width / 2 - 180, // 80 是工具栏的估计宽度的一半
            });
        } else {
            setShowToolbar(false);
        }
    };

    const onFocus = (event: React.FormEvent<HTMLDivElement>) => {
        if (editableRef.current) {
            // 如果点击的是当前行则选中
            if (event.target === editableRef.current) {
                // 将 event.target 转换为 HTMLElement
                const clickedElement = event.target as HTMLElement;
                const range = window.getSelection()!.getRangeAt(0);

                // 获取点击位置
                const clickedOffset = clickedElement.textContent!.length;

                if (clickedOffset < props.content.length) {
                    // 设置选区范围
                    range.setStart(clickedElement, clickedOffset);
                    range.setEnd(clickedElement, clickedOffset);
                }


                // 更新选区
                const selection = window.getSelection();
                selection!.removeAllRanges();
                selection!.addRange(range);
            }
        }
    };

    const onFocusNow = () => {
        if (editableRef.current) {
            const range = document.createRange();
            const editableContent = editableRef.current;

            // 获取最后一个子节点
            const lastNode = editableContent.childNodes[editableContent.childNodes.length - 1];

            if (lastNode) {
                // 如果存在最后一个子节点，将光标定位到其末尾
                range.setStart(lastNode, lastNode.textContent!.length);
                range.setEnd(lastNode, lastNode.textContent!.length);
            } else {
                // 如果没有子节点，将光标定位到 contentEditable 元素的末尾
                range.setStart(editableContent, editableContent.textContent!.length);
                range.setEnd(editableContent, editableContent.textContent!.length);
            }

            const selection = window.getSelection();
            if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
            }

            editableRef.current.focus();
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            props.onEnter?.()
            event.preventDefault();
        }
        if (event.key === "Backspace") {
            const remainLength = editableRef.current?.innerHTML.length ?? 0
            if ( remainLength < 2) {
                console.log("editableRef.current?.innerHTML.length: ",remainLength)
                setIsInput(false)
            }
            if (editableRef.current?.innerHTML == "") {
                props.onRemove()
                event.preventDefault();
            }
        }


    };

    return (
        <div ref={setNodeRef} style={style} className={styles.ContentRowWrap}>
            <div ref={editableRef}
                 id={`content_row_${props.id}`}
                 className={styles.ContentRow}
                 contentEditable={true}
                 onBlur={props.onBlur}
                 onInput={() => {
                     if (editableRef.current) {
                         if (editableRef.current.innerHTML.toString()) {
                             setIsInput(true)
                         }
                     }
                 }}
                 onClick={(event) => {
                     handleMouseUp()
                     onFocus(event)
                     props.onClick(event)
                 }}
                // onMouseUp={handleMouseUp}
                 onMouseUp={showToolbar ? (e) => e.stopPropagation() : handleMouseUp}
                 onKeyDown={handleKeyDown}
                 dangerouslySetInnerHTML={{__html: props.content}}
            />

            <div className={styles.Drag} {...attributes} {...listeners}   >
                <HolderOutlined/>
            </div>

            <div
                className={`${styles.QuickTool} ${(props.focusId == props.id && !isInput) ? styles.QuickToolShow : styles.QuickToolHidden} ${isQuickToolExpand ? styles.QuickToolExpand : ''}`}
                onClick={() => {
                    setIsQuickToolExpand(!isQuickToolExpand)
                }}>
                <PlusOutlined/>
            </div>
            {showToolbar && (
                <div

                    className={styles.ToolbarWrap}
                    style={{
                        top: toolbarPosition.top - 20,
                        left: toolbarPosition.left,
                    }}
                >
                    <div className={styles.Toolbar}>
                        <div className={styles.Corner}/>
                        <div className={styles.ToolbarItem} onClick={(event) => handleToolbarAction('bold', event)}>B
                        </div>
                        <div className={styles.ToolbarItem}
                             onClick={(event) => handleToolbarAction('italic', event)}>I
                        </div>
                        <div className={styles.ToolbarItem}
                             onClick={(event) => handleToolbarAction('underline', event)}>U
                        </div>
                    </div>
                </div>
            )}


        </div>
    )
}
