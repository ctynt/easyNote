import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import TextAlign from '@tiptap/extension-text-align';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import { translateText } from '@/api/translateApi';
import { message } from 'antd';
import './TiptapEditor.css';
import { uploadImage } from '../api/uploadApi';
const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const colors = [
    '#000000',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
  ];

  return (
    <div className="tiptap-menu">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
        title="加粗"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
        title="斜体"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive('strike') ? 'is-active' : ''}
        title="删除线"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M17.154 14c.23.516.346 1.09.346 1.72 0 1.342-.524 2.392-1.571 3.147C14.88 19.622 13.433 20 11.586 20c-1.64 0-3.263-.381-4.87-1.144V16.6c1.52.877 3.075 1.316 4.666 1.316 2.551 0 3.83-.732 3.839-2.197a2.21 2.21 0 0 0-.648-1.603l-.12-.117H3v-2h18v2h-3.846zm-4.078-3H7.629a4.086 4.086 0 0 1-.481-.522C6.716 9.92 6.5 9.246 6.5 8.452c0-1.236.466-2.287 1.397-3.153C8.83 4.433 10.271 4 12.222 4c1.471 0 2.879.328 4.222.984v2.152c-1.2-.687-2.515-1.03-3.946-1.03-2.48 0-3.719.782-3.719 2.346 0 .42.218.786.654 1.099.436.313.974.562 1.613.75.62.18 1.297.414 2.03.699z" />
        </svg>
      </button>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        title="标题1"
      >
        H1
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        title="标题2"
      >
        H2
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        title="标题3"
      >
        H3
      </button>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
        title="无序列表"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M8 4h13v2H8V4zM4.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm0 6.9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM8 11h13v2H8v-2zm0 7h13v2H8v-2z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'is-active' : ''}
        title="有序列表"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M8 4h13v2H8V4zM5 3v3h1v1H3V6h1V4H3V3h2zm-2 9h3v1h1v2H6v1H4v-2H3v-1h2zm0 7h3v1h1v2H6v1H4v-2H3v-1h2zm5-5h13v2H8v-2zm0 7h13v2H8v-2z" />
        </svg>
      </button>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive('codeBlock') ? 'is-active' : ''}
        title="代码块"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M16.95 8.464l1.414-1.414 4.95 4.95-4.95 4.95-1.414-1.414L20.485 12 16.95 8.464zm-9.9 0L3.515 12l3.535 3.536-1.414 1.414L.686 12l4.95-4.95L7.05 8.464z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'is-active' : ''}
        title="引用"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 0 1-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z" />
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        title="水平线"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M2 11h2v2H2v-2zm4 0h12v2H6v-2zm14 0h2v2h-2v-2z" />
        </svg>
      </button>
      <div className="divider"></div>
      <button
        onClick={() => {
          const url = window.prompt('输入链接URL');
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        className={editor.isActive('link') ? 'is-active' : ''}
        title="插入链接"
      >
        链接
      </button>
      <input
        type="file"
        id="image-upload"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={async (e) => {
          const file = e.target.files[0];
          if (file) {
            try {
              message.loading('正在上传图片...', 0);
              const response = await uploadImage(file);
              if (response.data.success) {
                editor
                  .chain()
                  .focus()
                  .setImage({ src: response.data.url })
                  .run();
                message.destroy();
                message.success('图片上传成功');
              } else {
                throw new Error('上传失败');
              }
            } catch (error) {
              message.destroy();
              message.error('图片上传失败');
              console.error('Failed to upload image:', error);
            }
            e.target.value = null; // 清空input的值，允许上传相同的图片
          }
        }}
      />
      <button
        onClick={() => {
          document.getElementById('image-upload').click();
        }}
        title="添加图片"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M4.828 21l-.02.02-.021-.02H2.992A.993.993 0 0 1 2 20.007V3.993A1 1 0 0 1 2.992 3h18.016c.548 0 .992.445.992.993v16.014a1 1 0 0 1-.992.993H4.828zM20 15V5H4v14L14 9l6 6zm0 2.828l-6-6L6.828 19H20v-1.172zM8 11a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
        </svg>
      </button>
      <button onClick={() => editor.chain().focus().undo().run()} title="撤销">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M5.828 7l2.536 2.536L6.95 10.95 2 6l4.95-4.95 1.414 1.414L5.828 5H13a8 8 0 1 1 0 16H4v-2h9a6 6 0 1 0 0-12H5.828z" />
        </svg>
      </button>
      <button onClick={() => editor.chain().focus().redo().run()} title="重做">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M18.172 7H11a6 6 0 1 0 0 12h9v2h-9a8 8 0 1 1 0-16h7.172l-2.536-2.536L17.05 1.05 22 6l-4.95 4.95-1.414-1.414L18.172 7z" />
        </svg>
      </button>
      <div className="divider"></div>
      <select
        onChange={(e) => {
          editor.chain().focus().setColor(e.target.value).run();
        }}
        value={editor.getAttributes('textStyle').color || '#000000'}
        title="文字颜色"
      >
        {colors.map((color) => (
          <option key={color} value={color} style={{ color }}>
            {color}
          </option>
        ))}
      </select>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}
        title="左对齐"
      >
        <svg
          t="1746710840505"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="2583"
          width="24"
          height="24"
        >
          <path
            d="M96 128h832v96H96zM96 576h832v96H96zM96 352h576v96H96zM96 800h576v96H96z"
            p-id="2584"
          ></path>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}
        title="居中对齐"
      >
        <svg
          t="1746710892776"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="5602"
          width="24"
          height="24"
        >
          <path
            d="M96 128h832v96H96zM96 576h832v96H96zM224 352h576v96H224zM224 800h576v96H224z"
            p-id="5603"
          ></path>
        </svg>
      </button>
      <button
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}
        title="右对齐"
      >
        <svg
          t="1746710874815"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="4576"
          width="24"
          height="24"
        >
          <path
            d="M96 128h832v96H96zM96 576h832v96H96zM352 352h576v96H352zM352 800h576v96H352z"
            p-id="4577"
          ></path>
        </svg>
      </button>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleHighlight().run()}
        className={editor.isActive('highlight') ? 'is-active' : ''}
        title="高亮"
      >
        <svg
          t="1746711427566"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="7686"
          width="24"
          height="24"
        >
          <path
            d="M957.344 875.008l-124.928-124.928c-12.512-12.512-32.736-12.512-45.248 0l-45.248 45.248-271.52-271.52c37.312-37.312 37.312-97.76 0-135.072L247.552 165.888c-37.312-37.312-97.76-37.312-135.072 0L66.688 211.136c-37.312 37.312-37.312 97.76 0 135.072l222.848 222.848c37.312 37.312 97.76 37.312 135.072 0l271.52 271.52-45.248 45.248c-12.512 12.512-12.512 32.736 0 45.248l124.928 124.928c12.512 12.512 32.736 12.512 45.248 0l136.288-136.288c12.512-12.512 12.512-32.736 0-45.248z"
            p-id="7687"
          ></path>
        </svg>
      </button>
      <div className="divider"></div>
      <button
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        className={editor.isActive('taskList') ? 'is-active' : ''}
        title="任务列表"
      >
        <svg
          t="1746711427566"
          class="icon"
          viewBox="0 0 1034 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="7686"
          width="24"
          height="24"
        >
          <path
            d="M302.638545 932.677818v-93.090909h709.02691v93.090909z m0-297.472v-93.090909h709.02691v93.090909z m-256-291.467636L115.432727 281.041455l98.071273 107.706181 261.678545-295.610181 69.818182 61.672727-330.472727 373.201454z m592.663273-6.050909v-93.090909h372.363637v93.090909z"
            p-id="7687"
          ></path>
        </svg>
      </button>
      <div className="divider"></div>
      <button
        onClick={async () => {
          const selection = editor.state.selection;
          const text = editor.state.doc.textBetween(
            selection.from,
            selection.to,
            ' ',
          );
          if (!text) {
            message.warning('请先选择要翻译的文本');
            return;
          }
          try {
            message.loading('正在翻译...', 0);
            const translatedText = await translateText(text);
            editor.chain().focus().insertContent(translatedText).run();
            message.destroy();
            message.success('翻译完成');
          } catch (error) {
            message.destroy();
            message.error('翻译失败，请稍后重试');
          }
        }}
        title="翻译选中文本"
      >
        <svg
          t="1746711427566"
          className="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
        >
          <path
            d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64z m146.4 612.3c-2.8 4.1-7.4 6.6-12.3 6.6-2.9 0-5.8-0.9-8.3-2.6l-125.8-86.6c-4.1-2.8-6.6-7.4-6.6-12.3V352c0-8.3 6.7-15 15-15s15 6.7 15 15v219.8l118.3 81.4c6.9 4.7 8.6 14.1 3.9 21z"
            fill="currentColor"
          />
        </svg>
      </button>
      <button
        onClick={() => {
          editor
            .chain()
            .focus()
            .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
            .run();
        }}
        title="插入表格"
      >
        <svg
          t="1746711385583"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6683"
          width="24"
          height="24"
        >
          <path
            d="M960 64H64v224h1v164h-1v64h1v160h-1v64h1v219.7h275v0.3h64v-0.3h216v0.3h64v-0.3h275V288h1V64zM620 452H404V288h216v164z m0 224H404V516h216v160z m64-160h211v160H684V516zM129 288h211v164H129V288z m0 228h211v160H129V516z m0 379.7V740h211v155.7H129z m275 0V740h216v155.7H404z m280 0V740h211v155.7H684zM895 452H684V288h211v164z"
            fill="#727272"
            p-id="6684"
          ></path>
        </svg>
      </button>
    </div>
  );
};

const TiptapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: '开始编写笔记...',
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Table.configure({
        resizable: true,
        handleWidth: 5,
        cellMinWidth: 100,
        lastColumnResizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle.configure({
        types: ['textStyle'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value || '', // 初始化防止 undefined
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '', false); // 第二个参数 false 表示不推 undo history
    }
  }, [editor, value]);

  return (
    <div className="tiptap-editor-wrapper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="tiptap-editor-content" />
    </div>
  );
};

export default TiptapEditor;
