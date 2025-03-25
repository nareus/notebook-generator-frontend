import { 
  NotebookStructure, 
  NotebookCell
} from '../utils/notebook';
import styles from './StructureProposal.module.scss';
import { CodeiumEditor } from "@codeium/react-code-editor";
import MDEditor from '@uiw/react-md-editor';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import DeleteIcon from '@mui/icons-material/Delete';

interface StructureProposalProps {
  structure: NotebookStructure;
  onFeedback: (feedback: string) => void;
  onConfirm: () => void;
  handleAddCell: () => void;
  handleCellTypeChange: (cellIndex: number, type: string) => void;
  handleCellChange: (cellIndex: number, content: string) => void;
  handleCellOrderChange: (cellIndex: number, direction: 'up' | 'down') => void;
  handleDeleteCell: (cellIndex: number) => void;
  generateContent: (cellIndex: number, prompt: string, cellType: string) => void;
  generateAllCells: () => void;
}

export const StructureProposal = ({ structure, onFeedback, onConfirm, handleAddCell, handleCellTypeChange, 
handleCellChange, handleCellOrderChange, handleDeleteCell, generateContent, generateAllCells}: StructureProposalProps) => {

  const RenderCell = (cell: NotebookCell, cellIndex: number) => {
    // Define which cell types should render with CodeiumEditor
    const codeCellTypes = ['code_snippet', 'code_with_output', 'code_with_visualization'];
    return (
      <div key={cellIndex} className={styles.cell}>
        <div className={styles.arrows}>
          <ArrowUpwardIcon className={styles.arrow} onClick={() => handleCellOrderChange(cellIndex, 'up')}/>
          <ArrowDownwardIcon className={styles.arrow} onClick={() => handleCellOrderChange(cellIndex, 'down')}/>
        </div>
        
        <div className={styles.cellTypeAndContent}>
          <select
            value={cell.type}
            onChange={(e) => handleCellTypeChange(cellIndex, e.target.value)}
            className={styles.cellType}
          >
            <option value="short_paragraph">Short Paragraph</option>
            <option value="multiple_paragraphs">Multiple Paragraphs</option>
            <option value="bullet_points">Bullet Points</option>
            <option value="code_snippet">Code Snippet</option>
            <option value="code_with_output">Code With Output</option>
            <option value="code_with_visualization">Code With Visualization</option>
            <option value="numbered_list">Numbered List</option>
          </select>
          {codeCellTypes.includes(cell.type.toLowerCase()) ? (
            <CodeiumEditor 
              language="python" 
              theme="vs-light"
              value={cell.content}
              onChange={(value) => handleCellChange(cellIndex, value || '')}
            />
          ) : (
            <MDEditor
              minHeight={500}
              value={cell.content}
              onChange={(value) => handleCellChange(cellIndex, value || '')}
              className={styles.contentInput}
              data-color-mode="light"
            />
          )}
          <div className={styles.cellButtons}>
            {!cell.generated ? (
              cell.loading ? (
                <div className={styles.loadingSpinner}></div>
              ) : (
                <button
                  className={styles.addCellButton} 
                  onClick={() => generateContent(cellIndex, cell.content, cell.type)}
                >
                  Generate Content
                </button>
              )
            ) : (
              <button className={styles.contentGeneratedButton}>
                Content Generated
              </button>
            )}
            <DeleteIcon className={styles.deleteIcon} onClick={() => handleDeleteCell(cellIndex)} />
          </div>
        </div>
      </div>
    );
  };

  
  return (
    <div className={styles.structureProposalContainer}>
      <div className={styles.header}>
        <h2>{structure.notebook_name}</h2>
        <button className={styles.generateAllButton} onClick={() => generateAllCells()}>
          Generate All Content
        </button>
      </div>
      <div className={styles.structureContent}>
        <h3>Proposed Notebook Structure</h3>
        {structure.cells.map((cell, index) => 
          RenderCell(cell, index)
        )}
        <button 
          onClick={handleAddCell}
          className={styles.addCellButton}
        >
          Add New Cell
        </button>
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
    </div>
  );
};
