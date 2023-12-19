import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import NavbarCertif from "../components/Navbar";
import './generationCertificate.css'
import Footer from "../components/Footer";
function GenerateCertificate() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isPublic, setIsPublic] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedCsv, setSelectedCsv] = useState(null);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    const authToken = localStorage.getItem('authToken');

    try {
      const response = await fetch('http://localhost:8000/organization/gettemplates', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data.data)
        setTemplates(data.data);
      } else {
        console.error('Failed to fetch templates');
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setFile(null);
    setIsPublic(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.name.endsWith('.docx')) {
      setFile(selectedFile);
    } else {
      setFile(null);
    }
  };
  
const handleDragOver = (e) => {
  e.preventDefault();
};

const handleDrop = (e) => {
  e.preventDefault();
  const droppedFile = e.dataTransfer.files[0]; 
  if (droppedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {

    handleFileChange({ target: { files: [droppedFile] } });
  } else {
    console.log('Please drop a .docx file.');
  }
};

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };
  const handleCsvChange = (e) => {
    const selectedCsvFile = e.target.files[0];
    setSelectedCsv(selectedCsvFile);
  };
  const handleSubmit = async () => {
    if (!selectedTemplate || !selectedCsv) {
      return;
    }

    const authToken = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('template_id', selectedTemplate.name);
    formData.append('csvfile', selectedCsv);
    for (const entry of formData.entries()) {
      console.log(entry[0], entry[1]);
    }
    try {
      const response = await fetch('http://localhost:8000/organization/csvandtemplate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        // Handle success
        console.log('done')
      } else {
        console.error('Failed to submit');
      }
    } catch (error) {
      console.error('Error submitting:', error);
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
    

    try {
      const response = await fetch('http://localhost:8000/organization/uploadtemplate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        closeModal();
        fetchTemplates();
      } else {
        console.error('Failed to upload file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
     <div className="navLogin">
        <NavbarCertif  textColor="#FFFFFF" />
      </div>
      
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
      <button className="modal-close-btn" onClick={closeModal}>X</button>
  <div onDragOver={handleDragOver} onDrop={handleDrop}>
    <h2>Create New Template</h2>
    <div className="drag-drop-area">
    {file ? (
    <p>Selected File: {file.name}</p>
  ) : (
    <div>
    <p>Drag and drop your file here or</p>
    <input type="file" className='dragdropBtn' onChange={handleFileChange} accept=".docx" />
    </div>
  )}

    </div>
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

      <div className='container generationContent'>
      <h1>Generate New Certificate</h1>
      <h3>Templates</h3>
      <div className='templates'>
      <div >
        <button  className="generationBtn" onClick={openModal}>
          +
        </button>
        </div>
      {templates &&
        templates.map((template, index) => (
          <div
            key={index}
            style={{
              backgroundColor: selectedTemplate === template ? 'lightblue' : 'white',
            }}
            onClick={() => handleTemplateSelect(template)}
          ><img
          src={`http://localhost:8000/image_files/${template.name}`}
          alt={template.name}
          style={{ width: '300px', height: '200px' }}
        />
          </div>
        ))}
        </div>
       <input 
       type="file" 
       onChange={handleCsvChange} 
       style={{
        padding: '10px',
        
        marginBottom: '15px',
        marginTop: '10px',
        cursor: 'pointer',
      }}
      accept=".csv"
      />
      <button onClick={handleSubmit}>Submit</button>
      </div>
      
      <Footer />
    </div>
    
  );
}

export default GenerateCertificate;
