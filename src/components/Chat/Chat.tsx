import React, { useState } from 'react';
import { 
  NotebookStructure, 
  NotebookStructureClient
} from '../types/notebook';
import { TopicInput } from '../TopicInput/TopicInput';
import { StructureProposal } from '../StructureProposal/StructureProposal';
import styles from './Chat.module.scss';

export const Chat: React.FC = () => {
  const [topic, setTopic] = useState<string>('');
  const [proposedStructure, setProposedStructure] = useState<NotebookStructure | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'loading' | 'structure-proposed' | 'generating' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const fetchProposedStructure = async (topicInput: string) => {
    try {
      setTopic(topicInput);
      setGenerationStatus('loading');
  
      const response = await NotebookStructureClient.generateStructure(topicInput);
      
      setProposedStructure(response.structure);
      setGenerationStatus('structure-proposed');
    } catch (err) {
      console.error('Structure generation error:', err);
      setError('Failed to generate notebook structure');
      setGenerationStatus('error');
    }
  };

  const handleStructureFeedback = async (feedback: string) => {
    // TODO: Implement structure refinement API call
    console.log('Structure feedback:', feedback);
  };

  const generateNotebook = async () => {
    try {
      setGenerationStatus('generating');
      
      // TODO: Implement actual notebook generation API call
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated delay
      
      setGenerationStatus('completed');
    } catch (err) {
      console.error('Notebook generation error:', err);
      setError('Failed to generate notebook');
      setGenerationStatus('error');
    }
  };

  const renderContent = () => {
    switch(generationStatus) {
      case 'idle':
        return <TopicInput onTopicSubmit={fetchProposedStructure} />;
      
      case 'loading':
        return (
          <div className={styles.statusContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Generating notebook structure...</p>
          </div>
        );
      
      case 'structure-proposed':
        return proposedStructure ? (
          <StructureProposal 
            structure={proposedStructure}
            onFeedback={handleStructureFeedback}
            onConfirm={generateNotebook}
          />
        ) : null;
      
      case 'generating':
        return (
          <div className={styles.statusContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Generating notebook...</p>
          </div>
        );
      
      case 'completed':
        return (
          <div className={styles.statusContainer}>
            <p>Notebook generated successfully!</p>
            {/* TODO: Add download or preview button */}
          </div>
        );
      
      case 'error':
        return (
          <div className={styles.statusContainer}>
            <p className={styles.errorMessage}>{error || 'An unexpected error occurred'}</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.notebookGeneratorContainer}>
      {renderContent()}
    </div>
  );
};

export default Chat;