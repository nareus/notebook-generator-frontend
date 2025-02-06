import { ChangeEvent, useState, useEffect } from "react";
import { NavBar } from "../NavBar/NavBar"
import { NotebookStructureClient } from "../utils/notebook";

export const Documents = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [documents, setDocuments] = useState<string[]>([]);
    const [isUploading, setIsUploading] = useState(false);

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
                await NotebookStructureClient.indexPDF(selectedFile);
                setSelectedFile(null);
                getFileNames();
            } catch (error) {
                console.error('Error uploading file:', error);
            } finally {
                setIsUploading(false);
            }
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
            <h1>Upload Documents</h1>
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

            {isUploading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-4 rounded-lg shadow-lg">
                        <p className="text-lg">Uploading document...</p>
                        <div className="mt-2 animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                </div>
            )}

            {documents.map((filename) => (
                <div key={filename}>{filename}</div>
            ))}
        </div>
    )
}