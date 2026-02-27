File Metadata Analyzer

Project Overview

The File Metadata Analyzer is a client-side web application developed using React (Vite) for extracting, analyzing, and interpreting metadata from various digital file formats. The application is designed to support preliminary forensic examination by generating structured metadata reports and computing SHA-256 hash values for file integrity verification.

The system operates entirely within the browser environment. No files are uploaded to external servers, and no backend or database infrastructure is used. All processing is performed locally to maintain data confidentiality and user privacy.


Objectives

1. To develop a lightweight metadata analysis tool for forensic-oriented academic and preliminary examination
2. To implement SHA-256 hash generation for integrity verification
3. To provide structured visualization of extracted metadata
4. To enable basic data interpretation based on file attributes
5. To create a scalable foundation for future full-stack forensic applications


Technical Architecture

Frontend Framework

1. React (Vite)
2. JavaScript (ES6+)
3. HTML5
4. CSS3

Processing Environment

1. Browser-based execution
2. FileReader API for file handling
3. Web Crypto API for SHA-256 hash generation
4. Conditional metadata extraction based on file type

System Design Characteristics

1. Fully client-side architecture
2. No backend server
3. No database storage
4. No file transmission outside user system
5. Privacy-preserving processing model



Methodology

1. The user selects a supported file from the local system.
2. The file is accessed using browser-based APIs.
3. Metadata fields are extracted based on file format.
4. A SHA-256 hash value is generated to ensure integrity verification.
5. Extracted metadata is categorized and displayed in structured sections.
6. A data interpretation summary is provided based on observed attributes.



Supported File Types

1. Images (JPG, PNG, WEBP)
2. Videos (MP4)
3. Audio (MP3)
4. PDF documents
5. DOCX documents
6. TXT files
7. Email files (.eml)

Maximum supported file size: 50 MB


Installation and Local Setup

To run the application locally:

1. Clone the repository.
2. Open the project folder using Command Prompt.
3. Install dependencies:

```
npm install
```

Start the development server:

```
npm run dev
```

The application will run on the local development server provided by Vite.


 Limitations

1. Files upto 50MB size are supported due to client-side processing constraints.
2. Advanced forensic artifact recovery is not implemented.
3. No case management or reporting export functionality is included.
4. The tool is intended for academic and preliminary analytical purposes.



Project Status

Version 1.0 - Foundational Implementation
Client-Side Prototype

Academic Context 

This project was developed as part of the postgraduate semester requirements in Forensic Science and Criminology. 
The objective was to design and implement a functional metadata analysis system aligned with digital forensic principles, focusing on integrity verification and structured data interpretation.

Future Enhancements

1. Integration of backend server for structured data management
2. secure database storage for metadata record retention
3. To audit logging
4. Advanced anomaly detection algorithms for metadata inconsistencies
5. Automated report generation
6. To make it support multiple file types
7. Interactive map for multiple file types whenever GPS data found in the structured metadata of these files.
