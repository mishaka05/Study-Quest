
/**
 * Security utilities for the Study Quest application.
 * Focuses on input validation and sanitization to prevent XSS and malicious data injection.
 */

export const sanitizeText = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

export const validateString = (
  input: string, 
  options: { min?: number; max?: number; pattern?: RegExp } = {}
): { valid: boolean; error?: string } => {
  const trimmed = input.trim();
  
  if (options.min !== undefined && trimmed.length < options.min) {
    return { valid: false, error: `Too short (min ${options.min} chars)` };
  }
  
  if (options.max !== undefined && trimmed.length > options.max) {
    return { valid: false, error: `Too long (max ${options.max} chars)` };
  }
  
  if (options.pattern && !options.pattern.test(trimmed)) {
    return { valid: false, error: "Contains invalid characters" };
  }
  
  return { valid: true };
};

export const RATE_LIMITS = {
  AI_REQUESTS_PER_MINUTE: 3,
  MAX_TASK_LENGTH: 100,
  MAX_PROMPT_LENGTH: 200,
  MAX_GUILD_NAME_LENGTH: 20,
};

// Simple rate limiter tracking
export class RateLimiter {
  private static timestamps: number[] = [];

  static canExecute(limit: number, windowMs: number): { allowed: boolean; waitTime?: number } {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(ts => now - ts < windowMs);
    
    if (this.timestamps.length >= limit) {
      const oldest = this.timestamps[0];
      return { 
        allowed: false, 
        waitTime: Math.ceil((windowMs - (now - oldest)) / 1000) 
      };
    }
    
    this.timestamps.push(now);
    return { allowed: true };
  }
}
