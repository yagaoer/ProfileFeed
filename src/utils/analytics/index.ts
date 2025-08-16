import { TrackEvent, TrackEventType, ABTestVariant } from '../../types';

// 埋点类
class Analytics {
  private static instance: Analytics;
  private events: TrackEvent[] = [];
  private debugMode: boolean = false;

  private constructor() {
    // 单例模式
  }

  // 获取单例
  public static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  // 开启调试模式
  public enableDebugMode(): void {
    this.debugMode = true;
    console.log('[埋点] 调试模式已启用');
  }

  // 跟踪事件
  public track(event: TrackEvent): void {
    this.events.push(event);
    
    if (this.debugMode) {
      console.log(`[埋点] ${event.type}:`, event.data);
    }

    // 在实际项目中，这里应该将事件发送到后端或分析服务
    // 这里我们只是模拟埋点行为
    this.sendToServer(event);
  }

  // 跟踪页面浏览事件
  public trackView(contactId: string, page: number, abTestVariant: ABTestVariant): void {
    this.track({
      type: TrackEventType.VIEW,
      data: {
        contactId,
        page,
        timestamp: Date.now(),
        abTestVariant,
      },
    });
  }

  // 跟踪点击事件
  public trackClick(elementId: string, contactId?: string, page?: number): void {
    this.track({
      type: TrackEventType.CLICK,
      data: {
        elementId,
        contactId,
        page,
        timestamp: Date.now(),
      },
    });
  }

  // 跟踪连接按钮点击事件
  public trackConnect(contactId: string, page: number): void {
    this.track({
      type: TrackEventType.CONNECT,
      data: {
        contactId,
        page,
        timestamp: Date.now(),
      },
    });
  }

  // 跟踪滚动事件
  public trackScroll(position: number, page: number): void {
    this.track({
      type: TrackEventType.SCROLL,
      data: {
        position,
        page,
        timestamp: Date.now(),
      },
    });
  }

  // 跟踪AB测试事件
  public trackABTestImpression(variant: ABTestVariant, contactId?: string): void {
    this.track({
      type: TrackEventType.AB_TEST_IMPRESSION,
      data: {
        abTestVariant: variant,
        contactId,
        timestamp: Date.now(),
      },
    });
  }

  // 模拟将事件发送到服务器
  private sendToServer(event: TrackEvent): void {
    // 在实际项目中，这里应该调用API将事件发送到后端
    // 例如：
    // fetch('https://analytics.api.example.com/track', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(event),
    // });

    // 这里我们只是模拟发送
    setTimeout(() => {
      if (this.debugMode) {
        console.log(`[埋点] 事件已发送到服务器: ${event.type}`);
      }
    }, 100);
  }
}

// 导出埋点系统单例
export const analytics = Analytics.getInstance();

// 创建埋点系统的自定义React Hook
export function useAnalytics() {
  return analytics;
} 