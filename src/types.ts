export type TopicType =
  | 'Love'
  | 'Loss'
  | 'Family'
  | 'Friendship'
  | 'Failure'
  | 'Work'
  | 'Money'
  | 'Time'
  | 'Courage'
  | 'Change'
  | 'Freedom'
  | 'Regret'
  | 'Growth'
  | 'Life';

export const ALL_TOPICS: TopicType[] = [
  'Love',
  'Loss',
  'Family',
  'Friendship',
  'Failure',
  'Work',
  'Money',
  'Time',
  'Courage',
  'Change',
  'Freedom',
  'Regret',
  'Growth',
  'Life',
];

export const TOPIC_LABELS_FA: Record<TopicType, string> = {
  Love: 'عشق',
  Loss: 'فقدان و سوگ',
  Family: 'خانواده',
  Friendship: 'دوستی',
  Failure: 'شکست و آزمون',
  Work: 'کار و رسالت',
  Money: 'ثروت و مادیات',
  Time: 'زمان و کهنسالی',
  Courage: 'شجاعت و جسارت',
  Change: 'تغییر و گذار',
  Freedom: 'آزادی و رهایی',
  Regret: 'افسوس و حسرت',
  Growth: 'رشد و خرد',
  Life: 'معنای زندگی',
};

export interface User {
  id: string;
  email: string;
  displayName: string;
  anonymousMode: boolean;
  age: number;
  country: string;
  city?: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Lesson {
  id: string;
  userId: string;
  text: string;
  context?: string; // Optional "What taught you this?"
  topics: TopicType[];
  status: 'published' | 'hidden';
  isCurrent: boolean;
  publishedAt: string;
  archivedAt?: string;
  createdAt: string;
  authorDisplayName: string;
  authorAge: number;
  authorCountry: string;
  authorCity?: string;
  isAnonymous: boolean;
  neededCount?: number;
}

export interface Keep {
  id: string;
  userId: string;
  lessonId: string;
  createdAt: string;
  lesson?: Lesson;
}

export interface Reflection {
  id: string;
  userId: string;
  lessonId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
  lesson?: Lesson;
}

export interface Report {
  id: string;
  reporterId: string;
  lessonId: string;
  reason: string;
  details?: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
  lesson?: Lesson;
}

export interface UserQuota {
  keepsUsedThisMonth: number;
  maxKeepsPerMonth: number;
  neededUsedThisWeek: number;
  maxNeededPerWeek: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  currentLesson?: Lesson | null;
  quota: UserQuota;
}

export interface CuratedGenerations {
  topic: TopicType;
  title: string;
  lessons: {
    ageRange: string;
    lesson: Lesson;
  }[];
}

export type AppView = 'landing' | 'one' | 'wander' | 'explore' | 'previous' | 'journey' | 'moderation';

export type ThemeMode = 'light' | 'dark';

export interface PreviousLessonItem extends Lesson {
  isKept?: boolean;
  userReflection?: string | null;
  currentEvolution?: Lesson | null;
}

export interface TwoLivesContrast {
  theme: string;
  lessonA: Lesson;
  lessonB: Lesson;
}
