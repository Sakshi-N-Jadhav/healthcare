
import React, { useState } from "react";
import styles from "./UploadSection.module.css";
import { FaTimes } from "react-icons/fa";
import upwardarrow from "../assets/upwardarrow.svg";
import ReportSummary from "./ReportSummary"; // Import new component
import doctorsImage from "../assets/doctors.png"; 


const UploadSection = ({ selectedReport, setSelectedReport }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileUrl, setFileUrl] = useState("");
  const [fileType, setFileType] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisReport, setAnalysisReport] = useState(null); // Store API response

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileUrl(URL.createObjectURL(file));
      setFileType(file.type.includes("pdf") ? "pdf" : "image");
    }
  };

  // Handle file removal
  const handleRemoveFile = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setUploadProgress(0);
    setAnalysisReport(null);
  };

  // Trigger file input when button is clicked
  const handleButtonClick = () => {
    document.getElementById("fileInput").click();
  };

  // Function to update progress gradually
  const updateProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 90) {
        clearInterval(interval);
      }
      setUploadProgress(progress);
    }, 500);
    return interval;
  };

  // Function to handle file upload (API call)
  const handleGenerateReport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    const progressInterval = updateProgress();

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://127.0.0.1:5000/api/mediGenie/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log("API Response:", result);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setAnalysisReport(result.analysis_report); // Store analysis report
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadProgress(0);
      setIsProcessing(false);
    }
  };

  // useEffect(() => {
  //   if (!selectedReport) {
  //     setSelectedFile(null);
  //     setFileUrl("");
  //     setFileType("");
  //     setIsProcessing(false);
  //     setUploadProgress(0);
  //     setAnalysisReport(null);
  //   }
  // }, [selectedReport]); 


  // ✅ Show previously saved report if selected from sidebar
  if (selectedReport) {
    return (
      <div className={styles.mycontainer}>
        <ReportSummary
          fileUrl={`http://127.0.0.1:5000/uploads/${selectedReport.file_name}`} // ✅ Fetch from backend/uploads
          fileType={selectedReport.file_name.endsWith(".pdf") ? "pdf" : "image"} // ✅ Detect file type
          analysisReport={selectedReport.analysis_report}
          fileName={selectedReport.file_name}
        //   onBack={() => setSelectedReport(null)} // ✅ Go back to UploadSection
        />
      </div>
    );
  }

  // ✅ Show ReportSummary when a new report is generated
  if (analysisReport) {
    return (
      <div className={styles.mycontainer}>
        <ReportSummary
          fileUrl={fileUrl}
          fileType={fileType}
          analysisReport={analysisReport}
          fileName={selectedFile.name}
        //   onBack={() => {
        //     setAnalysisReport(null); // Reset back to upload section
        //     setSelectedFile(null);
        //   }}
        />
      </div>
    );
  }

  return (
    <div className={styles.header_sep}>
    <h1>MediGenie</h1>
    <div className={styles.main_data}>
   
    <div className={styles.mainContainer}>
      
      {!isProcessing ? (
        <div className={styles.uploadContainer}>
          <img src={upwardarrow} alt="arrow" />
          <p>Upload your medical report here</p>
          <p>Drag and drop</p>
          <p>OR</p>

          <input
            type="file"
            id="fileInput"
            className={styles.hiddenInput}
            onChange={handleFileChange}
            accept=".pdf, .jpg, .png"
          />

          {!selectedFile && (
            <button className={styles.uploadButton} onClick={handleButtonClick}>
              Choose from your computer
            </button>
          )}

          {selectedFile && (
            <div className={styles.fileContainer}>
              <p className={styles.fileName}>{selectedFile.name}</p>
              <FaTimes className={styles.removeIcon} onClick={handleRemoveFile} />
            </div>
          )}

          {selectedFile && (
            <button className={styles.uploadButton} onClick={handleGenerateReport}>
              Generate Report
            </button>
          )}
        </div>
      ) : (
        <div className={styles.processingContainer}>
          <p className={styles.processingText}>Processing...</p>
          <div className={styles.fileBox}>{selectedFile.name}</div>
          <div className={styles.progressBarContainer}>
            <div className={styles.progressBar} style={{ width: `${uploadProgress}%` }}></div>
            <span className={styles.progressText}>{uploadProgress}%</span>
          </div>
          <p className={styles.processingSubText}>🧠 Our AI is working its magic...</p>
          <p className={styles.waitText}>Please wait for a few seconds...</p>
        </div>
      )}
    </div>

      <div>
          <div className={styles.image_section}>
            <img src={doctorsImage} alt="Doctors" />
          </div>
      </div>

    </div>
    </div>
  );
};

export default UploadSection;
