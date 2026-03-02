"use client";
import React, { useState } from 'react';
// @ts-ignore
import * as iztro from 'iztro';

// 使用這行強行獲取函數，避開編譯器的囉唆
const functionalAstrolabe = (iztro as any).functionalAstrolabe || (iztro as any).default?.functionalAstrolabe;

export default function Home() {
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);

  const startAnalysis = async (e: any) => {
    e.preventDefault();
    setReading("");
    setLoading(true);
    const formData = new FormData(e.target);
    
    // 1. 強制將斜線 / 置換為橫槓 -，確保 iztro 不會生氣
    const rawDate = formData.get("date") as string;
    const date = rawDate.replace(/\//g, '-'); 
    const hour = parseInt(formData.get("hour") as string);
    const gender = formData.get("gender") as string;

    try {
      // 1. 排盤 (這部分妳已經成功了)
      // @ts-ignore
      const functionalAstrolabe = iztro.functionalAstrolabe || iztro.default.functionalAstrolabe;
      const astrolabe = functionalAstrolabe(date, hour, gender, true);
      const palace = astrolabe.palaces.find((p: any) => p.name === "命宮");
      const stars = palace?.majorStars.map((s: any) => s.name).join('、') || "無主星";

      // 2. 暴力通訊：直接把 Key 貼在這裡 (取代之前的 process.env)
      const apiKey = "這裡請貼上妳那串 AI_zaSy... 的 API Key"; 
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `妳是犀利紫微大師。命主主星是：${stars}。請針對此組合執行毒舌解盤，並分析 2026 創業運勢，最後給一句毒舌金句。` }] }]
        })
      });

      if (!response.ok) {
        const errorDetail = await response.text();
        console.error("AI Error:", errorDetail);
        throw new Error("AI 無法回應");
      }

      const aiData = await response.json();
      const aiText = aiData.candidates[0].content.parts[0].text;
      setReading(`【命宮主星】：${stars}\n\n${aiText}`);
      
    } catch (err) { 
      setReading("大師斷訊了！請檢查 API Key 是否貼對，或稍後再試。");
    }

      if (!response.ok) throw new Error("AI 連線失敗"); // 增加報錯追蹤

      const aiData = await response.json();
      const aiText = aiData.candidates[0].content.parts[0].text;
      setReading(`【命宮主星】：${stars}\n\n${aiText}`);
      
    } catch (err) { 
      console.error(err);
      setReading("大師斷訊了！請確認 Vercel 的 API Key 是否正確，並重新輸入日期試試。");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#09090b', color: '#e2e8f0', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#8b5cf6', fontSize: '2.5rem', fontWeight: '900', textAlign: 'center' }}>犀利大師 · 雲端道場</h1>
      
      <form onSubmit={startAnalysis} style={{ maxWidth: '400px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>出生日期</label>
        <input type="date" name="date" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }} />
        
        <label>出生時辰</label>
        <select name="hour" style={{ padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff' }}>
          <option value="0">子 (23:00-01:00)</option>
          <option value="2">丑 (01:00-03:00)</option>
          <option value="4">寅 (03:00-05:00)</option>
          <option value="6">卯 (05:00-07:00)</option>
          <option value="8">辰 (07:00-09:00)</option>
          <option value="10">巳 (09:00-11:00)</option>
          <option value="12">午 (11:00-13:00)</option>
          <option value="14">未 (13:00-15:00)</option>
          <option value="16">申 (15:00-17:00)</option>
          <option value="18">酉 (17:00-19:00)</option>
          <option value="20">戌 (19:00-21:00)</option>
          <option value="22">亥 (21:00-23:00)</option>
        </select>

        <label>性別</label>
        <div style={{ display: 'flex', gap: '20px' }}>
          <label><input type="radio" name="gender" value="男" defaultChecked /> 男</label>
          <label><input type="radio" name="gender" value="女" /> 女</label>
        </div>

        <button type="submit" disabled={loading} style={{ background: '#7c3aed', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none', marginTop: '10px' }}>
          {loading ? "正在觀星..." : "開始解碼命格"}
        </button>
      </form>

      {reading && (
        <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', background: '#1e293b', borderRadius: '20px', border: '1px solid #7c3aed', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
          {reading}
        </div>
      )}
    </div>
  );
}
