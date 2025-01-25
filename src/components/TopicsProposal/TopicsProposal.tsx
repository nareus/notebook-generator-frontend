import styles from './TopicsProposal.module.scss';

interface TopicsProposalProps {
    topics: [string, boolean][];
    setProposedTopics: React.Dispatch<React.SetStateAction<[string, boolean][]>>;
    onFeedback: (feedback: string) => void;
    onConfirm: () => void;
  }
  
  export const TopicsProposal: React.FC<TopicsProposalProps> = ({ 
    topics, 
    onFeedback, 
    setProposedTopics,
    onConfirm 
  }) => {
  
    const handleTopicChange = (index: number, newValue: string) => {
      const updatedTopics = [...topics];
      updatedTopics[index] = [newValue, updatedTopics[index][1]];
      setProposedTopics(updatedTopics);
    };
  
    return (
      <div className={styles.topicsProposalContainer}>
        <h3>Suggested Topics</h3>
        <div className={styles.topicsList}>
          {topics.map(([topic, isCompleted], index) => (
            <div key={index} className={`${styles.topicItem} ${isCompleted ? styles.completed : ''}`}>
              <input
                type="text"
                value={topic}
                onChange={(e) => handleTopicChange(index, e.target.value)}
                className={styles.topicInput}
                disabled={isCompleted}
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
              onClick={() => onFeedback(topics.map(tuple => tuple[0]).join('\n'))}
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
  