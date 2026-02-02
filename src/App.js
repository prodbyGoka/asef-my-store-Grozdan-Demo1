import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Trash2, Zap, LogOut, X, ShoppingBag, MessageSquare, Send, Wallet, Clock, ArrowUpRight, ArrowDownLeft, Star } from 'lucide-react';

// 1. Logic Wrapper to fix Router Context Error
function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('vantage_users')) || [
    { username: 'admin', password: 'Pc123', name: 'Master Admin', bio: 'System Overlord', role: 'admin', balance: 50000 }
  ]);
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem('vantage_v24')) || [
    { id: 1, name: "Neural Interface", price: 2400, img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=500", seller: "admin", status: "approved" }
  ]);
  const [messages, setMessages] = useState(() => JSON.parse(localStorage.getItem('vantage_messages')) || []);
  const [transactions, setTransactions] = useState(() => JSON.parse(localStorage.getItem('vantage_tx')) || []);
  const [reviews, setReviews] = useState(() => JSON.parse(localStorage.getItem('vantage_reviews')) || []);
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('vantage_session')) || null);
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Sync Data
  useEffect(() => {
    localStorage.setItem('vantage_users', JSON.stringify(users));
    localStorage.setItem('vantage_v24', JSON.stringify(products));
    localStorage.setItem('vantage_messages', JSON.stringify(messages));
    localStorage.setItem('vantage_tx', JSON.stringify(transactions));
    localStorage.setItem('vantage_reviews', JSON.stringify(reviews));
  }, [users, products, messages, transactions, reviews]);

  // Handle Private Cart for specific user
  useEffect(() => {
    if (currentUser?.username) {
      const savedCart = JSON.parse(localStorage.getItem(`vantage_cart_${currentUser.username}`)) || [];
      setCart(savedCart);
    } else {
      setCart([]);
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?.username) {
      localStorage.setItem(`vantage_cart_${currentUser.username}`, JSON.stringify(cart));
    }
  }, [cart, currentUser]);

  const addTransaction = (type, user, amount, item, seller) => {
    const newTx = { id: Date.now(), type, user, amount, item, seller, date: new Date().toLocaleString() };
    setTransactions(prev => [newTx, ...prev]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('vantage_session');
    navigate('/auth');
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;500;800&display=swap');
        :root { --accent: #6366f1; --bg: #020617; --card-bg: rgba(15, 23, 42, 0.7); --border: rgba(255,255,255,0.08); }
        body { background: var(--bg); background-image: radial-gradient(circle at 50% -20%, #1e1b4b 0%, var(--bg) 80%); color: #f8fafc; font-family: 'Plus Jakarta Sans', sans-serif; margin: 0; min-height: 100vh; }
        .cyber-card { background: var(--card-bg); backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: 24px; transition: 0.3s; overflow: hidden; }
        .cyber-card:hover { border-color: var(--accent); transform: translateY(-4px); }
        .btn-glow { background: linear-gradient(135deg, var(--accent), #818cf8); color: white; border: none; padding: 12px 24px; border-radius: 14px; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; }
        .drawer { position: fixed; right: 0; top: 0; height: 100%; width: 320px; background: #0b0f1a; border-left: 1px solid var(--border); z-index: 1000; padding: 30px; transform: translateX(${isCartOpen ? '0' : '100%'}); transition: 0.4s ease; }
        input, textarea { background: rgba(0,0,0,0.2); border: 1px solid var(--border); color: white; padding: 14px; border-radius: 12px; width: 100%; box-sizing: border-box; margin-bottom: 15px; font-family: inherit; }
      `}</style>

      {/* Cart Drawer */}
      <div className="drawer">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '30px'}}>
          <h2 style={{margin:0}}>Bag</h2>
          <X onClick={()=>setIsCartOpen(false)} style={{cursor:'pointer'}}/>
        </div>
        {cart.map((item, i) => (
          <div key={i} style={{padding:'10px 0', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between'}}>
            <span>{item.name}</span>
            <div style={{display:'flex', gap:10}}>
              <b>${item.price}</b>
              <Trash2 size={14} color="#ef4444" onClick={()=>setCart(cart.filter((_, idx)=>idx!==i))} style={{cursor:'pointer'}}/>
            </div>
          </div>
        ))}
        {cart.length > 0 && <Link to="/checkout" className="btn-glow" style={{marginTop:20}} onClick={()=>setIsCartOpen(false)}>Checkout</Link>}
      </div>

      <nav style={{padding: '15px 6%', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(2, 6, 23, 0.8)', backdropFilter:'blur(10px)', borderBottom:'1px solid var(--border)', position:'sticky', top:0, zIndex:100}}>
        <Link to="/" style={{textDecoration:'none', color:'white', display:'flex', alignItems:'center', gap:10}}>
          <Zap fill="var(--accent)" color="var(--accent)"/> <span style={{fontSize:'1.3rem', fontWeight:900}}>VANTAGE</span>
        </Link>
        
        <div style={{display:'flex', alignItems:'center', gap:20}}>
          {currentUser ? (
            <>
              <div style={{color:'#10b981', fontWeight:800}}>${users.find(u => u.username === currentUser.username)?.balance || 0}</div>
              <Link to="/inbox" style={{color:'#94a3b8'}}><MessageSquare size={20}/></Link>
              <Link to="/profile" style={{color:'white', textDecoration:'none', fontWeight:700}}>{currentUser.name}</Link>
              <LogOut size={18} style={{cursor:'pointer', color:'#f43f5e'}} onClick={handleLogout}/>
            </>
          ) : <Link to="/auth" className="btn-glow">Sign In</Link>}
          <ShoppingCart size={20} onClick={()=>setIsCartOpen(true)} style={{cursor:'pointer'}}/>
        </div>
      </nav>

      <main style={{padding: '40px 6%'}}>
        <Routes>
          <Route path="/" element={<StoreView products={products.filter(p=>p.status==='approved')} onBuy={(p)=>setCart([...cart, p])}/>} />
          <Route path="/auth" element={<AuthView users={users} setUsers={setUsers} onAuth={setCurrentUser}/>} />
          <Route path="/profile" element={currentUser ? <ProfileView user={users.find(u=>u.username===currentUser.username)} transactions={transactions} reviews={reviews} setUsers={setUsers} addTx={addTransaction}/> : <Navigate to="/auth"/>} />
          <Route path="/inbox" element={currentUser ? <InboxView user={currentUser} messages={messages} setMessages={setMessages}/> : <Navigate to="/auth"/>} />
          <Route path="/checkout" element={currentUser ? <CheckoutView cart={cart} setCart={setCart} user={users.find(u=>u.username===currentUser.username)} setUsers={setUsers} addTx={addTransaction}/> : <Navigate to="/auth"/>} />
        </Routes>
      </main>
    </>
  );
}

// 2. Main Entry Point
export default function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

// --- View Components ---

const StoreView = ({ products, onBuy }) => {
  const navigate = useNavigate();
  return (
    <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:25}}>
      {products.map(p => (
        <div key={p.id} className="cyber-card">
          <img src={p.img} style={{width:'100%', height:180, objectFit:'cover'}} />
          <div style={{padding:20}}>
            <h3 style={{margin:'0 0 10px'}}>{p.name}</h3>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <b style={{color:'var(--accent)'}}>${p.price}</b>
              <div style={{display:'flex', gap:8}}>
                <button className="btn-glow" onClick={()=>onBuy(p)} style={{padding:'8px 15px'}}>Buy</button>
                <button onClick={()=>navigate('/inbox', {state: {to: p.seller}})} style={{background:'rgba(255,255,255,0.05)', color:'white', border:'1px solid var(--border)', padding:8, borderRadius:10}}><MessageSquare size={16}/></button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const ProfileView = ({ user, transactions, reviews, setUsers, addTx }) => {
  if (!user) return null;
  const myTx = transactions.filter(t => t.user === user.username);
  return (
    <div style={{maxWidth:700, margin:'0 auto'}}>
      <div className="cyber-card" style={{padding:30, textAlign:'center', marginBottom:20}}>
        <h2>{user.name}</h2>
        <p>@{user.username}</p>
        <button className="btn-glow" style={{margin:'15px auto'}} onClick={()=>{
          const amt = prompt("Amount:");
          if(amt) {
            setUsers(prev => prev.map(u => u.username === user.username ? {...u, balance: u.balance + Number(amt)} : u));
            addTx('CREDIT', user.username, Number(amt), 'Deposit', 'System');
          }
        }}>Add Credits</button>
      </div>
      <div className="cyber-card" style={{padding:20}}>
        <h3>Activity</h3>
        {myTx.map(t => (
          <div key={t.id} style={{display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid var(--border)'}}>
            <span>{t.item}</span>
            <b style={{color: t.type==='DEBIT'?'#ef4444':'#10b981'}}>${t.amount}</b>
          </div>
        ))}
      </div>
    </div>
  );
};

const InboxView = ({ user, messages, setMessages }) => {
  const location = useLocation();
  const [activeChat, setActiveChat] = useState(location.state?.to || '');
  const [msgInput, setMsgInput] = useState('');

  const partners = Array.from(new Set(messages.filter(m => m.to === user.username || m.from === user.username).map(m => m.to === user.username ? m.from : m.to)));

  return (
    <div className="cyber-card" style={{display:'grid', gridTemplateColumns:'200px 1fr', height:'60vh'}}>
      <div style={{padding:15, borderRight:'1px solid var(--border)'}}>
        {partners.map(p => <div key={p} onClick={()=>setActiveChat(p)} style={{padding:10, cursor:'pointer', background:activeChat===p?'var(--accent)':'transparent', borderRadius:8}}>{p}</div>)}
      </div>
      <div style={{display:'flex', flexDirection:'column', padding:15}}>
        <div style={{flex:1, overflowY:'auto'}}>
          {messages.filter(m => (m.from === user.username && m.to === activeChat) || (m.to === user.username && m.from === activeChat)).map(m => (
            <div key={m.id} style={{textAlign: m.from === user.username ? 'right' : 'left', marginBottom:10}}>
              <span style={{background: m.from === user.username ? 'var(--accent)' : '#1e293b', padding:'8px 12px', borderRadius:12}}>{m.text}</span>
            </div>
          ))}
        </div>
        <div style={{display:'flex', gap:10}}>
          <input value={msgInput} onChange={e=>setMsgInput(e.target.value)} placeholder="Type..." style={{marginBottom:0}}/>
          <button className="btn-glow" onClick={()=>{
            setMessages([...messages, {id: Date.now(), from: user.username, to: activeChat, text: msgInput}]);
            setMsgInput('');
          }}><Send size={16}/></button>
        </div>
      </div>
    </div>
  );
};

const CheckoutView = ({ cart, setCart, user, setUsers, addTx }) => {
  const total = cart.reduce((a,b)=>a+Number(b.price), 0);
  const navigate = useNavigate();
  const handlePay = () => {
    if (user.balance < total) return alert("No funds");
    setUsers(prev => prev.map(u => u.username === user.username ? {...u, balance: u.balance - total} : u));
    cart.forEach(i => addTx('DEBIT', user.username, i.price, i.name, i.seller));
    setCart([]);
    navigate('/profile');
  };
  return (
    <div className="cyber-card" style={{maxWidth:400, margin:'0 auto', padding:30}}>
      <h2>Total: ${total}</h2>
      <button className="btn-glow" style={{width:'100%'}} onClick={handlePay}>Pay Now</button>
    </div>
  );
};

const AuthView = ({ users, setUsers, onAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '', name: '' });
  const navigate = useNavigate();
  const handleAuth = () => {
    if (isLogin) {
      const u = users.find(x => x.username === form.username && x.password === form.password);
      if (u) { onAuth(u); localStorage.setItem('vantage_session', JSON.stringify(u)); navigate('/'); }
    } else {
      setUsers([...users, { ...form, balance: 0 }]);
      setIsLogin(true);
    }
  };
  return (
    <div className="cyber-card" style={{maxWidth:350, margin:'60px auto', padding:30}}>
      <h2>{isLogin ? 'Login' : 'Join'}</h2>
      {!isLogin && <input placeholder="Name" onChange={e=>setForm({...form, name:e.target.value})}/>}
      <input placeholder="User" onChange={e=>setForm({...form, username:e.target.value})}/>
      <input type="password" placeholder="Pass" onChange={e=>setForm({...form, password:e.target.value})}/>
      <button className="btn-glow" style={{width:'100%'}} onClick={handleAuth}>Go</button>
      <p onClick={()=>setIsLogin(!isLogin)} style={{cursor:'pointer', textAlign:'center', marginTop:15}}>{isLogin ? 'Switch to Join' : 'Switch to Login'}</p>
    </div>
  );
};