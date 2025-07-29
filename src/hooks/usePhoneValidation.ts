import { useState, useCallback } from 'react';
import { apiService } from '@/lib/api';

interface PhoneValidationResult {
  phone: string;
  valid: boolean;
  format?: {
    international: string;
    local: string;
  };
  country?: {
    code: string;
    name: string;
    prefix: string;
  };
  location?: string;
  type?: string;
  carrier?: string;
}

interface PhoneValidationError {
  message: string;
  code?: string;
}

export const usePhoneValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<PhoneValidationResult | null>(null);
  const [error, setError] = useState<PhoneValidationError | null>(null);

  const validatePhone = useCallback(async (phoneNumber: string) => {
    if (!phoneNumber || phoneNumber.trim() === '') {
      setValidationResult(null);
      setError(null);
      return;
    }

    setIsValidating(true);
    setError(null);

    try {
      const response = await apiService.validatePhone(phoneNumber);
      setValidationResult(response);
    } catch (err: any) {
      setError({
        message: err.message || 'Failed to validate phone number',
        code: err.code
      });
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
    setError(null);
  }, []);

  return {
    validatePhone,
    clearValidation,
    isValidating,
    validationResult,
    error,
    isValid: validationResult?.valid || false
  };
}; 