import { useEffect, useState } from 'react';
import type { Observable } from 'rxjs';

/**
 * Subscribe to an RxJS Observable and re-render with each emitted value.
 * The subscription is torn down on unmount or when the observable changes.
 */
export function useObservable<T>(observable: Observable<T>, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    const subscription = observable.subscribe(setValue);
    return () => subscription.unsubscribe();
  }, [observable]);

  return value;
}
