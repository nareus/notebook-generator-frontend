import React, { useState } from 'react';
import { 
  NotebookStructure, 
  NotebookCell
} from '../types/notebook';
import styles from './StructureProposal.module.scss';

interface StructureProposalProps {
  structure: NotebookStructure;
  onFeedback: (feedback: string) => void;
  onConfirm: () => void;
  handleAddCell: () => void;
  handleCellTypeChange: (cellIndex: number, type: string) => void;
  handleCellChange: (cellIndex: number, content: string) => void;
}

export const StructureProposal = ({ structure, onFeedback, onConfirm, handleAddCell, handleCellTypeChange, 
handleCellChange}: StructureProposalProps) => {

  const renderCell = (cell: NotebookCell, cellIndex: number) => (
    <div key={cellIndex} className={styles.page}>
      <div className={styles.pageTypeAndPlaceholders}>
        <input
          type="text"
          value={cell.type}
          onChange={(e) => handleCellTypeChange(cellIndex, e.target.value)}
          className={styles.pageType}
        />
        <input
          type="text"
          value={cell.content}
          onChange={(e) => handleCellChange(cellIndex, e.target.value)}
          className={styles.placeholderInput}
        />
      </div>
    </div>
  );

  return (
    <div className={styles.structureProposalContainer}>
      <h2>{structure.notebook_name}</h2>
      <div className={styles.structureContent}>
        <h3>Proposed Notebook Structure</h3>
                {structure.cells.map((cell, index) => 
                  renderCell(cell, index)
                )}
        <button 
          onClick={handleAddCell}
          className={styles.addSectionButton}
        >
          Add New Cell
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
            onClick={() => onFeedback(JSON.stringify(structure))}
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
