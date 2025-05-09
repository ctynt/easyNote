import React from 'react';
import MDEditor from '@uiw/react-md-editor';

const MarkdownEditor = ({ value, onChange }) => {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={onChange}
        preview="live"
        height={400}
        toolbarHeight={50}
        visibleDragbar={false}
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      />
    </div>
  );
};

export default MarkdownEditor;
