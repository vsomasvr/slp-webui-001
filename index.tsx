/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useEffect, useState, useMemo, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// --- TYPE DEFINITIONS ---
interface Shloka {
    id: number;
    granthah: string;
    granthaVibhagah: string;
    slokah: string;
    padaCheda: string;
    anvaya: string;
    bhashyam: string;
}

interface Padam {
    id: number;
    padam: string;
    padaVargah: string;
    pratipadikam: string | null;
    lingam: string | null;
    vibhaktih: string | null;
    vachanam: string;
    dhatuh: string;
    lakarah: string;
    purushah: string;
    granthah: string;
    slokaSangkhyah: string;
}

type View = 'search' | 'detail';

// --- MOCK DATA ---
const mockShlokas: Shloka[] = [
    { id: 822711135198820, granthah: "श्रीमद्भगवद्गीता", granthaVibhagah: "अध्यायः १ - अर्जुनविषादयोगः", slokah: "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञजय ॥", padaCheda: "धर्मक्षेत्रे । कुरुक्षेत्रे । समवेताः । युयुत्सवः । मामकाः । पाण्डवाः । च । एव । किम् । अकुर्वत । सञजय ।", anvaya: "हे सञजय, धर्मक्षेत्रे कuruक्षेत्रे समवेताः युयुत्सवः मामकाः पाण्डवाः च एव किम् अकुर्वत?", bhashyam: "This is the first verse of the Bhagavad Gita, where Dhritarashtra asks Sanjaya about what happened when his sons and the Pandavas gathered on the battlefield of Kurukshetra." },
    { id: 822711135198821, granthah: "श्रीमद्वाल्मीकिरामायणम्", granthaVibhagah: "बालकाण्डम् - सर्गः १", slokah: "तपः स्वाध्यायनिरतं तपस्वी वाग्विदां वरम् ।\nनारदं परिपप्रच्छ वाल्मीकिर्मुनिपुङ्गवम् ॥", padaCheda: "तपः । स्वाध्याय-निरतम् । तपस्वि । वाक्-विदाम् । वरम् । नारदम् । परिपप्रच्छ । वाल्मीकिः । मुनिपुङ्गवम् ।", anvaya: "तपस्वी मुनिपुङ्गवम् वाल्मीकिः तपः स्वाध्यायनिरतं वाग्विदां वरं नारदं परिपप्रच्छ।", bhashyam: "This is the opening verse of the Ramayana, where Valmiki asks Narada about the qualities of the perfect man." },
    { id: 822711135198822, granthah: "श्रीमद्भगवद्गीता", granthaVibhagah: "अध्यायः २ - साङ्ख्ययोगः", slokah: "न जायते म्रियते वा कदाचि-\nन्नायं भूत्वा भविता वा न भूयः ।\nअजो नित्यः शाश्वतोऽयं पुराणो\nन हन्यते हन्यमाने शरीरे ॥", padaCheda: "न । जायते । म्रियते । वा । कदाचित् । न । अयम् । भूत्वा । भविता । वा । न । भूयः । अजः । नित्यः । शाश्वतः । अयम् । पुराणः । न । हन्यते । हन्यमाने । शरीरे ।", anvaya: "अयं कदाचित् न जायते वा न म्रियते। अयं भूत्वा भूयः न भविता। अयम् अजः, नित्यः, शाश्वतः, पुराणः। शरीरे हन्यमाने (सति) (अयम्) न हन्यते।", bhashyam: "The soul is never born nor does it die at any time. It does not come into being, nor does it cease to exist. It is unborn, eternal, ever-existing, and primeval. It is not slain when the body is slain." },
    { id: 822711135198823, granthah: "कठोपनिषत्", granthaVibhagah: "प्रथमा वल्ली", slokah: "उत्तिष्ठत जाग्रत\nप्राप्य वरान्निबोधत ।\nक्षुरस्य धारा निशिता दुरत्यया\nदुर्गं पथस्तत्कवयो वदन्ति ॥", padaCheda: "उत्तिष्ठत । जाग्रत । प्राप्य । वरान् । निबोधत । क्षुरस्य । धारा । निशिता । दुरत्यया । दुर्गम् । पथः । तत् । कवयः । वदन्ति ।", anvaya: "उत्तिष्ठत, जाग्रत, वरान् प्राप्य निबोधत। क्षुरस्य निशिता धारा इव दुरत्यया (इति) कवयः तत् पथः दुर्गं वदन्ति।", bhashyam: "Arise, awake, and learn by approaching the excellent ones. The wise ones say that path is difficult to tread, like the sharp edge of a razor." },
    { id: 822711135198824, granthah: "श्रीमद्वाल्मीकिरामायणम्", granthaVibhagah: "सुन्दरकाण्डम् - सर्गः ३५", slokah: "यद्यस्ति सदृशं तस्य मामेवं नेतुमर्हसि ।\nइत्येवमुक्तो हनुमान् सीतां वचनमब्रवीत् ॥", padaCheda: "यदि । अस्ति । सदृशम् । तस्य । माम् । एवम् । नेतुम् । अर्हसि । इति । एवम् । उक्तः । हनुमान् । सीताम् । वचनम् । अब्रवीत् ।", anvaya: "यदि तस्य सदृशम् अस्ति, (तर्हि) माम् नेतुम् अर्हसि। इति एवम् उक्तः हनुमान् सीताम् वचनम् अब्रवीत्।", bhashyam: "If there is anything comparable to that (your devotion), then you should take me there. Thus addressed, Hanuman spoke these words to Sita." },
    { id: 822711135198825, granthah: "ईशोपनिषत्", granthaVibhagah: "शान्तिपाठः", slokah: "ॐ पूर्णमदः पूर्णमिदं पूर्णात्पूर्णमुदच्यते ।\nपूर्णस्य पूर्णमादाय पूर्णमेवावशिष्यते ॥", padaCheda: "पूर्णम् । अदः । पूर्णम् । इदम् । पूर्णात् । पूर्णम् । उदच्यते । पूर्णस्य । पूर्णम् । आदाय । पूर्णम् । एव । अवशिष्यते ।", anvaya: "अदः पूर्णम्, इदं पूर्णम्, पूर्णात् पूर्णम् उदच्यते। पूर्णस्य पूर्णम् आदाय पूर्णम् एव अवशिष्यते।", bhashyam: "That is whole, this is whole. From the whole, the whole is manifested. When the whole is taken from the whole, the whole remains." }
];

