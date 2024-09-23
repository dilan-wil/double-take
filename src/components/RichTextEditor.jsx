import { useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'quill/dist/quill.snow.css';
import { Box } from '@chakra-ui/react';

const toolbar = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{size: []}],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'video'],
    ['clean']
  ],
  clipboard: {
    // toggle to add extra line breaks when pasting HTML:
    matchVisual: false,
  }
}

export const RichTextEditor = ({element, setElement, handleScenarioChange, index}) => {
    const handleChange = (e) => {
      if(index>-1){
        handleScenarioChange(index, "main", e)
      } else {
        setElement(e)
      }
    }
    return (
      <ReactQuill theme="snow" 
      value={element ? element : ""} 
      onChange={(e) => handleChange(e)}
      style={{height: 300, marginBottom: 15}}
      modules={toolbar}
      />
    )
}
