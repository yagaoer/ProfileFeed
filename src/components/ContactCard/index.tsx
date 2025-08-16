import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ContactCardProps } from '../../types';
import { useInView } from '../../hooks/useIntersectionObserver';
import { useAnalytics } from '../../utils/analytics';
import { setContactInView, connectContact } from '../../store/contactsSlice';
import './styles.css';

// 联系人卡片组件
const ContactCard: React.FC<{
  contact: ContactCardProps;
  pageNumber: number;
  abTestVariant: string;
  style?: React.CSSProperties;
}> = ({ contact, pageNumber, abTestVariant, style = {} }) => {
  const dispatch = useDispatch();
  const analytics = useAnalytics();
  const [ref, inView] = useInView({ threshold: 0.5 });

  // 监听卡片是否在视图中，用于埋点和设置状态
  useEffect(() => {
    if (inView && !contact.isInView) {
      // 更新Redux状态
      dispatch(setContactInView({ id: contact.id, inView: true }));
      // 触发埋点
      analytics.trackView(contact.id, pageNumber, abTestVariant as any);
    }
  }, [inView, contact.id, contact.isInView, dispatch, pageNumber, abTestVariant, analytics]);

  // 处理连接按钮点击
  const handleConnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(connectContact(contact.id));
    analytics.trackConnect(contact.id, pageNumber);
  };

  // 处理卡片点击
  const handleCardClick = () => {
    analytics.trackClick('contact_card', contact.id, pageNumber);
    // 在实际应用中这里可能会跳转到详情页
    console.log('查看详情:', contact.name);
  };

  return (
    <div 
      ref={ref} 
      className={`contact-card ${inView ? 'in-view' : ''}`}
      onClick={handleCardClick}
      style={{ 
        opacity: contact.isInView ? 1 : 0.6, // 可视状态的视觉反馈
        ...style
      }}
      data-testid={`contact-card-${contact.id}`}
    >
      <div className="avatar-container">
        <img 
          src={contact.avatar} 
          alt={`${contact.name}的头像`} 
          className="avatar"
          loading="lazy" // 使用原生懒加载
        />
      </div>
      <div className="contact-info">
        <h3 className="contact-name">{contact.name}</h3>
        <p className="contact-title">{contact.title} @ {contact.company}</p>
        <p className="contact-industry">{contact.industry}</p>
        
        {contact.education && contact.education.length > 0 && (
          <p className="contact-education">
            {contact.education[0].school} · {contact.education[0].degree}
          </p>
        )}
        
        {contact.experience && contact.experience.length > 0 && (
          <p className="contact-experience">
            {contact.experience[0].title} · {contact.experience[0].company}
          </p>
        )}
        
        {contact.tags && contact.tags.length > 0 && (
          <div className="contact-tags">
            {contact.tags.map(tag => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        )}
        
        <div className="contact-stats">
          <span className="mutual-connection">
            {contact.mutual} 个共同好友
          </span>
          <span className="distance">{contact.distance || '二度人脉'}</span>
        </div>
        
        <button 
          className={`connect-button ${contact.isConnected ? 'connected' : ''}`}
          onClick={handleConnect}
          disabled={contact.isConnected}
        >
          {contact.isConnected ? '已连接' : '加为人脉'}
        </button>
      </div>
    </div>
  );
};

export default ContactCard; 