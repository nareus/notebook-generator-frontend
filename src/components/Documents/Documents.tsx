import { ChangeEvent, useState, useEffect } from "react";
import { NavBar } from "../NavBar/NavBar"
import { NotebookStructureClient } from "../utils/notebook";
import styles from './Documents.module.scss';
import DeleteIcon from '@mui/icons-material/Delete';

export const Documents = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documents, setDocuments] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        getFileNames();
    }, []);

    const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUploadConfirm = async () => {
        if (selectedFile) {
            setIsUploading(true);
            try {
                await NotebookStructureClient.indexDocument(selectedFile);
                setSelectedFile(null);
                getFileNames();
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setIsUploading(false);
            }
        }
    };

    const handleDeleteFile = async (fileName: string) => {
        try {
            setIsDeleting(true);
            await NotebookStructureClient.deleteDocument(fileName);
            getFileNames();
        } catch (error) {
            console.error('Error deleting file:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const getFileNames = async () => {
        try {
            const documents = await NotebookStructureClient.getDocuments();
            console.log('Documents:', documents.documents);
            setDocuments(documents.documents);
        } catch (error) {
            console.error('Error fetching documents:', error);
        }
    };

    return(
        <div>
            <NavBar />
            <div className={styles.documentsContainer}>
            <h1>Upload Documents</h1>
            <div className={styles.uploadSection}>
                <input 
                    type="file" 
                    accept=".pdf,application/pdf" 
                    onChange={handleFileSelect}
                    disabled={isUploading}
                />
                <button 
                    onClick={handleUploadConfirm}
                    disabled={!selectedFile || isUploading}
                >
                    {isUploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
            </div>

            {isUploading && (
                <div className={styles.uploadOverlay}>
                    <div className={styles.uploadModal}>
                        <p>Uploading document...</p>
                        <div className={styles.spinner}></div>
                    </div>
                </div>
            )}
            {isDeleting && (
                <div className={styles.uploadOverlay}>
                    <div className={styles.uploadModal}>
                        <p>Deleting document...</p>
                        <div className={styles.spinner}></div>
                    </div>
                </div>
            )}

            <div className={styles.documentList}>
                <h2>Uploaded Documents</h2>
                {documents.map((filename) => (
                    <div className={styles.documentItem} key={filename}>
                    <div>{filename}</div>
                    <DeleteIcon className={styles.deleteIcon} onClick={() => handleDeleteFile(filename)} />
                    </div>
                    
                ))}
            </div>
        </div>
        </div>
    )
}