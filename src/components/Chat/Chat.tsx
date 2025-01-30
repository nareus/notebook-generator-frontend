import React, { useState } from 'react';
import { 
  NotebookResponse,
  NotebookStructure, 
  NotebookStructureClient
} from '../types/notebook';
import { TopicInput } from '../TopicInput/TopicInput';
import { StructureProposal } from '../StructureProposal/StructureProposal';
import styles from './Chat.module.scss';
import { TopicsProposal } from '../TopicsProposal/TopicsProposal';
import { DownloadNotebook } from '../DownloadNotebook/DownloadNotebook';


export const Chat = () => {
  // Boolean state to track if notebook generation has been completed
  const [proposedTopics, setProposedTopics] = useState<[string, boolean][]>([]);
  const [indexToGenerate, setIndexToGenerate] = useState<number>(0);
  const [generationStatus, setGenerationStatus] = useState<'idle' | 'loading-topics' | 'loading-structure' | 'structure-proposed' | 'topics-proposed' | 'generating' | 'completed' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [proposedStructure, setProposedStructure] = useState<NotebookStructure>({
    notebook_name: '',
    sections: [
      {
        name: '',
        pages: [
          {
            title: '',
            type: '',
            placeholders: ['']
          }
        ]
      }
    ]
  });


  const generateNotebookTopics = async (topic: string, notebookCount: number) => {
    try {
      setGenerationStatus('loading-topics');

      const response = await NotebookStructureClient.generateTopics(topic, notebookCount);
      
      setProposedTopics(response.topics.map(str => [str, false]));
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
      
      setProposedTopics(response.topics.map(str => [str, false]));
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
      const topicInput = proposedTopics[indexToGenerate][0];
  
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

  const handledownloadNotebook = async () => {
    try {
      setGenerationStatus('loading-structure');
      const notebook : NotebookResponse = await NotebookStructureClient.generateNotebook(proposedStructure)

      // Create a Blob from the notebook content
      const blob = new Blob([notebook.notebook], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = 'generated_notebook.ipynb';
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      setIndexToGenerate(indexToGenerate + 1)
    } catch (error) {
      console.error('Error generating notebook:', error);
      alert('Failed to generate notebook');
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
            setProposedTopics={setProposedTopics}
            onConfirm={generateStructure}
          />
        ) : null;
      
      case 'structure-proposed':
        return proposedStructure && 'notebook_name' in proposedStructure && 'sections' in proposedStructure ? (
          <StructureProposal 
            structure={proposedStructure}
            onFeedback={handleStructureFeedback}
            onConfirm={() => setGenerationStatus('completed')}
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
            <div>
            <div className={styles.statusContainer}>
              <p>Notebook generated successfully!</p>
            </div>
            {proposedStructure && 'notebook_name' in proposedStructure && 'sections' in proposedStructure && (
              <DownloadNotebook downloadNotebook={handledownloadNotebook}  />
            )}
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