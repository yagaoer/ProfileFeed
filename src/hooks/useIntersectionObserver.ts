import { useEffect, useRef, useState, MutableRefObject } from 'react';

// 自定义Hook: 检测元素是否在可视区域内
export const useInView = (
  options?: IntersectionObserverInit
): [MutableRefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState<boolean>(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options]);

  return [ref, inView];
};

// 自定义Hook: 无限滚动
export const useInfiniteScroll = (
  callback: () => void,
  isLoading: boolean,
  hasMore: boolean,
  options?: IntersectionObserverInit
): MutableRefObject<HTMLDivElement | null> => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || isLoading || !hasMore) return;

    const observer = new IntersectionObserver(([entry]) => {
      // 当加载更多元素可见且不是正在加载状态时，触发回调
      if (entry.isIntersecting && !isLoading && hasMore) {
        callback();
      }
    }, options || { rootMargin: '100px' });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [callback, isLoading, hasMore, options]);

  return loadMoreRef;
};

// 自定义Hook: 记录并恢复滚动位置
export const useScrollPosition = (
  position: number,
  savePosition: (position: number) => void
): void => {
  useEffect(() => {
    // 恢复上次的滚动位置
    if (position > 0) {
      window.scrollTo(0, position);
    }

    // 在组件卸载前保存当前滚动位置
    const handleScroll = () => {
      savePosition(window.scrollY);
    };

    // 节流函数，避免过于频繁地触发滚动事件
    const throttle = (fn: () => void, delay: number) => {
      let lastCall = 0;
      return () => {
        const now = new Date().getTime();
        if (now - lastCall < delay) {
          return;
        }
        lastCall = now;
        fn();
      };
    };

    const throttledHandleScroll = throttle(handleScroll, 200);

    window.addEventListener('scroll', throttledHandleScroll);
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll);
    };
  }, [position, savePosition]);
};

const hooks = {
  useInView,
  useInfiniteScroll,
  useScrollPosition,
};

export default hooks; 