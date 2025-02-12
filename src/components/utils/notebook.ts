// types/notebook.ts
import axios from 'axios';
export interface PagePlaceholder {
    name: string;
  }
  
export interface NotebookPage {
  title: string;
  type: string;
  placeholders: string[];
  content?: string;
}

export interface NotebookCell {
  type: string;
  content: string;
}

export interface NotebookStructure {
  notebook_name: string;
  cells: NotebookCell[];
}

export interface StructureResponse {
  structure: NotebookStructure;
}
export interface TopicResponse {
  topics: string[];
}

export interface FeedbackRequest {
  feedback: string
}

export interface NotebookResponse {
  notebook: string;
}

export interface CellResponse {
  content: string;
}

export interface  Documents {
  documents: string[];
}

export interface IndexDocumentRequest {
  file: File;
}

export interface IndexDocumentResponse {
  message: string;
}

export interface DeleteDocumentResponse {
  message: string;
}

export interface SelectDocumentsResponse {
  message: string;
}

export class NotebookStructureClient {
  private static generate_structure_url = 'http://0.0.0.0:8000/generate_structure';
  private static generate_feedback_structure_url = 'http://0.0.0.0:8000/generate_feedback_structure';
  private static generate_topics_url = 'http://localhost:8000/generate_topics';
  private static generate_feedback_topics_url = 'http://0.0.0.0:8000/generate_feedback_topics';
  private static generate_notebook_url = 'http://0.0.0.0:8000/generate_notebook';

  static async generateTopics(topic: string, notebook_count: number): Promise<TopicResponse> {
    console.log("topic :",  topic, notebook_count, notebook_count)
    try {
      const response = await axios.post<TopicResponse>(
        this.generate_topics_url,
        {
          "topic": topic, 
          "notebook_count" : notebook_count
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating notebook topics:', error);
      throw error;
    }
  }

  static async generateFeedbackTopics(topics: string, feedback: string): Promise<TopicResponse> {
    try {
      const response = await axios.post<TopicResponse>(
        this.generate_feedback_topics_url,
        { topics , feedback },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response from server:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error generating notebook structure:', error);
      throw error;
    }
  }

  static async generateStructure(topic: string): Promise<StructureResponse> {
    try {
      const response = await axios.post<StructureResponse>(
        this.generate_structure_url,
        { topic },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Response from server:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error generating notebook structure:', error);
      throw error;
    }
  }

  static async generateCellContent(topic: string, prompt: string): Promise<CellResponse> {
    try {
      const response = await axios.post<CellResponse>(
        'http://0.0.0.0:8000/generate_cell_content',
        { topic, prompt },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response from server:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating cell content:', error);
      throw error;
    }
  }
  static async generateFeedbackStructure(structure: string, feedback: string): Promise<StructureResponse> {
    try {
      const response = await axios.post<StructureResponse>(
        this.generate_feedback_structure_url,
        { structure, feedback },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response from server:', response.data);

      return response.data;
    } catch (error) {
      console.error('Error generating notebook structure:', error);
      throw error;
    }
  }

  static async generateNotebook(structure: NotebookStructure): Promise<NotebookResponse> {
    try {
      const response = await axios.post<NotebookResponse>(
        this.generate_notebook_url,
        { 
          'structure' : structure 
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Notebook generation response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating notebook:', error);
      throw error;
    }
  }

  static async getDocuments() : Promise<Documents> {
    try {
      const response = await axios.get<Documents>(
        'http://0.0.0.0:8000/get_documents',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response from server:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error generating notebook:', error);
      throw error;
    }
  }

  static async indexDocument(file: File): Promise<void> {
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post<IndexDocumentResponse>(
        'http://0.0.0.0:8000/index_pdf',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      console.log('PDF indexing response:', response.data.message);
    } catch (error) {
      console.error('Error indexing PDF:', error);
      throw error;
    }
  }

  static async deleteDocument(filename: string): Promise<void> {
    try {
      const response = await axios.post<DeleteDocumentResponse>(
        'http://0.0.0.0:8000/delete_pdf',
        {filename},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
        console.log('PDF deletion response:', response.data);
    } catch (error) {
        console.error('Error deleting PDF:', error);
        throw error;
    }
  }
  
  static async selectDocuments(filenames: string[]): Promise<void> {
    try {
      const response = await axios.post<SelectDocumentsResponse>(
        'http://0.0.0.0:8000/select_pdfs',
        { filenames },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('PDF selection response:', response.data);
    } catch (error) {
      console.error('Error selecting PDFs:', error);
      throw error;
    }
  }
}