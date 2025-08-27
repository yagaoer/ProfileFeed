// 联系人卡片的类型定义
export interface ContactCardProps {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company: string;
  industry: string;
  mutual: number; // 共同好友数量
  distance?: string; // 社交距离，如"一度联系人"
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
}

// 联系人卡片视图状态
export interface ContactListState {
  contacts: ContactCardProps[];
  isLoading: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  scrollPosition: number; // 保存滚动位置
} 