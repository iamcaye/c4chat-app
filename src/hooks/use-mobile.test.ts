import { renderHook } from '@testing-library/react';
import { useIsMobile } from './use-mobile';

declare global {
  interface Window {
    matchMedia: (query: string) => MediaQueryList;
  }
}

describe('useIsMobile', () => {
  beforeEach(() => {
    window.matchMedia = (query: string) => ({
      matches: window.innerWidth < 768,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    });
  });

  it('returns true when width below 768', () => {
    window.innerWidth = 500;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false when width above 768', () => {
    window.innerWidth = 800;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });
});
