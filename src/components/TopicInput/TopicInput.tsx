import React, { useState } from 'react';
import styles from './TopicInput.module.scss';

interface TopicInputProps {
  onTopicSubmit: (topic: string) => void;
}

export const TopicInput: React.FC<TopicInputProps> = ({ onTopicSubmit }) => {
  const [topic, setTopic] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onTopicSubmit(topic);
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
      <button 
        type="submit" 
        disabled={!topic.trim()}
        className={styles.submitButton}
      >
        Generate Structure
      </button>
    </form>
  );
};