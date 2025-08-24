import React, { useState } from 'react';
import { Provider } from 'react-redux';
import store from './store';
import ContactList from './components/ContactList';
import VirtualContactList from './components/VirtualContactList';
import PerformanceMonitor from './components/PerformanceMonitor';
import PerformanceDemo from './components/PerformanceDemo';
import './App.css';

type ListMode = 'normal' | 'virtual';
type PageMode = 'list' | 'demo';

function App() {
  const [listMode, setListMode] = useState<ListMode>('virtual');
  const [pageMode, setPageMode] = useState<PageMode>('list');
  const [showPerformanceMonitor, setShowPerformanceMonitor] = useState(true);

  return (
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <div className="logo">ProfileFeed</div>
          <nav>
            <ul>
              <li 
                className={pageMode === 'list' ? 'active' : ''}
                onClick={() => setPageMode('list')}
              >
                卡片列表
              </li>
              <li 
                className={pageMode === 'demo' ? 'active' : ''}
                onClick={() => setPageMode('demo')}
              >
                性能演示
              </li>
            </ul>
          </nav>
          {pageMode === 'list' && (
            <div className="header-controls">
              <div className="list-mode-switcher">
                <label>
                  <input
                    type="radio"
                    value="normal"
                    checked={listMode === 'normal'}
                    onChange={(e) => setListMode(e.target.value as ListMode)}
                  />
                  普通列表
                </label>
                <label>
                  <input
                    type="radio"
                    value="virtual"
                    checked={listMode === 'virtual'}
                    onChange={(e) => setListMode(e.target.value as ListMode)}
                  />
                  虚拟列表
                </label>
              </div>
              <button
                className="performance-toggle-btn"
                onClick={() => setShowPerformanceMonitor(!showPerformanceMonitor)}
              >
                {showPerformanceMonitor ? '隐藏' : '显示'}性能监控
              </button>
            </div>
          )}
        </header>
        <main>
          {pageMode === 'list' ? (
            listMode === 'virtual' ? <VirtualContactList /> : <ContactList />
          ) : (
            <PerformanceDemo />
          )}
        </main>
        <footer>
          <p>© 2024 ProfileFeed - 前端性能优化项目</p>
        </footer>
        
        <PerformanceMonitor 
          enabled={showPerformanceMonitor}
          position="top-right"
          onMetricsUpdate={(metrics) => {
            // 可以在这里处理性能数据，比如发送到监控系统
            if (metrics.fps < 30) {
              // eslint-disable-next-line no-console
              console.warn('性能警告: FPS过低', metrics);
            }
          }}
        />
      </div>
    </Provider>
  );
}

export default App;
