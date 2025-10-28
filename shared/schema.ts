import { z } from "zod";

// Enums
export type DayKind = 'normal' | 'descanso' | 'vacaciones' | 'compensatoria' | 'baja';
export type ShiftType = 'generico' | 'complementario' | 'adquirido';
export type AnnotationScope = 'whole' | 'complementaryTail' | 'overtimeTail' | 'range';
export type Theme = 'light' | 'dark' | 'system';

// UserProfile schema
export interface UserProfile {
  uid: string;
  email: string;
  currency: 'EUR';
  timezone: string;
  theme: Theme;
  rates: {
    base: number;
    extra: number;
    night: number;
    complementary?: number;
  };
  nightWindow: {
    from: string; // HH:mm format
    to: string;   // HH:mm format
  };
  contract: {
    hoursPerWeek: number;
    workDaysPerWeek: number;
  };
  createdAtISO: string;
  updatedAtISO: string;
}

export const userProfileSchema = z.object({
  uid: z.string(),
  email: z.string().email(),
  currency: z.literal('EUR'),
  timezone: z.string(),
  theme: z.enum(['light', 'dark', 'system']),
  rates: z.object({
    base: z.number().positive(),
    extra: z.number().positive(),
    night: z.number().positive(),
    complementary: z.number().positive().optional(),
  }),
  nightWindow: z.object({
    from: z.string().regex(/^\d{2}:\d{2}$/),
    to: z.string().regex(/^\d{2}:\d{2}$/),
  }),
  contract: z.object({
    hoursPerWeek: z.number().positive(),
    workDaysPerWeek: z.number().positive().int(),
  }),
  createdAtISO: z.string(),
  updatedAtISO: z.string(),
});

export type InsertUserProfile = Omit<UserProfile, 'uid' | 'createdAtISO' | 'updatedAtISO'>;

// Annotation schema
export interface Annotation {
  id: string;
  scope: AnnotationScope;
  startOffsetMin?: number;
  endOffsetMin?: number;
  text: string;
  tags?: string[];
  createdAtISO: string;
}

export const annotationSchema = z.object({
  id: z.string(),
  scope: z.enum(['whole', 'complementaryTail', 'overtimeTail', 'range']),
  startOffsetMin: z.number().int().min(0).optional(),
  endOffsetMin: z.number().int().min(0).optional(),
  text: z.string(),
  tags: z.array(z.string()).optional(),
  createdAtISO: z.string(),
});

// Shift schema
export interface Shift {
  id: string;
  uid: string;
  kind: DayKind;
  dateISO: string; // YYYY-MM-DD in user's timezone
  
  // For kind === 'normal'
  startISO?: string; // UTC ISO string
  endISO?: string;   // UTC ISO string
  breaksMinutes?: number;
  complementaryMinutes?: number;
  overtimeMinutes?: number;
  isExtraShift?: boolean;
  extraShiftInfo?: {
    colleagueName?: string;
  };
  type?: ShiftType;
  annotations?: Annotation[];
  
  // For kind !== 'normal' (special days)
  paidMinutesOverride?: number;
  
  // Import overrides
  overrideRates?: {
    base?: number;
    extra?: number;
    night?: number;
    complementary?: number;
  };
  eurosOverride?: number;
  source?: {
    origin: 'manual' | 'import';
    fileName?: string;
    fileRow?: number;
    filePrice?: number;
    fileAmount?: number;
    appliedMode?: 'none' | 'file-base' | 'file-scaled' | 'file-amount-lock';
  };
  
  // Calculation cache
  calcCache?: {
    baseMin: number;
    extraMin: number;
    nightMin: number;
    complementaryMin: number;
    euros: number;
  };
  
  createdAtISO: string;
  updatedAtISO: string;
}

export const shiftSchema = z.object({
  id: z.string(),
  uid: z.string(),
  kind: z.enum(['normal', 'descanso', 'vacaciones', 'compensatoria', 'baja']),
  dateISO: z.string(),
  startISO: z.string().optional(),
  endISO: z.string().optional(),
  breaksMinutes: z.number().int().min(0).optional(),
  complementaryMinutes: z.number().int().min(0).optional(),
  overtimeMinutes: z.number().int().min(0).optional(),
  isExtraShift: z.boolean().optional(),
  extraShiftInfo: z.object({
    colleagueName: z.string().optional(),
  }).optional(),
  type: z.enum(['generico', 'complementario', 'adquirido']).optional(),
  annotations: z.array(annotationSchema).optional(),
  paidMinutesOverride: z.number().int().min(0).optional(),
  overrideRates: z.object({
    base: z.number().positive().optional(),
    extra: z.number().positive().optional(),
    night: z.number().positive().optional(),
    complementary: z.number().positive().optional(),
  }).optional(),
  eurosOverride: z.number().optional(),
  source: z.object({
    origin: z.enum(['manual', 'import']),
    fileName: z.string().optional(),
    fileRow: z.number().int().optional(),
    filePrice: z.number().optional(),
    fileAmount: z.number().optional(),
    appliedMode: z.enum(['none', 'file-base', 'file-scaled', 'file-amount-lock']).optional(),
  }).optional(),
  calcCache: z.object({
    baseMin: z.number(),
    extraMin: z.number(),
    nightMin: z.number(),
    complementaryMin: z.number(),
    euros: z.number(),
  }).optional(),
  createdAtISO: z.string(),
  updatedAtISO: z.string(),
});

export type InsertShift = Omit<Shift, 'id' | 'createdAtISO' | 'updatedAtISO'>;

// Helper type for shift form data
export const insertShiftSchema = shiftSchema.omit({
  id: true,
  createdAtISO: true,
  updatedAtISO: true,
});

// Export helper types
export type User = UserProfile;
export type InsertUser = InsertUserProfile;
