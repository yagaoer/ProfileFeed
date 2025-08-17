import React, { useState } from 'react';
import './styles.css';

interface PerformanceMetrics {
  component: string;
  renderTime: number;
  memoryUsage: number;
  fps: number;
  domNodes: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
}

const PerformanceDemo: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // 模拟性能测试数据
  const generateMockMetrics = (): PerformanceMetrics[] => {
    return [
      {
        component: '普通列表 (1000项)',
        renderTime: 850,
        memoryUsage: 45.2,
        fps: 28,
        domNodes: 1000,
        firstContentfulPaint: 2100,
        largestContentfulPaint: 3200
      },
      {
        component: '虚拟列表 (1000项)',
        renderTime: 120,
        memoryUsage: 18.5,
        fps: 58,
        domNodes: 50,
        firstContentfulPaint: 450,
        largestContentfulPaint: 680
      },
      {
        component: '普通列表 + 懒加载',
        renderTime: 650,
        memoryUsage: 38.7,
        fps: 35,
        domNodes: 1000,
        firstContentfulPaint: 1800,
        largestContentfulPaint: 2500
      },
      {
        component: '虚拟列表 + 懒加载',
        renderTime: 95,
        memoryUsage: 15.8,
        fps: 60,
        domNodes: 50,
        firstContentfulPaint: 380,
        largestContentfulPaint: 520
      }
    ];
  };

  const runPerformanceTest = async () => {
    setIsRunning(true);
    setMetrics([]);

    // 模拟测试过程
    const testData = generateMockMetrics();
    
    for (let i = 0; i < testData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prev => [...prev, testData[i]]);
    }
    
    setIsRunning(false);
  };

  const getPerformanceGrade = (value: number, type: 'fps' | 'memory' | 'time') => {
    switch (type) {
      case 'fps':
        if (value >= 55) return 'excellent';
        if (value >= 45) return 'good';
        if (value >= 30) return 'average';
        return 'poor';
      case 'memory':
        if (value <= 20) return 'excellent';
        if (value <= 35) return 'good';
        if (value <= 50) return 'average';
        return 'poor';
      case 'time':
        if (value <= 200) return 'excellent';
        if (value <= 500) return 'good';
        if (value <= 1000) return 'average';
        return 'poor';
      default:
        return 'average';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'excellent': return '#52c41a';
      case 'good': return '#1890ff';
      case 'average': return '#faad14';
      case 'poor': return '#ff4d4f';
      default: return '#666';
    }
  };

  const getGradeText = (grade: string) => {
    switch (grade) {
      case 'excellent': return '优秀';
      case 'good': return '良好';
      case 'average': return '一般';
      case 'poor': return '较差';
      default: return '未知';
    }
  };

  return (
    <div className="performance-demo">
      <div className="demo-header">
        <h2>性能对比演示</h2>
        <p>对比不同优化方案下的性能表现</p>
        <button 
          className="run-test-btn"
          onClick={runPerformanceTest}
          disabled={isRunning}
        >
          {isRunning ? '测试中...' : '开始性能测试'}
        </button>
      </div>

      <div className="metrics-container">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <h3>{metric.component}</h3>
            
            <div className="metric-grid">
              <div className="metric-item">
                <span className="metric-label">渲染时间</span>
                <span 
                  className="metric-value"
                  style={{ color: getGradeColor(getPerformanceGrade(metric.renderTime, 'time')) }}
                >
                  {metric.renderTime}ms
                </span>
                <span className="metric-grade">
                  {getGradeText(getPerformanceGrade(metric.renderTime, 'time'))}
                </span>
              </div>

              <div className="metric-item">
                <span className="metric-label">内存使用</span>
                <span 
                  className="metric-value"
                  style={{ color: getGradeColor(getPerformanceGrade(metric.memoryUsage, 'memory')) }}
                >
                  {metric.memoryUsage}MB
                </span>
                <span className="metric-grade">
                  {getGradeText(getPerformanceGrade(metric.memoryUsage, 'memory'))}
                </span>
              </div>

              <div className="metric-item">
                <span className="metric-label">帧率 (FPS)</span>
                <span 
                  className="metric-value"
                  style={{ color: getGradeColor(getPerformanceGrade(metric.fps, 'fps')) }}
                >
                  {metric.fps}
                </span>
                <span className="metric-grade">
                  {getGradeText(getPerformanceGrade(metric.fps, 'fps'))}
                </span>
              </div>

              <div className="metric-item">
                <span className="metric-label">DOM节点</span>
                <span className="metric-value">{metric.domNodes}</span>
                <span className="metric-grade">
                  {metric.domNodes <= 100 ? '优秀' : metric.domNodes <= 500 ? '良好' : '较多'}
                </span>
              </div>

              <div className="metric-item">
                <span className="metric-label">首次内容绘制</span>
                <span 
                  className="metric-value"
                  style={{ color: getGradeColor(getPerformanceGrade(metric.firstContentfulPaint, 'time')) }}
                >
                  {metric.firstContentfulPaint}ms
                </span>
                <span className="metric-grade">
                  {getGradeText(getPerformanceGrade(metric.firstContentfulPaint, 'time'))}
                </span>
              </div>

              <div className="metric-item">
                <span className="metric-label">最大内容绘制</span>
                <span 
                  className="metric-value"
                  style={{ color: getGradeColor(getPerformanceGrade(metric.largestContentfulPaint, 'time')) }}
                >
                  {metric.largestContentfulPaint}ms
                </span>
                <span className="metric-grade">
                  {getGradeText(getPerformanceGrade(metric.largestContentfulPaint, 'time'))}
                </span>
              </div>
            </div>
          </div>
        ))}

        {isRunning && (
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p>正在运行性能测试...</p>
          </div>
        )}
      </div>

      {metrics.length > 0 && (
        <div className="optimization-summary">
          <h3>优化效果总结</h3>
          <div className="summary-grid">
            <div className="summary-item">
              <h4>渲染性能提升</h4>
              <p>虚拟列表相比普通列表，渲染时间减少了 <strong>85.9%</strong></p>
            </div>
            <div className="summary-item">
              <h4>内存使用优化</h4>
              <p>内存占用减少了 <strong>65.0%</strong>，有效避免内存泄漏</p>
            </div>
            <div className="summary-item">
              <h4>帧率大幅提升</h4>
              <p>从 28fps 提升到 60fps，提升了 <strong>114.3%</strong></p>
            </div>
            <div className="summary-item">
              <h4>DOM节点优化</h4>
              <p>DOM节点数量减少了 <strong>95%</strong>，显著提升滚动性能</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceDemo;
