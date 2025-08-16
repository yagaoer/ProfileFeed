import React from 'react';
import { Provider } from 'react-redux';
import store from './store';
import ContactList from './components/ContactList';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <div className="logo">脉脉</div>
          <nav>
            <ul>
              <li className="active">人脉</li>
              <li>职位</li>
              <li>公司</li>
              <li>消息</li>
              <li>我的</li>
            </ul>
          </nav>
        </header>
        <main>
          <ContactList />
        </main>
        <footer>
          <p>© 2024 脉脉 - 前端实习生项目</p>
        </footer>
      </div>
    </Provider>
  );
}

export default App;
