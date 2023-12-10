import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';

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
        setTemplates(data);
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
  

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };
  const handleCsvChange = (e) => {
    const selectedCsvFile = e.target.files[0];
    // Handle CSV file selection logic here
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
    if (!file || !selectedTemplate) {
      return;
    }

    const authToken = localStorage.getItem('authToken');
    const formData = new FormData();
    formData.append('myFile', file);
    formData.append('publicBool', isPublic);
    formData.append('selectedTemplate', selectedTemplate.name); // Send the selected template name

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
      } else {
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
      {templates[0] &&
        templates[0].map((template, index) => (
          <div
            key={index}
            style={{
              backgroundColor: selectedTemplate === template ? 'lightblue' : 'white',
            }}
            onClick={() => handleTemplateSelect(template)}
          >
            <h3>Template {index + 1}</h3>
            <p>Template Name: {template.name}</p>
          </div>
        ))}
       <input type="file" onChange={handleCsvChange} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

export default GenerateCertificate;
