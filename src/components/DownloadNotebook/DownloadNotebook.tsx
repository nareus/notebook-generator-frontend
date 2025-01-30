interface DownloadNotebookProps {
    downloadNotebook : () => void
}

export const DownloadNotebook = ({downloadNotebook} : DownloadNotebookProps) => {

    return(
      <button onClick={() => downloadNotebook()}>
        Download 
      </button>
    )
      
  };