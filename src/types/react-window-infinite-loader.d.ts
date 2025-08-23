declare module 'react-window-infinite-loader' {
  import { ComponentType, ReactElement } from 'react';

  export interface InfiniteLoaderProps {
    children: (props: {
      onItemsRendered: (props: {
        overscanStartIndex: number;
        overscanStopIndex: number;
        visibleStartIndex: number;
        visibleStopIndex: number;
      }) => void;
      ref: (ref: any) => void;
    }) => ReactElement;
    isItemLoaded: (index: number) => boolean;
    itemCount: number;
    loadMoreItems: (startIndex: number, stopIndex: number) => Promise<void> | void;
    minimumBatchSize?: number;
    threshold?: number;
  }

  declare const InfiniteLoader: ComponentType<InfiniteLoaderProps>;
  export default InfiniteLoader;
}
