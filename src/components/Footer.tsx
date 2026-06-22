
import React from "react";
import { Cpu, Heart } from "lucide-react";


const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-tech-dark p-12 text-gray-300 mt-auto">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">Revamp</span>
            </div>
            <p className="text-gray-400 max-w-sm leading-relaxed">
              Precision hardware curation and technical assembly for high-performance computing ecosystems.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-bold text-white uppercase tracking-wider text-xs">Navigation</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-400 hover:text-white transition-colors">Console</a></li>
              <li><a href="/builds" className="text-gray-400 hover:text-white transition-colors">Collection</a></li>
              <li><a href="/guides" className="text-gray-400 hover:text-white transition-colors">Blueprints</a></li>
            </ul>
          </div>
          
        </div>
        
        <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-widest">© 2026 Revamp Industries</span>
          </div>
          <div className="flex items-center text-xs text-gray-500 font-medium uppercase tracking-widest">
            <Heart className="w-3 h-3 mr-2 text-tech-purple opacity-50" />
            <span>Revamp Intelligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
