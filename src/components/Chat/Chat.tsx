import React, { useState } from 'react';
import { 
  NotebookStructure, 
  NotebookStructureClient
} from '../types/notebook';
import { TopicInput } from '../TopicInput/TopicInput';
import { StructureProposal } from '../StructureProposal/StructureProposal';
import styles from './Chat.module.scss';
import { TopicsProposal } from '../TopicsProposal/TopicsProposal';

export const Chat: React.FC = () => {
  const [proposedTopics, setProposedTopics] = useState<string[]>([]);
  const [proposedStructure, setProposedStructure] = useState<NotebookStructure | null>(null);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'loading-topics' | 'loading-structure' | 'structure-proposed' | 'topics-proposed' | 'generating' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const generateNotebookTopics = async (topic: string, notebookCount: number) => {
    try {
      setGenerationStatus('loading-topics');

      const response = await NotebookStructureClient.generateTopics(topic, notebookCount);

      setProposedTopics(response.topics);
      setGenerationStatus('topics-proposed');
    } catch (err) {
      console.error('Topic generation error:', err);
      setError('Failed to generate notebook topics');
      setGenerationStatus('error');
    }
  };
  const handleTopicsFeedback = async (feedback: string) => {
    try {
      setGenerationStatus('loading-topics');
  
      const response = await NotebookStructureClient.generateFeedbackTopics(
        JSON.stringify(proposedTopics),
        feedback
      );
      
      setProposedTopics(response.topics);
      setGenerationStatus('topics-proposed');
    } catch (err) {
      console.error('Structure generation error:', err);
      setError('Failed to generate notebook topics after feedback');
      setGenerationStatus('error');
    }

  };
  
  const generateStructure = async () => {
    try {
      setGenerationStatus('loading-structure');
      const topicInput = proposedTopics[0];
  
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
    try {
      setGenerationStatus('loading-structure');
  
      const response = await NotebookStructureClient.generateFeedbackStructure(
        JSON.stringify(proposedStructure),
        feedback
      );
      
      setProposedStructure(response.structure);
      setGenerationStatus('structure-proposed');
    } catch (err) {
      console.error('Structure generation error:', err);
      setError('Failed to generate notebook structure');
      setGenerationStatus('error');
    }

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
        return <TopicInput onTopicSubmit={generateNotebookTopics} />;
      
      case 'loading-topics':
        return (
          <div className={styles.statusContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Generating notebook topic...</p>
          </div>
        );
      case 'loading-structure':
        return (
          <div className={styles.statusContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Generating notebook structure...</p>
          </div>
        );
      case 'topics-proposed':
        return proposedTopics ? (
          <TopicsProposal 
            topics={proposedTopics}
            onFeedback={handleTopicsFeedback}
            onConfirm={generateStructure}
          />
        ) : null;
      
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