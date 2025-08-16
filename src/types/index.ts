// 人脉卡片的类型定义
export interface ContactCardProps {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  industry: string;
  mutual: number; // 共同好友数量
  distance?: string; // 社交距离，如"一度人脉"
  tags?: string[]; // 标签，如"技术大牛"、"HR"等
  isConnected: boolean; // 是否已建立连接
  education?: {
    school: string;
    degree?: string;
    major?: string;
    year?: string;
  }[];
  experience?: {
    company: string;
    title: string;
    duration?: string;
  }[];
  isInView?: boolean; // 是否在视图中，用于曝光埋点和懒加载
}

// 人脉卡片视图状态
export interface ContactListState {
  contacts: ContactCardProps[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  scrollPosition: number; // 保存滚动位置
  abTest: ABTestVariant; // AB测试标识
}

// AB测试变体
export enum ABTestVariant {
  Control = 'control',
  VariantA = 'variant_a',
  VariantB = 'variant_b',
}

// 埋点事件类型
export enum TrackEventType {
  VIEW = 'view',
  CLICK = 'click',
  CONNECT = 'connect',
  SCROLL = 'scroll',
  AB_TEST_IMPRESSION = 'ab_test_impression',
}

// 埋点事件数据
export interface TrackEvent {
  type: TrackEventType;
  data: {
    contactId?: string;
    page?: number;
    timestamp: number;
    abTestVariant?: ABTestVariant;
    elementId?: string;
    [key: string]: any; // 其他可能的参数
  };
} 