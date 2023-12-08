import React, { useState } from 'react';
import Modal from 'react-modal';

function GenerateCertificate() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFile(null);
    setIsPublic(true); // Reset switch to default value on modal close
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      return;
    }
  
    const authToken = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('myFile', file);
    formData.append('publicBool', isPublic);
    for (const entry of formData.entries()) {
        console.log(entry[0], entry[1]);
      }
    try {
      const response = await fetch('http://localhost:8000/organization/uploadtemplate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        // File uploaded successfully
        closeModal();
        // Handle any further actions after successful upload
      } else {
        // Handle upload failure
        console.log(response)
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };
  

  return (
    <div>
      <button onClick={openModal}>+</button>
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <div>
          <h2>Drag and Drop .docx File</h2>
          <input type="file" onChange={handleFileChange} />
          <div>
            <label htmlFor="publicSwitch">Public</label>
            <input
              id="public"
              type="checkbox"
              checked={isPublic}
              onChange={() => setIsPublic(!isPublic)}
            />
          </div>
          <button onClick={handleUpload}>Done</button>
        </div>
      </Modal>
    </div>
  );
}

export default GenerateCertificate;
