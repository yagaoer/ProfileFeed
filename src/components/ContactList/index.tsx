import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { fetchContacts, setScrollPosition, setABTestVariant, getRandomABTestVariant } from '../../store/contactsSlice';
import { useInfiniteScroll, useScrollPosition } from '../../hooks/useIntersectionObserver';
import { useAnalytics } from '../../utils/analytics';
import ContactCard from '../ContactCard';
import './styles.css';
import { AppDispatch } from '../../store';

const ContactList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const analytics = useAnalytics();
  const { contacts, isLoading, error, page, hasMore, scrollPosition, abTest } = useSelector(
    (state: RootState) => state.contacts
  );

  // 初始化AB测试变体
  useEffect(() => {
    const variant = getRandomABTestVariant();
    dispatch(setABTestVariant(variant));
    analytics.trackABTestImpression(variant);
    // 开启埋点调试模式
    analytics.enableDebugMode();
  }, [dispatch, analytics]);

  // 加载更多数据的回调函数
  const loadMoreContacts = () => {
    if (!isLoading && hasMore) {
      dispatch(fetchContacts(page));
    }
  };

  // 初始加载数据
  useEffect(() => {
    if (contacts.length === 0 && hasMore) {
      loadMoreContacts();
    }
  }, [contacts.length, hasMore]); // eslint-disable-line react-hooks/exhaustive-deps

  // 保存滚动位置
  const saveScrollPosition = (position: number) => {
    dispatch(setScrollPosition(position));
    // 每当滚动位置变化时，触发滚动埋点
    analytics.trackScroll(position, page);
  };

  // 使用自定义Hook记录和恢复滚动位置
  useScrollPosition(scrollPosition, saveScrollPosition);

  // 使用自定义Hook实现无限滚动
  const loadMoreRef = useInfiniteScroll(loadMoreContacts, isLoading, hasMore);

  return (
    <div className="contact-list-container">
      <h1 className="list-title">人脉推荐</h1>
      
      {error && <div className="error-message">加载失败: {error}</div>}
      
      <div className="contact-list">
        {contacts.map((contact, index) => (
          <ContactCard 
            key={contact.id} 
            contact={contact}
            pageNumber={Math.floor(index / 10) + 1}
            abTestVariant={abTest}
            style={{
              // 根据AB测试变体应用不同样式
              ...(abTest === 'variant_a' ? { borderLeft: '3px solid #1890ff' } : {}),
              ...(abTest === 'variant_b' ? { backgroundColor: '#fafafa' } : {})
            }}
          />
        ))}
      </div>
      
      {isLoading && (
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      )}
      
      {!isLoading && hasMore && (
        <div ref={loadMoreRef} className="load-more-trigger">
          {/* 这个元素用于触发无限滚动，不需要显示内容 */}
        </div>
      )}
      
      {!hasMore && contacts.length > 0 && (
        <div className="end-message">
          已经到底啦，没有更多人脉了~
        </div>
      )}
    </div>
  );
};

export default ContactList; 