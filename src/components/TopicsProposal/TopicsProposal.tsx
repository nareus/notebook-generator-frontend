import { useState } from 'react';
import styles from './TopicsProposal.module.scss';

interface TopicsProposalProps {
    topics: string[];
    onFeedback: (feedback: string) => void;
    onConfirm: () => void;
  }
  
  export const TopicsProposal: React.FC<TopicsProposalProps> = ({ 
    topics, 
    onFeedback, 
    onConfirm 
  }) => {
    const [editableTopics, setEditableTopics] = useState<string[]>(topics);
  
    const handleTopicChange = (index: number, newValue: string) => {
      const updatedTopics = [...editableTopics];
      updatedTopics[index] = newValue;
      setEditableTopics(updatedTopics);
    };
  
    return (
      <div className={styles.topicsProposalContainer}>
        <h3>Suggested Topics</h3>
        <div className={styles.topicsList}>
          {editableTopics.map((topic, index) => (
            <div key={index} className={styles.topicItem}>
              <input
                type="text"
                value={topic}
                onChange={(e) => handleTopicChange(index, e.target.value)}
                className={styles.topicInput}
              />
            </div>
          ))}
        </div>
  
        <div className={styles.feedbackSection}>
          <textarea 
            placeholder="Provide feedback on the topics (optional)"
            className={styles.feedbackInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onFeedback((e.target as HTMLTextAreaElement).value);
              }
            }}
          />
          <div className={styles.actionButtons}>
            <button
              onClick={() => onFeedback(editableTopics.join('\n'))}
              className={styles.feedbackButton}
            >
              Update Topics
            </button>
            <button 
              onClick={onConfirm}
              className={styles.confirmButton}
            >
              Confirm and Generate Structure
            </button>
          </div>
        </div>
      </div>
    );
  };
  