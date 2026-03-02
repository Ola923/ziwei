"use client";
import React, { useState } from 'react';
// @ts-ignore
import * as iztro from 'iztro';

export default function Home() {
  const [reading, setReading] = useState("");
  const [loading, setLoading] = useState(false);

  const startAnalysis = async (e: any) => {
    e.preventDefault();
    setReading("");
    setLoading(true);
    const formData = new FormData(e.target);
    
    const rawDate = formData.get("date") as string;
    const date = rawDate.replace(/\//g, '-'); 
    const hour = parseInt(formData.get("hour") as string);
    const gender = formData.get("gender") as string;

    try {
      // 1. 執行排盤
      // @ts-ignore
      const functionalAstrolabe = iztro.functionalAstrolabe || iztro.default.functionalAstrolabe;
      const astrolabe = functionalAstrolabe(date, hour, gender, true);
      const palace = astrolabe.palaces.find((p: any) => p.name === "命宮");
      const stars = palace?.majorStars.map((s: any) => s.name).join('、') || "無主星";

      // 2. 顯示主星，證明排盤引擎運作正常
      setReading(`【命宮主星】：${stars}\n\n大師偵測到妳的命格了！目前正在排除 AI 通訊障礙。`);
      
    } catch (err) { 
      console.error(err);
      setReading("排盤引擎出錯，請確認日期格式為 YYYY-MM-DD。");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#09090b', color: '#e2e8f0', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#8b5cf6', fontSize: '2rem', textAlign: 'center' }}>犀利大師 · 雲端道場</h1>
      <form onSubmit={startAnalysis} style={{ maxWidth: '400px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label>出生日期</label>
        <input type="text" name="date" placeholder="1990-03-23" required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }} />
        <label>出生時辰</label>
        <select name="hour" style={{ padding: '10px', borderRadius: '8px', background: '#1e293b', color: '#fff' }}>
          <option value="0">子時</option><option value="2">丑時</option><option value="4">寅時</option><option value="6">卯時</option>
          <option value="8">辰時</option><option value="10">巳時</option><option value="12">午時</option><option value="14">未時</option>
          <option value="16">申時</option><option value="18">酉時</option><option value="20">戌時</option><option value="22">亥時</option>
        </select>
        <label>性別</label>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <label><input type="radio" name="gender" value="男" defaultChecked /> 男</label>
          <label><input type="radio" name="gender" value="女" /> 女</label>
        </div>
        <button type="submit" disabled={loading} style={{ background: '#7c3aed', color: '#fff', padding: '12px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
          {loading ? "觀星中..." : "開始解碼命格"}
        </button>
      </form>
      {reading && (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', background: '#1e293b', borderRadius: '12px', border: '1px solid #7c3aed', whiteSpace: 'pre-wrap', textAlign: 'left' }}>
          {reading}
        </div>
      )}
    </div>
  );
}
