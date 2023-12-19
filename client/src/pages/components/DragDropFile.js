import React, { useState, useRef } from "react";
import "./dragAndDrop.css";
import CloudUploadRoundedIcon from "@mui/icons-material/CloudUploadRounded";
import ProgressBar from "react-bootstrap/ProgressBar";

function handleFile(files) {
  console.log(files);
  const file = files[0];
  // const [progressBar, setProgressBar] = useState(0);
  const formData = new FormData();
  formData.append("pdfFile", file.files[0]);
  console.log(formData);
  fetch("http://localhost:5000/verify", {
    method: "post",
    body: formData,
  }).then((response) => {
    console.log(response.status);
    if (response.status == 200) {
      console.log("yes");
    } else {
      console.log("no");
    }
  });
  formData.append("pdfFile", file);
  // onUploadProgress: (event) => {
  //   setProgressBar(Math.round((100 * event.loaded) / event.total));
  // };
  fetch("", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        alert("done");
        return;
      } else {
        throw new Error("Failed to upload file");
      }
    })
    .then((data) => {
      console.log("File uploaded successfully:", data);
    })
    .catch((error) => {
      console.log(error);
      console.error("Error uploading file:", error);
    });
}

function DragDropFile() {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);
  const handleDrag = function (e) {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };
  const handleDrop = function (e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };
  const handleChange = function (e) {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files);
    }
  };
  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="page">
      <form
        id="form-file-upload"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          id="input-file-upload"
          multiple={true}
          onChange={handleChange}
        />
        <label
          id="label-file-upload"
          htmlFor="input-file-upload"
          className={dragActive ? "drag-active" : ""}
        >
          <div>
            <button className="upload-button" onClick={onButtonClick}>
              <CloudUploadRoundedIcon sx={{ fontSize: 150 }} />
            </button>
            <p>Drag and drop your file here or Upload a file</p>
            <ProgressBar animated now={100} />;
          </div>
        </label>
        {dragActive && (
          <div
            id="drag-file-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
    </div>
  );
}

export default DragDropFile;