const mockPadams: Padam[] = [
    { id: 229486946340774, padam: "युयुत्सवः", padaVargah: "सुबन्तम्", pratipadikam: "युयुत्सु", lingam: "पुल्लिङ्गम्", vibhaktih: "प्रथमा", vachanam: "बहुवचनम्", dhatuh: "", lakarah: "", purushah: "", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "१.१" },
    { id: 364160482137763, padam: "सञजय", padaVargah: "सुबन्तम्", pratipadikam: "सञजय", lingam: "पुल्लिङ्गम्", vibhaktih: "सम्बोधन", vachanam: "एकवचनम्", dhatuh: "", lakarah: "", purushah: "", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "१.१" },
    { id: 623387752321635, padam: "अकुर्वत", padaVargah: "तिङ्गन्तम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "बहुवचनम्", dhatuh: "कृ", lakarah: "लङ्", purushah: "प्रथम पुरुषः", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "१.१" },
    { id: 100000000000001, padam: "जायते", padaVargah: "तिङ्गन्तम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "एकवचनम्", dhatuh: "जन्", lakarah: "लट्", purushah: "प्रथम पुरुषः", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "२.२०" },
    { id: 100000000000002, padam: "हन्यते", padaVargah: "तिङ्गन्तम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "एकवचनम्", dhatuh: "हन्", lakarah: "लट्", purushah: "प्रथम पुरुषः", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "२.२०" },
    { id: 100000000000003, padam: "नित्यः", padaVargah: "सुबन्तम्", pratipadikam: "नित्य", lingam: "पुल्लिङ्गम्", vibhaktih: "प्रथमा", vachanam: "एकवचनम्", dhatuh: "", lakarah: "", purushah: "", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "२.२०" },
    { id: 100000000000004, padam: "उत्तिष्ठत", padaVargah: "तिङ्गन्तम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "बहुवचनम्", dhatuh: "स्था", lakarah: "लोट्", purushah: "मध्यम पुरुषः", granthah: "कठोपनिषत्", slokaSangkhyah: "१.३.१४" },
    { id: 100000000000005, padam: "जाग्रत", padaVargah: "तिङ्गन्तम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "बहुवचनम्", dhatuh: "जागृ", lakarah: "लोट्", purushah: "मध्यम पुरुषः", granthah: "कठोपनिषत्", slokaSangkhyah: "१.३.१४" },
    { id: 100000000000006, padam: "वदन्ति", padaVargah: "तिङ्गन्तम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "बहुवचनम्", dhatuh: "वद्", lakarah: "लट्", purushah: "प्रथम पुरुषः", granthah: "कठोपनिषत्", slokaSangkhyah: "१.३.१4" },
    { id: 100000000000007, padam: "हनुमान्", padaVargah: "सुबन्तम्", pratipadikam: "हनुमत्", lingam: "पुल्लिङ्गम्", vibhaktih: "प्रथमा", vachanam: "एकवचनम्", dhatuh: "", lakarah: "", purushah: "", granthah: "श्रीमद्वाल्मीकिरामायणम्", slokaSangkhyah: "५.३५.८१" },
    { id: 100000000000008, padam: "अब्रवीत्", padaVargah: "तिङ्गन्तम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "एकवचनम्", dhatuh: "ब्रू", lakarah: "लङ्", purushah: "प्रथम पुरुषः", granthah: "श्रीमद्वाल्मीकिरामायणम्", slokaSangkhyah: "५.३५.८१" },
    { id: 100000000000009, padam: "च", padaVargah: "अव्ययम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "", dhatuh: "", lakarah: "", purushah: "", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "१.१" },
    { id: 100000000000010, padam: "एव", padaVargah: "अव्ययम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "", dhatuh: "", lakarah: "", purushah: "", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "१.१" },
    { id: 100000000000011, padam: "न", padaVargah: "अव्ययम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "", dhatuh: "", lakarah: "", purushah: "", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "२.२०" },
    { id: 100000000000012, padam: "वा", padaVargah: "अव्ययम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "", dhatuh: "", lakarah: "", purushah: "", granthah: "श्रीमद्भगवद्गीता", slokaSangkhyah: "२.२०" },
    { id: 100000000000013, padam: "यदि", padaVargah: "अव्ययम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "", dhatuh: "", lakarah: "", purushah: "", granthah: "श्रीमद्वाल्मीकिरामायणम्", slokaSangkhyah: "५.३५.८१" },
    { id: 100000000000014, padam: "पूर्णम्", padaVargah: "सुबन्तम्", pratipadikam: "पूर्ण", lingam: "नपुंसकलिङ्गम्", vibhaktih: "प्रथमा", vachanam: "एकवचनम्", dhatuh: "", lakarah: "", purushah: "", granthah: "ईशोपनिषत्", slokaSangkhyah: "शान्तिपाठः" },
    { id: 100000000000015, padam: "अवशिष्यते", padaVargah: "तिङ्गन्तम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "एकवचनम्", dhatuh: "शिष्", lakarah: "लट्", purushah: "प्रथम पुरुषः", granthah: "ईशोपनिषत्", slokaSangkhyah: "शान्तिपाठः" },
    { id: 100000000000016, padam: "एव", padaVargah: "अव्ययम्", pratipadikam: null, lingam: null, vibhaktih: null, vachanam: "", dhatuh: "", lakarah: "", purushah: "", granthah: "ईशोपनिषत्", slokaSangkhyah: "शान्तिपाठः" },
];

// --- MOCK API SERVICE ---
const searchAPI = (type: 'shloka' | 'padam', query: string, filters: Record<string, string[]>) => {
  return new Promise<(Shloka | Padam)[]>(resolve => {
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      if (type === 'shloka') {
        const data = mockShlokas.filter(item => {
          const matchesQuery = !query || Object.values(item).some(val => String(val).toLowerCase().includes(lowerQuery));
          const matchesFilters = !filters.granthah?.length || filters.granthah.includes(item.granthah);
          return matchesQuery && matchesFilters;
        });
        resolve(data);
      } else {
        const data = mockPadams.filter(item => {
          const matchesQuery = !query || Object.values(item).some(val => String(val).toLowerCase().includes(lowerQuery));
          const matchesFilters = (!filters.granthah?.length || filters.granthah.includes(item.granthah)) &&
                               (!filters.padaVargah?.length || filters.padaVargah.includes(item.padaVargah));
          return matchesQuery && matchesFilters;
        });
        resolve(data);
      }
    }, 500 + Math.random() * 500);
  });
};

// --- CUSTOM HOOKS ---
const useSpeechSynthesis = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const synth = useRef(window.speechSynthesis);

    const populateVoiceList = () => {
        const availableVoices = synth.current.getVoices();
        // Prefer Hindi voices for better Devanagari pronunciation, fallback to any available voice.
        const hindiVoices = availableVoices.filter(voice => voice.lang.startsWith('hi'));
        setVoices(hindiVoices.length > 0 ? hindiVoices : availableVoices);
    };

    useEffect(() => {
        populateVoiceList();
        if (synth.current.onvoiceschanged !== undefined) {
            synth.current.onvoiceschanged = populateVoiceList;
        }
    }, []);

    const speak = (text: string, onEnd: () => void) => {
        if (synth.current.speaking) {
            synth.current.cancel();
        }
        if (text !== '') {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.voice = voices[0] || null;
            utterance.pitch = 1;
            utterance.rate = 0.8;
            utterance.onend = onEnd;
            utterance.onerror = () => {
                console.error("Speech synthesis error");
                onEnd();
            };
            synth.current.speak(utterance);
        }
    };
    
    const stop = () => {
        synth.current.cancel();
    };

    return { speak, stop, isSupported: !!synth.current };
};


// --- HELPER COMPONENTS ---
const SkeletonLoader = () => (
    <div className="card-grid">
        {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card skeleton-card">
                <div className="skeleton-line" style={{ width: '60%', height: '24px' }}></div>
                <div className="skeleton-line" style={{ width: '90%' }}></div>
                <div className="skeleton-line" style={{ width: '80%' }}></div>
            </div>
        ))}
    </div>
);

const PadamCard = ({ item, onGoToDetail, onPlay, isPlaying, isSpeechSupported }: { item: Padam, onGoToDetail: (item: Padam) => void, onPlay: (item: Padam) => void, isPlaying: boolean, isSpeechSupported: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="card padam-card">
            <div className="card-header">
                <div className="card-header-main">
                    <h3 className="sanskrit-text">{item.padam}</h3>
                </div>
                {isSpeechSupported && (
                    <button className="play-btn" onClick={() => onPlay(item)} title={isPlaying ? 'Stop' : 'Play'}>
                        {isPlaying ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"></path></svg> : 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                        }
                    </button>
                )}
                <span className="chip sanskrit-text">{item.padaVargah}</span>
            </div>
            <div className="card-body">
                <div className="info-grid">
                    <div><span className="label">Granthah</span><span className="value sanskrit-text">{item.granthah}</span></div>
                    <div><span className="label">Sloka</span><span className="value sanskrit-text">{item.slokaSangkhyah}</span></div>
                </div>
                <div className={`expandable-content-wrapper ${isExpanded ? 'expanded' : ''}`}>
                    <div className="expandable-content">
                        <div className="detail-section">
                            <div className="info-grid single-column">
                                {item.pratipadikam && <div><span className="label">Pratipadikam</span><span className="value sanskrit-text">{item.pratipadikam}</span></div>}
                                {item.lingam && <div><span className="label">Lingam</span><span className="value sanskrit-text">{item.lingam}</span></div>}
                                {item.vibhaktih && <div><span className="label">Vibhaktih</span><span className="value sanskrit-text">{item.vibhaktih}</span></div>}
                                {item.vachanam && <div><span className="label">Vachanam</span><span className="value sanskrit-text">{item.vachanam}</span></div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                <button className="btn-icon" onClick={() => onGoToDetail(item)} title="Full View">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                </button>
                <button className="btn-icon" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? 'Hide Details' : 'Show Details'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </div>
        </div>
    );
};

const ShlokaCard = ({ item, onPlay, isPlaying, isSpeechSupported }: { item: Shloka, onPlay: (item: Shloka) => void, isPlaying: boolean, isSpeechSupported: boolean }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="card shloka-card">
            <div className="card-header">
                 <div className="card-header-main">
                    <h3 className="sanskrit-text">{item.granthah}</h3>
                </div>
                {isSpeechSupported && (
                     <button className="play-btn" onClick={() => onPlay(item)} title={isPlaying ? 'Stop' : 'Play'}>
                        {isPlaying ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"></path></svg> : 
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
                        }
                    </button>
                )}
                <span className="chip sanskrit-text">{item.granthaVibhagah}</span>
            </div>
            <div className="card-body">
                <p className="shloka-text sanskrit-text">{item.slokah}</p>
                <div className={`expandable-content-wrapper ${isExpanded ? 'expanded' : ''}`}>
                    <div className="expandable-content">
                        <div className="detail-section">
                            <h4>Pada Cheda</h4>
                            <p className="sanskrit-text">{item.padaCheda}</p>
                        </div>
                         <div className="detail-section">
                            <h4>Anvaya</h4>
                            <p className="sanskrit-text">{item.anvaya}</p>
                        </div>
                        <div className="detail-section">
                            <h4>Bhashyam</h4>
                            <p>{item.bhashyam}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="card-footer">
                 <button className="btn-icon" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? 'Hide Details' : 'Show Details'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                </button>
            </div>
        </div>
    );
};

const ToggleSwitch = ({ value, onChange }: { value: 'shloka' | 'padam', onChange: (newVal: 'shloka' | 'padam') => void }) => (
    <div className="toggle-switch-container">
        <div className={`toggle-switch ${value}`}>
            <div className="toggle-switch-handle"></div>
            <button onClick={() => onChange('shloka')}>Shlokas</button>
            <button onClick={() => onChange('padam')}>Padams</button>
        </div>
    </div>
);

const MultiSelectDropdown = ({ options, selectedOptions, onToggle, label }: { options: string[], selectedOptions: string[], onToggle: (option: string) => void, label: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [ref]);

    return (
        <div className={`multi-select-dropdown ${isOpen ? 'open' : ''} ${selectedOptions.length > 0 ? 'has-selection' : ''}`} ref={ref}>
            <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
                <span>{label} {selectedOptions.length > 0 ? `(${selectedOptions.length})` : ''}</span>
                 <svg className={`chevron-icon ${isOpen ? 'expanded' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </button>
            {isOpen && (
                <div className="dropdown-panel">
                    {options.map(option => (
                        <label key={option} className="dropdown-item">
                            <input
                                type="checkbox"
                                checked={selectedOptions.includes(option)}
                                onChange={() => onToggle(option)}
                            />
                            <span className="sanskrit-text">{option}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};


const FilterBar = ({ availableFilters, activeFilters, onFilterChange, searchType }: any) => {
    return (
        <div className="filter-bar">
            {Object.entries(availableFilters[searchType]).map(([key, values]) => (
                 <MultiSelectDropdown
                    key={key}
                    label={`Select ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                    options={values as string[]}
                    selectedOptions={activeFilters[key] || []}
                    onToggle={(option) => onFilterChange(key, option)}
                 />
            ))}
        </div>
    );
};

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }: { filters: Record<string, string[]>, onRemoveFilter: (type: string, value: string) => void, onClearAll: () => void }) => {
    const active = Object.entries(filters).flatMap(([type, values]) => values.map(value => ({ type, value })));
    if (active.length === 0) return null;

    return (
        <div className="active-filters-container">
            {active.map(({ type, value }) => (
                <div key={`${type}-${value}`} className="filter-pill">
                    <span className="sanskrit-text">{value}</span>
                    <button onClick={() => onRemoveFilter(type, value)}>×</button>
                </div>
            ))}
            <button onClick={onClearAll} className="btn-clear-all">Clear All</button>
        </div>
    );
};

const Breadcrumb = ({ view, selectedItem, onNavigateHome }: { view: View, selectedItem: Padam | null, onNavigateHome: () => void }) => {
    if (view === 'search') return null;
    return (
        <nav className="breadcrumb">
            <a href="#" onClick={(e) => { e.preventDefault(); onNavigateHome(); }}>Search</a>
            <span>/</span>
            <span className="sanskrit-text">{selectedItem?.padam}</span>
        </nav>
    );
};

const PadamDetailView = ({ item }: { item: Padam }) => {
    const detailItems = {
        'Padam': item.padam,
        'Pada Vargah': item.padaVargah,
        'Pratipadikam': item.pratipadikam,
        'Lingam': item.lingam,
        'Vibhaktih': item.vibhaktih,
        'Vachanam': item.vachanam,
        'Dhatuh': item.dhatuh,
        'Lakarah': item.lakarah,
        'Purushah': item.purushah,
        'Granthah': item.granthah,
        'Sloka Ref': item.slokaSangkhyah,
    };
    return (
        <div className="padam-detail-view">
            <h2 className="sanskrit-text">{item.padam}</h2>
            <div className="detail-grid">
                {Object.entries(detailItems).map(([key, value]) => (
                    value && <div className="detail-item" key={key}>
                        <span className="detail-item-key">{key}</span>
                        <span className="detail-item-value sanskrit-text">{value}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// --- MAIN APP COMPONENT ---
function App() {
  const [theme, setTheme] = useState('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'shloka' | 'padam'>('shloka');
  const [results, setResults] = useState<(Shloka | Padam)[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string[]>>({});
  const [view, setView] = useState<View>('search');
  const [selectedItem, setSelectedItem] = useState<Padam | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<number | null>(null);
  
  const { speak, stop, isSupported } = useSpeechSynthesis();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light');
  
  const availableFilters = useMemo(() => ({
    shloka: {
      granthah: [...new Set(mockShlokas.map(s => s.granthah))]
    },
    padam: {
      granthah: [...new Set(mockPadams.map(p => p.granthah))],
      padaVargah: [...new Set(mockPadams.map(p => p.padaVargah))]
    }
  }), []);

  useEffect(() => {
    if (view === 'search') {
        const performSearch = async () => {
          setLoading(true);
          const data = await searchAPI(searchType, searchQuery, filters);
          setResults(data);
          setLoading(false);
        };

        const debounce = setTimeout(() => {
            performSearch();
        }, 300);

        return () => clearTimeout(debounce);
    }
  }, [searchQuery, searchType, filters, view]);
  
  const handlePlay = (item: Shloka | Padam) => {
    if (currentlyPlaying === item.id) {
        stop();
        setCurrentlyPlaying(null);
    } else {
        const textToSpeak = 'slokah' in item ? item.slokah.replace(/\n/g, ' ') : item.padam;
        speak(textToSpeak, () => setCurrentlyPlaying(null));
        setCurrentlyPlaying(item.id);
    }
  };

  const handleFilterChange = (type: string, value: string) => {
    setFilters(prev => {
        const existing = prev[type] || [];
        const newFilters = existing.includes(value)
            ? existing.filter(v => v !== value)
            : [...existing, value];
        return {
            ...prev,
            [type]: newFilters
        };
    });
  };

  const handleClearFilters = () => {
    setFilters({});
  };
  
  const handleSearchTypeChange = (type: 'shloka' | 'padam') => {
      setSearchType(type);
      setFilters({});
      setSearchQuery('');
  };

  const handleSelectPadam = (item: Padam) => {
      setSelectedItem(item);
      setView('detail');
  };

  const handleNavigateHome = () => {
      setSelectedItem(null);
      setView('search');
  };

  return (
      <div className="container">
        <header className="app-header">
            <h1 className="sanskrit-text">वेदान्वेषकः</h1>
            <p>An explorer for ancient Sanskrit texts</p>
             <div className="controls">
                 <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
                    <div className="toggle-track">
                        <div className="toggle-thumb">
                           {theme === 'dark' ? '🌙' : '☀️'}
                        </div>
                    </div>
                </button>
             </div>
        </header>

        <main>
            <Breadcrumb view={view} selectedItem={selectedItem} onNavigateHome={handleNavigateHome} />
            
            {view === 'search' ? (
                 <>
                    <div className="search-controls">
                         <div className="search-bar">
                            <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={`Search for a ${searchType}...`}
                            />
                        </div>
                        <ToggleSwitch value={searchType} onChange={handleSearchTypeChange} />
                    </div>
                    
                    <FilterBar
                        availableFilters={availableFilters}
                        activeFilters={filters}
                        onFilterChange={handleFilterChange}
                        searchType={searchType}
                    />

                    <ActiveFilters filters={filters} onRemoveFilter={handleFilterChange} onClearAll={handleClearFilters} />
                
                    {loading ? <SkeletonLoader /> : (
                        <div className="card-grid">
                            {results.length > 0 ? results.map(item =>
                                'slokah' in item
                                    ? <ShlokaCard key={item.id} item={item} onPlay={handlePlay} isPlaying={currentlyPlaying === item.id} isSpeechSupported={isSupported} />
                                    : <PadamCard key={item.id} item={item as Padam} onGoToDetail={handleSelectPadam} onPlay={handlePlay} isPlaying={currentlyPlaying === item.id} isSpeechSupported={isSupported} />
                            ) : <p className="no-results">No results found.</p>}
                        </div>
                    )}
                 </>
            ) : (
                selectedItem && <PadamDetailView item={selectedItem} />
            )}
        </main>
      </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);