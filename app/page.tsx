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
      // 雙重驗證引入方式，確保在任何環境都能執行
      const lib: any = iztro;
      const func = lib.functionalAstrolabe || (lib.default && lib.default.functionalAstrolabe);
      
      if (!func) throw new Error("找不到排盤函數");

      const astrolabe = func(date, hour, gender, true);
      const palace = astrolabe.palaces.find((p: any) => p.name === "命宮");
      const stars = palace?.majorStars.map((s: any) => s.name).join('、') || "無主星";

      setReading(`【命宮主星】：${stars}\n\n大師偵測到妳的命格了！目前正在排除 AI 通訊障礙。`);
    } catch (err) { 
      console.error(err);
      setReading("排盤引擎啟動失敗，請稍後再試，或檢查日期格式是否正確。");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#09090b', color: '#e2e8f0', minHeight: '100vh', padding: '40px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#8b5cf6', fontSize: '2rem', textAlign: 'center', fontWeight: 'bold' }}>犀利大師 · 雲端道場</h1>
      <form onSubmit={startAnalysis} style={{ maxWidth: '400px', margin: '40px auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>出生日期 (YYYY-MM-DD)</label>
        <input type="text" name="date" placeholder="1990-03-23" required style={{ padding: '12px', borderRadius: '8px', border: '1px solid #334155', background: '#1e293b', color: '#fff' }} />
        <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>出生時辰</label>
        <select name="hour" style={{ padding: '12px', borderRadius: '8px', background: '#1e293b', color: '#fff', border: '1px solid #334155' }}>
          <option value="0">子時 (23:00-01:00)</option><option value="2">丑時 (01:00-03:00)</option><option value="4">寅時 (03:00-05:00)</option><option value="6">卯時 (05:00-07:00)</option>
          <option value="8">辰時 (07:00-09:00)</option><option value="10">巳時 (09:00-11:00)</option><option value="12">午時 (11:00-13:00)</option><option value="14">未時 (13:00-15:00)</option>
          <option value="16">申時 (15:00-17:00)</option><option value="18">酉時 (17:00-19:00)</option><option value="20">戌時 (19:00-21:00)</option><option value="22">亥時 (21:00-23:00)</option>
        </select>
        <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>性別</label>
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
          <label style={{
