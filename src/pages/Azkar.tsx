import React, { useState } from 'react';
import { 
  monajatList, 
  tasbehatList, 
  taqebatList, 
  weekDuas, 
  generalDuas, 
  HujajPrayers 
} from './data/azkarData';

export function Azkar() {
  const [activeTab, setActiveTab] = useState('monajat');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const tabs = [
    { id: 'monajat', name: ' من المناجاة' },
    { id: 'tasbehat', name: ' تسبيحات' },
    { id: 'taqebat', name: 'تعقيبات الصلاة' },
    { id: 'weekDuas', name: 'أدعية الايام' },
    { id: 'generalDuas', name: 'أدعية عامة' },
    { id: 'hujaj', name: 'الصلاة على الحجج الطاهرين ' }
  ];

  const getTabContent = () => {
    switch(activeTab) {
      case 'monajat': return monajatList;
      case 'tasbehat': return tasbehatList;
      case 'taqebat': return taqebatList;
      case 'weekDuas': return weekDuas;
      case 'generalDuas': return generalDuas;
      case 'hujaj': return HujajPrayers;
      default: return [];
    }
  };

  return (
    <div style={{ padding: '16px', backgroundColor: '#022e1f', minHeight: '100vh', color: '#fff', direction: 'rtl', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px', marginTop: '10px' }}>
        <h2 style={{ color: '#d4af37', fontSize: '24px', fontWeight: 'bold' }}>📖 الأذكار والأدعية المباركة</h2>
        <p style={{ color: '#a3c0b5', fontSize: '13px' }}>اختر التبويب المخصص لبدء القراءة والذكر</p>
      </div>

      <div style={{ display: 'flex', overflowX: 'auto', gap: '8px', paddingBottom: '12px', marginBottom: '16px', borderBottom: '1px solid #045c40', WebkitOverflowScrolling: 'touch' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedItem(null); }}
            style={{
              padding: '8px 16px',
              backgroundColor: activeTab === tab.id ? '#d4af37' : '#03422e',
              color: activeTab === tab.id ? '#022e1f' : '#fff',
              border: 'none',
              borderRadius: '20px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {!selectedItem ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {getTabContent().map((item) => (
            <div 
              key={item.id}
              onClick={() => setSelectedItem(item)}
              style={{ backgroundColor: '#03422e', padding: '16px', borderRadius: '10px', border: '1px solid #045c40', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{item.title}</span>
              <span style={{ color: '#d4af37', fontSize: '14px', fontWeight: 'bold' }}>قراءة 📖</span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: '#03422e', padding: '20px', borderRadius: '12px', border: '1px solid #d4af37', lineHeight: '2.1' }}>
          <button 
            onClick={() => setSelectedItem(null)}
            style={{ backgroundColor: '#022e1f', color: '#d4af37', border: '1px solid #d4af37', padding: '6px 14px', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}
          >
            ↩️ العودة إلى القائمة
          </button>
          <h3 style={{ color: '#d4af37', textAlign: 'center', fontSize: '20px', marginBottom: '20px', borderBottom: '1px solid #045c40', paddingBottom: '10px' }}>
            {selectedItem.title}
          </h3>
          <p style={{ fontSize: '19px', textAlign: 'justify', whiteSpace: 'pre-wrap', color: '#fff', padding: '6px' }}>
            {selectedItem.text}
          </p>
        </div>
      )}
    </div>
  );
}

export default Azkar;
