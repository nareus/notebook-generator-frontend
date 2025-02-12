import React, { useState, useEffect, useRef } from 'react';
import styles from './TopicInput.module.scss';
import { NotebookStructureClient } from '../utils/notebook';
import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  OutlinedInput, 
  Checkbox, 
  ListItemText 
} from '@mui/material';

interface TopicInputProps {
  onTopicSubmit: (topic: string, notebookCount: number, selectedDocs: string[]) => void;
}

export const TopicInput = ({ onTopicSubmit }: TopicInputProps) => {
  const [topic, setTopic] = useState<string>('');
  const [notebookCount, setNotebookCount] = useState<number>(1);
  const [documents, setDocuments] = useState<string[]>([]);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await NotebookStructureClient.getDocuments();
        setDocuments(response.documents);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    fetchDocuments();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onTopicSubmit(topic, notebookCount, selectedDocs);
    }
  };

  const toggleDocument = (doc: string) => {
    setSelectedDocs(prev =>
      prev.includes(doc)
        ? prev.filter(d => d !== doc)
        : [...prev, doc]
    );
  };

  return (
    <form onSubmit={handleSubmit} className={styles.topicInputContainer}>
      <input 
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter notebook topic"
        className={styles.topicInput}
      />
      <div className={styles.countContainer}>
        <label htmlFor="notebookCount">Number of notebooks:</label>
        <input
          id="notebookCount"
          type="number"
          min="1"
          max="5"
          value={notebookCount}
          onChange={(e) => setNotebookCount(parseInt(e.target.value))}
          className={styles.countInput}
        />
      </div>
      <FormControl sx={{ width: '100%', marginBottom: 2 }}>
        <InputLabel id="documents-select-label">Reference Documents</InputLabel>
        <Select
          labelId="documents-select-label"
          id="documents-select"
          multiple
          value={selectedDocs}
          onChange={(event) => {
            const value = event.target.value;
            setSelectedDocs(typeof value === 'string' ? value.split(',') : value);
          }}
          input={<OutlinedInput label="Reference Documents" />}
          renderValue={(selected) => `${selected.length} documents selected`}
        >
          {documents.map((doc) => (
            <MenuItem key={doc} value={doc}>
              <Checkbox checked={selectedDocs.includes(doc)} />
              <ListItemText primary={doc} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <button 
        type="submit" 
        disabled={!topic.trim()}
        className={styles.submitButton}
      >
        Generate Notebook Topics
      </button>
    </form>
  );
};



