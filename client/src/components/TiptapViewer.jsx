import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Extension } from '@tiptap/core';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import './TiptapEditor.css';

// 自定义扩展，为标题添加ID（占位用）
const HeadingID = Extension.create({
  name: 'headingID',
});

const generateHeadingId = (text, index) => {
  if (!text) return `heading-${index}`;
  const sanitizedText = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '');
  return `heading-${sanitizedText}-${index}`;
};

const TiptapViewer = ({ content }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
      }),
      Image,
      HeadingID,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editable: false,
  });

  // 添加/刷新标题ID
  useEffect(() => {
    if (!editor) return;

    const updateHeadingIds = () => {
      const editorElement = editor.view.dom;
      const headings = editorElement.querySelectorAll('h1, h2, h3, h4, h5, h6');

      headings.forEach((heading, index) => {
        // 先移除旧的 id (防止内容变化后重复)
        heading.removeAttribute('id');

        const headingText = heading.textContent.trim();
        const headingId = generateHeadingId(headingText, index);
        heading.id = headingId;
      });
    };

    // 初始时执行一次
    updateHeadingIds();

    // 监听内容变化时更新
    editor.on('update', updateHeadingIds);

    return () => {
      editor.off('update', updateHeadingIds);
    };
  }, [editor, content]);

  return (
    <div className="tiptap-viewer-wrapper">
      <EditorContent editor={editor} className="tiptap-editor-content" />
    </div>
  );
};

export default TiptapViewer;
