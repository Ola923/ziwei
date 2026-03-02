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
    setLoading(true);
    const formData = new FormData(e.target);
    
    // 修正日期格式，確保 iztro 能讀懂
    const rawDate = formData.get("date") as string; 
    const date = rawDate.replace(/\//g, '-'); 
    const hour = parseInt(formData.get("hour") as string);
    const gender = formData.get("gender") as string;

    try {
      // 1. 精準排盤
      // @ts-ignore
      const astrolabe = (iztro.functionalAstrolabe || iztro.default.functionalAstrolabe)(date, hour, gender, true);
      const palace = astrolabe.palaces.find((p: any) => p.name === "命宮");
      const stars = palace?.majorStars.map((s: any) => s.name).join('、') || "無主星";

      // 2. 這裡預留給妳貼入 Gemini API 的呼叫邏輯
      // 目前我們先讓它顯示精準結果，確保排盤成功
      setReading(`【大師開示】\n妳的主星是：${stars}\n\n(AI 毒舌加載中：請確認 Vercel 後台已填入 API Key)`);
      
    } catch (err) { 
      console.error(err);
      alert("日期格式怪怪的，請確保是 YYYY-MM-DD 喔！"); 
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
