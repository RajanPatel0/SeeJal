import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' }
  ];

  return (
    <div className="relative group">
      <button className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-dark hover:bg-gray-100 rounded-md transition-colors">
        <span>{languages.find(lang => lang.code === i18n.language)?.flag}</span>
        <span className="hidden sm:inline">{languages.find(lang => lang.code === i18n.language)?.code.toUpperCase()}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      <div className="absolute right-0 mt-1 w-40 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="py-1">
          {languages.map((language) => (
            <button
              key={language.code}
              onClick={() => i18n.changeLanguage(language.code)}
              className={`flex items-center space-x-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-100 transition-colors ${
                i18n.language === language.code ? 'text-primary font-semibold' : 'text-dark'
              }`}
            >
              <span className="text-lg">{language.flag}</span>
              <span>{language.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;