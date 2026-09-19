import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Paragraph } from '../types';

interface ParagraphState {
  paragraphs: Paragraph[];
  addParagraph: (paragraph: Paragraph) => void;
  updateParagraph: (id: string, updates: Partial<Paragraph>) => void;
  deleteParagraph: (id: string) => void;
  getParagraphById: (id: string) => Paragraph | undefined;
}

const defaultParagraphs: Paragraph[] = [
  {
    id: 'p1',
    title: 'Technology and Innovation',
    text: 'Technology is rapidly evolving and constantly changing the way we interact with the world. Innovation drives this process, creating new opportunities and solving complex problems that once seemed impossible. As we look to the future, it is clear that embracing these advancements will be crucial for our continued success.',
    category: 'Technology',
    difficulty: 'Medium',
    wordCount: 48,
    characterCount: 317,
    createdAt: Date.now()
  },
  {
    id: 'p2',
    title: 'Education Today',
    text: 'Modern education focuses on preparing students for a dynamic and unpredictable future. Critical thinking, creativity, and adaptability are now just as important as traditional academic subjects. By fostering a love for lifelong learning, educators can help students navigate an ever-changing landscape.',
    category: 'Education',
    difficulty: 'Medium',
    wordCount: 42,
    characterCount: 295,
    createdAt: Date.now()
  },
  {
    id: 'p3',
    title: 'Science and Discovery',
    text: 'The pursuit of scientific knowledge is a journey of endless discovery. Every new experiment sheds light on the mysteries of the universe, from the microscopic building blocks of life to the vast expanse of galaxies. This quest for understanding is driven by human curiosity and a desire to improve our existence.',
    category: 'Science',
    difficulty: 'Hard',
    wordCount: 52,
    characterCount: 346,
    createdAt: Date.now()
  },
  {
    id: 'p4',
    title: 'Short test',
    text: 'The quick brown fox jumps over the lazy dog and continues through the quiet forest while the morning sunlight appears.',
    category: 'General',
    difficulty: 'Easy',
    wordCount: 21,
    characterCount: 118,
    createdAt: Date.now()
  }
];

export const useParagraphStore = create<ParagraphState>()(
  persist(
    (set, get) => ({
      paragraphs: defaultParagraphs,
      addParagraph: (paragraph) => set((state) => ({ paragraphs: [...state.paragraphs, paragraph] })),
      updateParagraph: (id, updates) => set((state) => ({
        paragraphs: state.paragraphs.map(p => p.id === id ? { ...p, ...updates } : p)
      })),
      deleteParagraph: (id) => set((state) => ({ paragraphs: state.paragraphs.filter(p => p.id !== id) })),
      getParagraphById: (id) => get().paragraphs.find(p => p.id === id),
    }),
    {
      name: 'typeflow-paragraphs',
    }
  )
);
