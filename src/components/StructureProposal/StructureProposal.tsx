import React, { useState } from 'react';
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
  const [editableStructure, setEditableStructure] = useState(structure);

  const handlePageTitleChange = (sectionIndex: number, pageIndex: number, newTitle: string) => {
    const updatedStructure = { ...editableStructure };
    updatedStructure.sections[sectionIndex].pages[pageIndex].title = newTitle;
    setEditableStructure(updatedStructure);
  };

  const handleSectionNameChange = (sectionIndex: number, newName: string) => {
    const updatedStructure = { ...editableStructure };
    updatedStructure.sections[sectionIndex].name = newName;
    setEditableStructure(updatedStructure);
  };

  const renderPage = (page: NotebookPage, sectionIndex: number, pageIndex: number) => (
    <div key={pageIndex} className={styles.page}>
      <input
        type="text"
        value={page.title}
        onChange={(e) => handlePageTitleChange(sectionIndex, pageIndex, e.target.value)}
        className={styles.titleInput}
      />
      <span className={styles.pageType}>{page.type}</span>
      {page.placeholders?.length > 0 && (
        <ul className={styles.placeholders}>
          {page.placeholders.map((placeholder, index) => (
            <li key={index}>{placeholder}</li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderSection = (section: NotebookSection, sectionIndex: number) => (
    <div key={sectionIndex} className={styles.section}>
      <input
        type="text"
        value={section.name}
        onChange={(e) => handleSectionNameChange(sectionIndex, e.target.value)}
        className={styles.sectionInput}
      />
      <div className={styles.sectionPages}>
        {section.pages.map((page, pageIndex) => 
          renderPage(page, sectionIndex, pageIndex)
        )}
      </div>
    </div>
  );

  return (
    <div className={styles.structureProposalContainer}>
      <h2>{editableStructure.notebook_name}</h2>
      <div className={styles.structureContent}>
        <h3>Proposed Notebook Structure</h3>
        {editableStructure.sections.map((section, index) => 
          renderSection(section, index)
        )}
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
            onClick={() => onFeedback(JSON.stringify(editableStructure))}
            className={styles.feedbackButton}
          >
            Update Structure
          </button>
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
