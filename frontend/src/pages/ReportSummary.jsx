import React, { useState } from "react";
import styles from "./ReportSummary.module.css";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router-dom";



const ReportSummary = ({ fileUrl, fileType, analysisReport, fileName }) => {

    const [selectedLanguage, setSelectedLanguage] = useState("English");
    const [translatedReport, setTranslatedReport] = useState(analysisReport);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();



    const languages = ["English", "Chinese", "Hindi", "Marathi","Spanish","French","sanskrut"];

    const formatBoldText = (text) => {
        return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    };

    // Function to translate the report
    const handleLanguageChange = async (event) => {
        const newLanguage = event.target.value;
        setSelectedLanguage(newLanguage);
        setIsLoading(true);

        try {
            const response = await fetch("http://127.0.0.1:5000/api/mediGenie/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    translate_to: newLanguage.toLowerCase(),
                    analysis_report: analysisReport,
                }),
            });

            if (!response.ok) throw new Error("Translation failed");

            const result = await response.json();
            setTranslatedReport(result.translated_report);
        } catch (error) {
            console.error("Translation Error:", error);
            alert("Failed to translate the report. Try again.");
        } finally {
            setIsLoading(false);
        }
    };



    return (
        <div className={styles.reportContainer}>
            {/* Left Side: File Viewer */}
            <div className={styles.left_side}>
                <div className={styles.left_headings}>
                    <FaArrowLeft className={styles.left_icon} onClick={() => navigate("/dashboard")} />
                    <span className={styles.left_label}>File Name:</span>
                    <span className={styles.left_fileName}>{fileName}</span>
                </div>
                <div className={styles.filePreview}>
                    {fileType === "pdf" ? (
                        <iframe src={fileUrl} title="Uploaded PDF" className={styles.pdfViewer}></iframe>
                    ) : (
                        <img src={fileUrl} alt="Uploaded Report" className={styles.imagePreview} />
                    )}
                </div>
            </div>

            {/* Right Side: AI-Generated Summary */}
            <div className={styles.summaryContainer}>
                <div className={styles.summaryHeader}>
                    <h2>AI Summary</h2>
                    {/* Language Dropdown */}
                    <select className={styles.languageDropdown} value={selectedLanguage} onChange={handleLanguageChange}>
                        {languages.map((lang) => (
                            <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                </div>

                {/* Show loading spinner if API is processing */}
                {isLoading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Processing...</p>
                    </div>
                ) : (
                    <ul className={styles.summaryList}>
                        {translatedReport.map((item, index) => (
                            <li key={index} dangerouslySetInnerHTML={{ __html: formatBoldText(item) }}></li>
                        ))}
                    </ul>
                )}

                {/* <button className={styles.saveButton} onClick={() => setIsModalOpen(true)}>Save Summary</button> */}
            </div>

         
        </div>
    );
};

export default ReportSummary;















// import React, { useState } from "react";
// import styles from "./ReportSummary.module.css";
// import { FaArrowLeft } from "react-icons/fa";
// import { useAuth0 } from "@auth0/auth0-react";

// const ReportSummary = ({ fileUrl, fileType, analysisReport, fileName, onBack }) => {
//     const { user } = useAuth0();
//     const user_email = user?.email || "unknown@example.com";
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     // Function to get today's date in "YYYY-MM-DD" format
//     const getFormattedDate = () => {
//         const today = new Date();
//         return today.toISOString().split("T")[0];
//     };

//     // Function to replace **text** with <strong>text</strong> for proper rendering
//     const formatBoldText = (text) => {
//         return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
//     };

//     // Function to save summary to database
//     const saveSummary = async () => {
//         const apiUrl = "http://127.0.0.1:5000/insert";
//         const requestData = {
//             user_email: user_email,
//             date_added: getFormattedDate(),
//             file_name: fileName,
//             analysis_report: analysisReport,
//         };

//         try {
//             const response = await fetch(apiUrl, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(requestData),
//             });

//             if (!response.ok) throw new Error("Failed to save summary");

//             const result = await response.json();
//             console.log("API Response:", result);
//             alert("Summary saved successfully! ✅");
//             setIsModalOpen(false);
//         } catch (error) {
//             console.error("Error saving summary:", error);
//             alert("Failed to save summary ❌");
//         }
//     };

//     return (
//         <div className={styles.reportContainer}>
//             {/* Left Side: File Viewer */}
//             <div className={styles.left_side}>
//                 <div className={styles.left_headings}>
//                     <FaArrowLeft className={styles.left_icon} onClick={onBack} />
//                     <span className={styles.left_label}>File Name:</span>
//                     <span className={styles.left_fileName}>{fileName}</span>
//                 </div>
//                 <div className={styles.filePreview}>
//                     {fileType === "pdf" ? (
//                         <iframe src={fileUrl} title="Uploaded PDF" className={styles.pdfViewer}></iframe>
//                     ) : (
//                         <img src={fileUrl} alt="Uploaded Report" className={styles.imagePreview} />
//                     )}
//                 </div>
//             </div>

//             {/* Right Side: AI-Generated Summary */}
//             <div className={styles.summaryContainer}>
//                 <h2>AI Summary</h2>
//                 <ul className={styles.summaryList}>
//                     {analysisReport.map((item, index) => (
//                         <li key={index} dangerouslySetInnerHTML={{ __html: formatBoldText(item) }}></li>
//                     ))}
//                 </ul>
//                 <button className={styles.saveButton} onClick={() => setIsModalOpen(true)}>Save Summary</button>
//             </div>

//             {/* Confirmation Modal */}
//             {isModalOpen && (
//                 <div className={styles.modalBackdrop}>
//                     <div className={styles.modalContent}>
//                         <h3>Are you sure you want to save this report to Database?</h3>
//                         <div className={styles.modalActions}>
//                             <button className={styles.submitButton} onClick={saveSummary}>Submit</button>
//                             <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>Cancel</button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ReportSummary;
