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

  const handleAddSection = () => {
    const newSection: NotebookSection = {
      name: 'New Section',
      pages: [{
        'title': 'New Page',
        'type': 'text',
        'placeholders': ['add content'],
      }]
    };
    
    setEditableStructure(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const handleDeleteSection = (sectionIndex: number) => {
    const updatedStructure = { ...editableStructure };
    updatedStructure.sections.splice(sectionIndex, 1);
    setEditableStructure(updatedStructure);
  };

  const handleAddPage = (sectionIndex: number) => {
    const newPage: NotebookPage = {
      'title': 'New Page',
      'type': 'text',
      'placeholders': ['add content'],
    };

    const updatedStructure = { ...editableStructure };
    updatedStructure.sections[sectionIndex].pages.push(newPage);
    setEditableStructure(updatedStructure);
  };

  const handleAddPagePlaceholder = (sectionIndex: number, pageIndex: number) => {
    const updatedStructure = { ...editableStructure };
    updatedStructure.sections[sectionIndex].pages[pageIndex].placeholders.push('add content');
    setEditableStructure(updatedStructure);
  };

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
  
  const handlePageTypeChange = (sectionIndex: number, pageIndex: number, newType: string) => {
    const updatedStructure = { ...editableStructure };
    updatedStructure.sections[sectionIndex].pages[pageIndex].type = newType;
    setEditableStructure(updatedStructure);
  };

  const handlePlaceholderChange = (sectionIndex: number, pageIndex: number, placeholderIndex: number, newValue: string) => {
    const updatedStructure = { ...editableStructure };
    if (updatedStructure.sections[sectionIndex].pages[pageIndex].placeholders) {
      updatedStructure.sections[sectionIndex].pages[pageIndex].placeholders[placeholderIndex] = newValue;
      setEditableStructure(updatedStructure);
  }
  };

  const renderPage = (page: NotebookPage, sectionIndex: number, pageIndex: number) => (
    <div key={pageIndex} className={styles.page}>
      <div className={styles.pageContent}>
        <div>
          Cell Title   
        </div>
        <input
          type="text"
          value={page.title}
          onChange={(e) => handlePageTitleChange(sectionIndex, pageIndex, e.target.value)}
          className={styles.titleInput}
        />
        <div>
          Cell Type and Content    
        </div>
        <div className={styles.pageTypeAndPlaceholders}>
          <input
            type="text"
            value={page.type}
            onChange={(e) => handlePageTypeChange(sectionIndex, pageIndex, e.target.value)}
            className={styles.pageType}
          />
          {page.placeholders?.length > 0 && (
            <ul className={styles.placeholders}>
              {page.placeholders?.map((placeholder, index) => (
                <li key={index} className={styles.placeholders}>
                  <input
                    type="text"
                    value={placeholder}
                    onChange={(e) => handlePlaceholderChange(sectionIndex, pageIndex, index, e.target.value)}
                    className={styles.placeholderInput}
                  />
                </li>
              ))}
            </ul>
          )}
          <button 
            onClick={() => handleAddPagePlaceholder(sectionIndex, pageIndex)}
            className={styles.addSectionButton}
          >
            Add Content Pointers
          </button>
        </div>
      </div>
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
          <button 
          onClick={() => handleAddPage(sectionIndex)}
          className={styles.addSectionButton}
        >
          Add New Page
        </button>
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
        <button 
          onClick={handleAddSection}
          className={styles.addSectionButton}
        >
          Add New Section
        </button>
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
