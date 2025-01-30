import React, { useState } from 'react';
import styles from './TopicInput.module.scss';

interface TopicInputProps {
  onTopicSubmit: (topic: string, notebookCount: number) => void;
}

export const TopicInput = ({ onTopicSubmit }: TopicInputProps) => {
  const [topic, setTopic] = useState<string>('');
  const [notebookCount, setNotebookCount] = useState<number>(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onTopicSubmit(topic, notebookCount);
    }
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
