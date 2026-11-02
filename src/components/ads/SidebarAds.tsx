"use client";

import { useState } from "react";

/**
 * 桌面端 Fixed 侧边栏（lesson_07 4.3——第二大收入块，实测 160×300 $1.85 / 160×600 $1.50）。
 * 左 160×600 全高 + 右 160×300 半高；fixed 定位贴内容区两侧空白；hidden xl:block 只大屏。
 * 自包含 iframe srcDoc；key 空或 0 不渲染。
 */
function Frame({ envKey, w, h }: { envKey: string; w: number; h: number }) {
  const srcDoc = `<!DOCTYPE html><html><body style="margin:0"><script type="text/javascript">atOptions = {'key':'${envKey}','format':'iframe','height':${h},'width':${w},'params':{}};</script><script type="text/javascript" src="//bauval.org/22/${envKey}"></script></body></html>`;
  return (
    <iframe srcDoc={srcDoc} width={w} height={h} scrolling="no" style={{ border: "none" }} title={`ad-${w}x${h}`} />
  );
}

export function SidebarAds() {
  const KEY_LEFT = process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600 || "";
  const KEY_RIGHT = process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300 || "";

  return (
    <>
      {KEY_LEFT && KEY_LEFT !== "0" && (
        <aside
          className="hidden xl:block fixed top-20 w-40 z-10"
          style={{ left: "calc((100vw - 896px) / 2 - 180px)" }}
          aria-label="Advertisement"
        >
          <Frame envKey={KEY_LEFT} w={160} h={600} />
        </aside>
      )}
      {KEY_RIGHT && KEY_RIGHT !== "0" && (
        <aside
          className="hidden xl:block fixed top-20 w-40 z-10"
          style={{ right: "calc((100vw - 896px) / 2 - 180px)" }}
          aria-label="Advertisement"
        >
          <Frame envKey={KEY_RIGHT} w={160} h={300} />
        </aside>
      )}
    </>
  );
}

/**
 * 320×50 底部 Sticky（lesson_07——收入第一大位，实测 $3.25 CPM 占 50% 收入）。
 * 移动+桌面通吃，fixed 底部居中；带关闭按钮；key 空或 0 不渲染。
 */
export function StickyAd() {
  const KEY = process.env.NEXT_PUBLIC_AD_STICKY_320X50 || "";
  const [closed, setClosed] = useState(false);
  if (!KEY || KEY === "0" || closed) return null;
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center" aria-label="Advertisement">
      <div className="relative">
        <button
          onClick={() => setClosed(true)}
          aria-label="Close ad"
          className="absolute -top-6 right-0 grid h-6 w-6 place-items-center rounded-t bg-black/70 text-xs text-white"
        >
          ✕
        </button>
        <Frame envKey={KEY} w={320} h={50} />
      </div>
    </div>
  );
}
