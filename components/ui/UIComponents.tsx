import React, { useState, useEffect } from 'react';

// --- Logo ---
export const Logo = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div className={`flex items-center gap-2 transition-all duration-300 ${collapsed ? 'justify-center' : ''}`}>
    <div className="bg-white p-1.5 rounded-lg shadow-sm flex-shrink-0">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="6" fill="#004d7a"/>
        <path d="M8 24V16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M16 24V12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M24 24V8" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M8 16L16 12L24 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.5"/>
      </svg>
    </div>
    {!collapsed && (
      <div className="flex flex-col overflow-hidden whitespace-nowrap transition-opacity duration-300 opacity-100">
        <span className="font-bold text-xl tracking-tight text-white leading-none">SISGIN</span>
        <span className="text-[10px] text-blue-200 uppercase tracking-widest leading-none mt-0.5">Gestão de Indicadores</span>
      </div>
    )}
  </div>
);

// --- Icons ---
export const LayoutDashboardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="7" height="9" x="3" y="3" rx="1" />
    <rect width="7" height="5" x="14" y="3" rx="1" />
    <rect width="7" height="9" x="14" y="12" rx="1" />
    <rect width="7" height="5" x="3" y="16" rx="1" />
  </svg>
);

export const TargetIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

export const BarChartIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" x2="12" y1="20" y2="10" />
    <line x1="18" x2="18" y1="20" y2="4" />
    <line x1="6" x2="6" y1="20" y2="16" />
  </svg>
);

export const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const SettingsIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const MenuIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

export const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
  </svg>
);

export const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
  </svg>
);

export const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
  </svg>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'warning' | 'success';
  size?: 'sm' | 'md';
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', className = '', ...props }) => {
  const baseStyle = "rounded font-medium focus:outline-none transition-colors duration-200 flex items-center justify-center gap-2";
  const sizeStyle = size === 'sm' ? "px-2 py-1 text-xs" : "px-4 py-2 text-sm";
  
  const variants = {
    primary: "bg-corporate text-white hover:bg-corporate-light",
    secondary: "bg-gray-500 text-white hover:bg-gray-600",
    danger: "bg-red-600 text-white hover:bg-red-700",
    warning: "bg-amber-500 text-black hover:bg-amber-600",
    success: "bg-green-600 text-white hover:bg-green-700"
  };

  return (
    <button className={`${baseStyle} ${sizeStyle} ${variants[variant]} ${className} disabled:opacity-50 disabled:cursor-not-allowed`} {...props} />
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-bold mb-1 text-gray-700">{label}</label>}
    <input 
      className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-corporate focus:border-transparent outline-none transition-all ${error ? 'border-red-500' : 'border-gray-300'} ${className} disabled:bg-gray-100 disabled:text-gray-500`}
      {...props} 
    />
    {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
  </div>
);

// --- Password Input ---
export const PasswordInput: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-bold mb-1 text-gray-700">{label}</label>}
      <div className="relative">
        <input 
          type={show ? 'text' : 'password'}
          className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-corporate focus:border-transparent outline-none transition-all ${className}`}
          {...props} 
        />
        <button 
          type="button" 
          onClick={() => setShow(!show)} 
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-corporate"
          tabIndex={-1}
        >
          {show ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
    </div>
  );
}

// --- Checkbox ---
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}
export const Checkbox: React.FC<CheckboxProps> = ({ label, className = '', ...props }) => (
  <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
    <input type="checkbox" className="form-checkbox text-corporate rounded border-gray-300 focus:ring-corporate" {...props} />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

// --- Textarea ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}
export const Textarea: React.FC<TextareaProps> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-bold mb-1 text-gray-700">{label}</label>}
    <textarea 
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-corporate focus:border-transparent outline-none transition-all min-h-[80px] ${className} disabled:bg-gray-100 disabled:text-gray-500`}
      {...props} 
    />
  </div>
);

// --- Select ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string | number; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-bold mb-1 text-gray-700">{label}</label>}
    <select 
      className={`w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-corporate focus:border-transparent outline-none transition-all bg-white ${className} disabled:bg-gray-100 disabled:text-gray-500`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string, title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white shadow rounded-lg p-6 mb-6 border border-gray-100 ${className}`}>
    {title && <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{title}</h3>}
    {children}
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ status: 'draft' | 'final' | string }> = ({ status }) => {
  if (status === 'final' || status === 'Definitiva') {
    return <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-800">Definitivo</span>;
  }
  return <span className="px-2 py-1 rounded text-xs font-bold bg-yellow-100 text-yellow-800">Rascunho</span>;
};

// --- Message ---
export const Message: React.FC<{ type: 'info' | 'success' | 'error' | 'warning', children: React.ReactNode }> = ({ type, children }) => {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
  };
  return (
    <div className={`p-3 rounded border ${styles[type]} text-sm mb-4`}>
      {children}
    </div>
  );
};

// --- Toast ---
export const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bg = type === 'success' ? 'bg-green-600' : 'bg-red-600';

  return (
    <div className={`fixed bottom-4 right-4 ${bg} text-white px-6 py-3 rounded shadow-lg z-50 animate-in fade-in slide-in-from-bottom-5`}>
      {message}
    </div>
  );
};