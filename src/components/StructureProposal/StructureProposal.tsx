import React from 'react';
import { 
  NotebookStructure, 
  NotebookSection, 
  NotebookPage 
} from '../types/notebook';
import styles from './StructureProposal.module.scss';

interface StructureProposalProps {
  structure: NotebookStructure;
  onFeedback: (feedback: string) => void;
  onConfirm: () => void;
}

export const StructureProposal: React.FC<StructureProposalProps> = ({ 
  structure, 
  onFeedback, 
  onConfirm 
}) => {
  const renderPage = (page: NotebookPage): React.ReactNode => (
    <div key={page.title} className={styles.page}>
      <h4>{page.title}</h4>
      <span className={styles.pageType}>{page.type}</span>
      {page.placeholders && page.placeholders.length > 0 && (
        <div className={styles.placeholders}>
          <small>Placeholders:</small>
          <ul>
            {page.placeholders.map(placeholder => (
              <li key={placeholder}>{placeholder}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  const renderSection = (section: NotebookSection, depth = 0): React.ReactNode => (
    <div 
      key={section.name} 
      className={styles.section}
      style={{ marginLeft: `${depth * 20}px` }}
    >
      <h3>{section.name}</h3>
      <div className={styles.sectionPages}>
        {section.pages.map(renderPage)}
      </div>
    </div>
  );

  return (
    <div className={styles.structureProposalContainer}>
      <h2>{structure.notebook_name}</h2>
      <div className={styles.structureContent}>
        <h3>Proposed Notebook Structure</h3>
        {structure.sections.map(renderSection)}
      </div>
      
      <div className={styles.feedbackSection}>
        <textarea 
          placeholder="Provide feedback on the structure (optional)"
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
            onClick={onConfirm}
            className={styles.confirmButton}
          >
            Confirm and Generate Notebook
          </button>
        </div>
      </div>
    </div>
  );
};