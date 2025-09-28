import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "welcome": "Welcome to SeeJal",
      "dashboard": "Dashboard",
      "analytics": "Analytics",
      "reports": "Reports",
      "login": "Login",
      "register": "Register",
      "real_time_monitoring": "Real-Time Groundwater Monitoring",
      "monitoring_stations": "Monitoring 5,260 DWLR stations across India",
      "explore_dashboard": "Explore Dashboard",
      "total_stations": "Total Stations",
      "critical_stations": "Critical Stations",
      "normal_stations": "Normal Stations",
      "avg_water_trend": "Avg. Water Trend",
      "current_level": "Current Water Level",
      "water_trend": "Water Trend",
      "recharge_events": "Recharge Events",
      "forecast": "15-Day Forecast",
      "available_water": "Available Water",
      "resource_calculation": "Resource Calculation",
      "generate_report": "Generate Report",
      "download_data": "Download Data",
      "set_alert": "Set Alert",
      "station_details": "Station Details",
      "location": "Location",
      "aquifer_type": "Aquifer Type",
      "status": "Status",
      "safe": "Safe",
      "critical": "Critical",
      "semi_critical": "Semi-Critical",
      "last_updated": "Last Updated"
    }
  },
  hi: {
    translation: {
      "welcome": "सीजल में आपका स्वागत है",
      "dashboard": "डैशबोर्ड",
      "analytics": "विश्लेषण",
      "reports": "रिपोर्ट्स",
      "login": "लॉगिन",
      "register": "रजिस्टर",
      "real_time_monitoring": "रीयल-टाइम भूजल मॉनिटरिंग",
      "monitoring_stations": "भारत भर के 5,260 डीडब्ल्यूएलआर स्टेशनों की निगरानी",
      "explore_dashboard": "डैशबोर्ड एक्सप्लोर करें",
      "total_stations": "कुल स्टेशन",
      "critical_stations": "क्रिटिकल स्टेशन",
      "normal_stations": "सामान्य स्टेशन",
      "avg_water_trend": "औसत जल प्रवृत्ति",
      "current_level": "वर्तमान जल स्तर",
      "water_trend": "जल प्रवृत्ति",
      "recharge_events": "रिचार्ज इवेंट्स",
      "forecast": "15-दिन पूर्वानुमान",
      "available_water": "उपलब्ध जल",
      "resource_calculation": "संसाधन गणना",
      "generate_report": "रिपोर्ट जनरेट करें",
      "download_data": "डेटा डाउनलोड करें",
      "set_alert": "अलर्ट सेट करें",
      "station_details": "स्टेशन विवरण",
      "location": "स्थान",
      "aquifer_type": "एक्विफर प्रकार",
      "status": "स्थिति",
      "safe": "सुरक्षित",
      "critical": "गंभीर",
      "semi_critical": "अर्ध-गंभीर",
      "last_updated": "अंतिम अपडेट"
    }
  },
  pa: {
    translation: {
      "welcome": "ਸੀਜਲ ਵਿੱਚ ਜੀ ਆਇਆਂ ਨੂੰ",
      "dashboard": "ਡੈਸ਼ਬੋਰਡ",
      "analytics": "ਵਿਸ਼ਲੇਸ਼ਣ",
      "reports": "ਰਿਪੋਰਟਾਂ",
      "login": "ਲਾਗਿਨ",
      "register": "ਰਜਿਸਟਰ",
      "real_time_monitoring": "ਰੀਅਲ-ਟਾਈਮ ਭੂ-ਜਲ ਨਿਗਰਾਨੀ",
      "monitoring_stations": "ਭਾਰਤ ਭਰ ਦੇ 5,260 ਡਬਲਿਊਐਲਆਰ ਸਟੇਸ਼ਨਾਂ ਦੀ ਨਿਗਰਾਨੀ",
      "explore_dashboard": "ਡੈਸ਼ਬੋਰਡ ਐਕਸਪਲੋਰ ਕਰੋ",
      "total_stations": "ਕੁੱਲ ਸਟੇਸ਼ਨ",
      "critical_stations": "ਗੰਭੀਰ ਸਟੇਸ਼ਨ",
      "normal_stations": "ਸਾਧਾਰਣ ਸਟੇਸ਼ਨ",
      "avg_water_trend": "ਔਸਤ ਪਾਣੀ ਦਾ ਰੁਝਾਨ",
      "current_level": "ਮੌਜੂਦਾ ਪਾਣੀ ਦਾ ਪੱਧਰ",
      "water_trend": "ਪਾਣੀ ਦਾ ਰੁਝਾਨ",
      "recharge_events": "ਰੀਚਾਰਜ ਘਟਨਾਵਾਂ",
      "forecast": "15-ਦਿਨ ਦਾ ਪੂਰਵਾਨੁਮਾਨ",
      "available_water": "ਉਪਲਬਧ ਪਾਣੀ",
      "resource_calculation": "ਸਰੋਤ ਗਣਨਾ",
      "generate_report": "ਰਿਪੋਰਟ ਤਿਆਰ ਕਰੋ",
      "download_data": "ਡੇਟਾ ਡਾਊਨਲੋਡ ਕਰੋ",
      "set_alert": "ਅਲਰਟ ਸੈੱਟ ਕਰੋ",
      "station_details": "ਸਟੇਸ਼ਨ ਵੇਰਵੇ",
      "location": "ਟਿਕਾਣਾ",
      "aquifer_type": "ਐਕ్వੀਫਰ ਕਿਸਮ",
      "status": "ਸਥਿਤੀ",
      "safe": "ਸੁਰੱਖਿਅਤ",
      "critical": "ਗੰਭੀਰ",
      "semi_critical": "ਅਰਧ-ਗੰਭੀਰ",
      "last_updated": "ਆਖਰੀ ਅੱਪਡੇਟ"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;