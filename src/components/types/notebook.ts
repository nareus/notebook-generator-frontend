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

export interface StructureResponse {
  structure: NotebookStructure;
}
export interface TopicResponse {
  topics: string[];
}

export interface FeedbackRequest {
  feedback: string
}

export class NotebookStructureClient {
  private static generate_structure_url = 'http://0.0.0.0:8000/generate_structure';
  private static generate_feedback_structure_url = 'http://0.0.0.0:8000/generate_feedback_structure';
  private static generate_topics_url = 'http://0.0.0.0:8000/generate_topics';
  private static generate_feedback_topics_url = 'http://0.0.0.0:8000/generate_feedback_topics';

  static async generateTopics(topic: string, notebook_count: number): Promise<TopicResponse> {
    try {
      const response = await axios.post<TopicResponse>(
        this.generate_topics_url,
        { topic, notebook_count },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('Response from server:', response.data);

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
}
