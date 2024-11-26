import { useState, useRef, useEffect } from "react";

const AutoResizeTextarea = ({value, onChange}) => {
  const [height, setHeight] = useState("50px");
  const textareaRef = useRef(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "50px"; // Reset height to the initial height
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(scrollHeight, 200); // Max height is 200px
    setHeight(`${newHeight}px`);
  };

  function HandleChange(e){
    onChange(e.target.value)
  }

  useEffect(() => {
    adjustHeight(); // Ensure it adjusts height initially
  }, []);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={HandleChange}

      style={{
        width: "92%",
        height: height, // Dynamic height based on content
        maxHeight: "200px", // Max height
        resize: "none", // Disable resizing
        overflowY: "auto", // Hide scrollbar when max height is reached
      }}
      onInput={adjustHeight} // Call adjustHeight on every input
      placeholder="New Chat....."
    />
  );
};

export default AutoResizeTextarea;
