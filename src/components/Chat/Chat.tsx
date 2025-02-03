import React, { useState } from 'react';
import { 
  NotebookCell,
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
    cells: [
      {
            type: '',
            content: '',
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

  const handleAddCell = () => {
    const newCell: NotebookCell = {
        'type': 'markdown',
        'content': 'Add content or prompt to generate cell content',
    };
    
    setProposedStructure(prev => ({
      ...prev,
      cells: [...prev.cells, newCell]
    }));
  };

  // const handleDeleteSection = (sectionIndex: number) => {
  //   const updatedStructure = { ...editableStructure };
  //   updatedStructure.sections.splice(sectionIndex, 1);
  //   setEditableStructure(updatedStructure);
  // }; 

  const handleCellTypeChange = (cellIndex: number, newValue: string) => {
    const updatedStructure = { ...proposedStructure };
    updatedStructure.cells[cellIndex].type = newValue;
    setProposedStructure(updatedStructure);
  };

  const handleCellChange = (cellIndex: number, newValue: string) => {
    const updatedStructure = { ...proposedStructure };
    updatedStructure.cells[cellIndex].content = newValue;
    setProposedStructure(updatedStructure);
  };

  const handledownloadNotebook = async () => {
    try {
      setGenerationStatus('generating');
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

      const updatedTopics = [...proposedTopics];
      updatedTopics[indexToGenerate] = [updatedTopics[indexToGenerate][0], true];
      setProposedTopics(updatedTopics);
      setIndexToGenerate(indexToGenerate + 1);
      setGenerationStatus('topics-proposed');
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
            <p>Generating notebook topics...</p>
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
        return proposedStructure && 'notebook_name' in proposedStructure && 'cells' in proposedStructure ? (
          <StructureProposal 
            structure={proposedStructure}
            onFeedback={handleStructureFeedback}
            onConfirm={handledownloadNotebook}
            handleAddCell={handleAddCell}
            handleCellTypeChange={handleCellTypeChange}
            handleCellChange={handleCellChange}
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