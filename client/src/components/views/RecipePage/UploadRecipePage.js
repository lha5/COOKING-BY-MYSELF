import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { uploadRecipe } from '../../../_actions/recipe_actions';

import 'codemirror/lib/codemirror.css';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Editor } from '@toast-ui/react-editor';
import 'tui-color-picker/dist/tui-color-picker.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
import '@toast-ui/editor/dist/i18n/ko-kr';

import '../../../assets/css/uploadPage.scss'

const categories = [
    { key: 1, value: '한식'},
    { key: 2, value: '양식'},
    { key: 3, value: '일식'},
    { key: 4, value: '중식'},
    { key: 5, value: '아시안'},
    { key: 6, value: '베이킹/디저트'},
    { key: 7, value: '기타'}
];

function UploadRecipePage(props) {
    const dispatch = useDispatch();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState(1);
    const textEditorRef = useRef();
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);

    const titleChangeHandler = (event) => {
        setTitle(event.currentTarget.value);
    };
    const categoryChangeHandler = (event) => {
        setCategory(event.currentTarget.value);
    };
    const contentChangeHandler = (event) => {
        setContent(textEditorRef.current.getInstance().getHtml());
    };

    const addImageHandler = (blob) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        };
        formData.append('file', blob);

        return axios.post('/api/recipe/image', formData, config)
            .then(response => {
                if (response.data.success) {
                    setImages([...images, response.data.filePath]);
                    return response.data;
                } else {
                    alert('이미지를 저장할 수 없습니다.');
                }
            });
    }

    const submitHandler = async (event) => {
        event.preventDefault();

        if (!title || !category || !content) {
            return alert('모든 항목을 작성해주세요.');
        }

        const dataToSubmit = {
            writer: props.user.userData._id,
            title: title,
            category: category,
            content: content,
            images: images
        };

        await dispatch(uploadRecipe(dataToSubmit))
            .then(response => {
                if (response.payload.success) {
                    alert('레시피 업로드 완료');
                    props.history.push('/recipe');
                } else {
                    alert('레시피 업로드 실패');
                }
            });
    };

    return (
        <div className="uploadRecipe">
            <div className="pageTitle">레시피 올리기</div>
            <form
                onSubmit={submitHandler}
            >
                <div className="editor">
                    제목
                    <br />
                    <input
                        type="text"
                        value={title}
                        onChange={titleChangeHandler}
                    />
                </div>
                <div className="editor">
                    카테고리
                    <br />
                    <select onChange={categoryChangeHandler} value={category}>
                        { categories.map(item =>(
                            <option key={item.key} value={item.key}>{item.value}</option>
                        ))}
                    </select>
                </div>
                <div className="editor editorContents">
                    <div>레시피</div>
                    <Editor
                        initialValue={content}
                        previewStyle="vertical"
                        height="450px"
                        minHeight="150px"
                        initialEditType="wysiwyg"
                        useCommandShortcut={true}
                        language="ko-KR"
                        plugins={[colorSyntax, tableMergedCell]}
                        ref={textEditorRef}
                        onChange={contentChangeHandler}
                        hooks={
                            {
                                addImageBlobHook: async (blob, callback) => {
                                    const uploadBlob = await addImageHandler(blob);
                                    const imageURL = uploadBlob.filePath;
                                    const replaced = imageURL.replace(/\\/g, '/');
                                    callback(replaced, uploadBlob.fileName);
                                    return false;
                                }
                            }
                        }
                    />
                </div>
                <div className="editor buttonSection">
                    <button type="submit" className="submitButton">올리기</button>
                </div>
            </form>
        </div>
    );
}

export default UploadRecipePage;