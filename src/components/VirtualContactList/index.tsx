import React, { useCallback, useEffect, useMemo } from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import InfiniteLoader from 'react-window-infinite-loader';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchContacts, setABTestVariant, getRandomABTestVariant } from '../../store/contactsSlice';
import { useAnalytics } from '../../utils/analytics';
import ContactCard from '../ContactCard';
import { AppDispatch } from '../../store';
import './styles.css';

// 卡片高度常量
const ITEM_HEIGHT = 200; // 每个卡片的固定高度
const CONTAINER_HEIGHT = 600; // 虚拟列表容器高度

interface VirtualContactListProps {
  width?: number;
  height?: number;
}

const VirtualContactList: React.FC<VirtualContactListProps> = ({
  width = '100%',
  height = CONTAINER_HEIGHT
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const analytics = useAnalytics();
  const { contacts, isLoading, error, page, hasMore, abTest } = useSelector(
    (state: RootState) => state.contacts
  );

  // 初始化AB测试变体
  useEffect(() => {
    const variant = getRandomABTestVariant();
    dispatch(setABTestVariant(variant));
    analytics.trackABTestImpression(variant);
    analytics.enableDebugMode();
  }, [dispatch, analytics]);

  // 加载更多数据
  const loadMoreItems = useCallback(async () => {
    if (!isLoading && hasMore) {
      await dispatch(fetchContacts(page));
    }
  }, [dispatch, isLoading, hasMore, page]);

  // 检查项目是否已加载
  const isItemLoaded = useCallback((index: number) => {
    return !!contacts[index];
  }, [contacts]);

  // 计算总项目数（包括正在加载的项目）
  const itemCount = useMemo(() => {
    return hasMore ? contacts.length + 1 : contacts.length;
  }, [contacts.length, hasMore]);

  // 渲染单个列表项
  const renderItem = useCallback(({ index, style }: ListChildComponentProps) => {
    const contact = contacts[index];
    
    // 如果是加载占位符
    if (!contact) {
      return (
        <div style={style} className="virtual-list-item">
          <div className="loading-placeholder">
            <div className="loading-skeleton-card">
              <div className="skeleton-avatar"></div>
              <div className="skeleton-content">
                <div className="skeleton-line skeleton-title"></div>
                <div className="skeleton-line skeleton-subtitle"></div>
                <div className="skeleton-line skeleton-tags"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={style} className="virtual-list-item">
        <ContactCard
          contact={contact}
          pageNumber={Math.floor(index / 10) + 1}
          abTestVariant={abTest}
          style={{
            // 根据AB测试变体应用不同样式
            ...(abTest === 'variant_a' ? { borderLeft: '3px solid #1890ff' } : {}),
            ...(abTest === 'variant_b' ? { backgroundColor: '#fafafa' } : {}),
            margin: '8px 16px',
            height: 'calc(100% - 16px)'
          }}
        />
      </div>
    );
  }, [contacts, abTest]);

  // 初始加载数据
  useEffect(() => {
    if (contacts.length === 0 && hasMore) {
      loadMoreItems();
    }
  }, [contacts.length, hasMore, loadMoreItems]);

  if (error) {
    return (
      <div className="virtual-list-error">
        <p>加载失败: {error}</p>
        <button onClick={() => dispatch(fetchContacts(1))}>重试</button>
      </div>
    );
  }

  return (
    <div className="virtual-contact-list-container">
      <h1 className="list-title">联系人推荐 (虚拟列表)</h1>
      <div className="virtual-list-wrapper">
        <InfiniteLoader
          isItemLoaded={isItemLoaded}
          itemCount={itemCount}
          loadMoreItems={loadMoreItems}
          threshold={5} // 提前5个项目开始加载
        >
          {({ onItemsRendered, ref }) => (
            <List
              ref={ref}
              height={height}
              width={width}
              itemCount={itemCount}
              itemSize={ITEM_HEIGHT}
              onItemsRendered={onItemsRendered}
              overscanCount={3} // 预渲染3个项目
            >
              {renderItem}
            </List>
          )}
        </InfiniteLoader>
      </div>
      
      {contacts.length === 0 && isLoading && (
        <div className="initial-loading">
          <div className="loading-spinner"></div>
          <p>正在加载联系人数据...</p>
        </div>
      )}
      
      {!hasMore && contacts.length > 0 && (
        <div className="end-message">
          已经到底啦，没有更多联系人了~
        </div>
      )}
    </div>
  );
};

export default VirtualContactList;
