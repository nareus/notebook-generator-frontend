// import React, { useEffect, useRef } from 'react';
// import {  
//   NotebookCell
// } from '../types/notebook';
// import styles from './StructureProposal.module.scss';

// export const RenderCell = (cell: NotebookCell, cellIndex: number) => {
    
//     const textareaRef = useRef<HTMLTextAreaElement>(null);
//     useEffect(() => {
//       if (textareaRef.current) {
//         textareaRef.current.style.height = 'auto';
//         textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
//       }
//     }, [cell.content]);

//     return (
//       <div key={cellIndex} className={styles.cell}>
//         <div className={styles.cellTypeAndContent}>
//           <input
//             value={cell.type}
//             onChange={(e) => handleCellTypeChange(cellIndex, e.target.value)}
//             className={styles.cellType}
//           />
//           <textarea
//             value={cell.content}
//             onChange={(e) => handleCellChange(cellIndex, e.target.value)}
//             className={styles.contentInput}
//             style={{ minHeight: '50px', height: 'auto', overflow: 'hidden' }}
//           />
//           <button onClick={() => generateContent(cellIndex, cell.content)}>
//             Generate Content
//           </button>
//         </div>
//       </div>
//     );
//   };
