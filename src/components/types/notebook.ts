// types/notebook.ts
import axios from 'axios';
export interface PagePlaceholder {
    name: string;
  }
  
  export interface NotebookPage {
    title: string;
    type: 'text' | 'code' | 'markdown' | 'chart';
    placeholders?: string[];
    content?: string;
  }
  
  export interface NotebookSection {
    name: string;
    pages: NotebookPage[];
  }
  
  export interface NotebookStructure {
    notebook_name: string;
    sections: NotebookSection[];
  }
  
  export interface StructureRequest {
    topic: string;
  }
  
  export interface StructureResponse {
    structure: NotebookStructure;
  }

export class NotebookStructureClient {
  private static BASE_URL = 'http://0.0.0.0:8000/generate_structure';

  static async generateStructure(topic: string): Promise<StructureResponse> {
    try {
      const response = await axios.post<StructureResponse>(
        this.BASE_URL,
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
}
