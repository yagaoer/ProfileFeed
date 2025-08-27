import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { ContactCardProps, ContactListState } from '../types';

// 初始状态
const initialState: ContactListState = {
  contacts: [],
  isLoading: false,
  error: null,
  page: 1,
  hasMore: true,
  scrollPosition: 0,
};

// 异步获取联系人数据
export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (page: number, { rejectWithValue }) => {
    try {
      // 这里使用模拟API，实际项目中应该连接到真实的API
      const response = await axios.get(`https://randomuser.me/api/?page=${page}&results=10&seed=profilefeed`);
      
      // 将API返回的数据转换为我们的类型
      const contacts: ContactCardProps[] = response.data.results.map((user: { login: { uuid: string }; name: { first: string; last: string }; picture: { large: string } }, index: number) => ({
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        avatar: user.picture.large,
        title: ['产品经理', '前端开发', '后端开发', 'UI设计师', '数据分析师'][index % 5],
        company: ['TechCorp', '阿里巴巴', '腾讯', '百度', '字节跳动'][Math.floor(Math.random() * 5)],
        industry: ['互联网', '金融', '教育', '医疗', 'AI'][Math.floor(Math.random() * 5)],
        mutual: Math.floor(Math.random() * 20),
        distance: ['一度联系人', '二度联系人', '二度联系人'][Math.floor(Math.random() * 3)],
        tags: [
          '技术大牛', 'HR', '资深产品', '创业者', '投资人', 
          'React专家', 'TypeScript专家'
        ].sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 1),
        isConnected: Math.random() > 0.7,
        education: [{
          school: ['清华大学', '北京大学', '上海交通大学', '浙江大学', '复旦大学'][Math.floor(Math.random() * 5)],
          degree: ['学士', '硕士', '博士'][Math.floor(Math.random() * 3)],
          major: ['计算机科学', '软件工程', '人工智能', '数据科学', '信息安全'][Math.floor(Math.random() * 5)],
          year: `${2010 + Math.floor(Math.random() * 10)}`,
        }],
        experience: [{
          company: ['TechCorp', '阿里巴巴', '腾讯', '百度', '字节跳动'][Math.floor(Math.random() * 5)],
          title: ['前端工程师', '后端工程师', '全栈工程师', '产品经理', 'UI设计师'][Math.floor(Math.random() * 5)],
          duration: `${2015 + Math.floor(Math.random() * 5)} - 至今`,
        }],
      }));
      
      return contacts;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('未知错误');
    }
  }
);

const contactsSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setScrollPosition: (state, action: PayloadAction<number>) => {
      state.scrollPosition = action.payload;
    },
    connectContact: (state, action: PayloadAction<string>) => {
      const contact = state.contacts.find(contact => contact.id === action.payload);
      if (contact) {
        contact.isConnected = true;
      }
    },
    resetContactsList: (state) => {
      state.contacts = [];
      state.page = 1;
      state.hasMore = true;
      state.scrollPosition = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action: PayloadAction<ContactCardProps[]>) => {
        state.isLoading = false;
        state.contacts = [...state.contacts, ...action.payload];
        state.page += 1;
        // 模拟数据到达末尾
        if (state.page > 5) {
          state.hasMore = false;
        }
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setScrollPosition, connectContact, resetContactsList } = contactsSlice.actions;
export default contactsSlice.reducer;